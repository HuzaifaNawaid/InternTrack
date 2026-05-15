"use server";

import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ============================================
// HELPER: Get authenticated student session
// Uses: JOIN between users and students tables
// ============================================
async function getAuthenticatedStudent() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "student") {
      return null;
    }
    return session;
}

// ============================================
// 1. GET STUDENT PROFILE
// Uses: SELECT with WHERE clause, INDEX on user_id
// ============================================
export async function getStudentProfile() {
    const session = await getAuthenticatedStudent();
    
    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    const studentUserId = (session.user as any).id;
    const sql = getDb();
    
    try {
        // Query uses idx_students_user_id index for fast lookup
        const studentResult = await sql`
            SELECT s.id, s.full_name, s.profile_score, s.bio, s.skills, 
                   s.university, s.education, s.achievements, u.email
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.user_id = ${studentUserId}
        `;
        if (studentResult.length === 0) return { success: false, error: "Student profile not found" };
        return { success: true, data: studentResult[0] };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ============================================
// 2. GET STUDENT DASHBOARD DATA
// Uses: Stored Function (get_student_application_stats),
//       VIEW (vw_student_applications), JOIN, SUBQUERY,
//       ORDER BY, LIMIT, NOT IN
// ============================================
export async function getStudentDashboardData() {
  const session = await getAuthenticatedStudent();
  if (!session) return { success: false, error: "Unauthorized" };

  const studentUserId = (session.user as any).id;
  const sql = getDb();

  try {
    // Step 1: Fetch student profile
    const studentResult = await sql`
        SELECT id, full_name, profile_score 
        FROM students 
        WHERE user_id = ${studentUserId}
    `;
    if (studentResult.length === 0) {
        return { success: false, error: "Student profile not found" };
    }
    const student = studentResult[0];

    // Step 2: Call stored function for aggregate stats
    // Uses: GROUP BY with COUNT + FILTER (inside the function)
    const statsResult = await sql`SELECT * FROM get_student_application_stats(${student.id})`;
    const stats = statsResult[0] || { total_applications: 0, active_offers: 0, interviews: 0, rejected: 0 };

    // Step 3: Fetch recent applications using the VIEW
    // Uses: VIEW (vw_student_applications) which internally JOINs applications + listings + companies
    const applicationsResult = await sql`
        SELECT * FROM vw_student_applications 
        WHERE student_id = ${student.id}
        ORDER BY applied_at DESC 
        LIMIT 5
    `;

    // Step 4: Fetch recommendations (listings student hasn't applied to)
    // Uses: JOIN, SUBQUERY with NOT IN, ORDER BY, LIMIT
    const recommendationsResult = await sql`
        SELECT l.id, l.title, l.city, l.stipend, l.skills, l.deadline,
               c.name as company_name,
               CASE 
                   WHEN l.deadline = CURRENT_DATE THEN 'closing_today'
                   WHEN l.deadline <= CURRENT_DATE + INTERVAL '3 days' THEN '3_days_left'
                   ELSE 'open'
               END as deadline_status
        FROM listings l
        JOIN companies c ON l.company_id = c.id
        WHERE l.is_active = true 
          AND l.deadline >= CURRENT_DATE
          AND l.id NOT IN (
              SELECT listing_id FROM applications WHERE student_id = ${student.id}
          )
        ORDER BY l.created_at DESC
        LIMIT 2
    `;

    return {
      success: true,
      data: {
        student,
        stats,
        recentApplications: applicationsResult,
        recommendations: recommendationsResult
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// 3. GET ALL APPLICATIONS (My Applications page)
// Uses: VIEW (vw_student_applications), ORDER BY
// ============================================
export async function getStudentAllApplications() {
    const profile = await getStudentProfile();
    if (!profile.success || !profile.data) return profile;

    const sql = getDb();
    try {
        // Uses the vw_student_applications VIEW which JOINs 3 tables
        const result = await sql`
            SELECT * FROM vw_student_applications 
            WHERE student_id = ${profile.data.id} 
            ORDER BY applied_at DESC
        `;
        return { success: true, data: result };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ============================================
// 4. GET ACTIVE LISTINGS (Companies page)
// Uses: JOIN, WHERE with multiple conditions, 
//       ORDER BY, aggregate SUBQUERY for application count
// ============================================
export async function getActiveListings(searchQuery?: string) {
    const profile = await getStudentProfile();
    if (!profile.success || !profile.data) return profile;

    const sql = getDb();
    try {
        const searchPattern = searchQuery ? `%${searchQuery}%` : '%';
        
        // JOIN listings with companies, LEFT JOIN to check if student already applied
        // Uses: JOIN, LEFT JOIN, SUBQUERY, GROUP BY (inside subquery), ORDER BY
        const result = await sql`
            SELECT l.id, l.title, l.description, l.city, l.stipend, l.skills, 
                   l.deadline, l.created_at,
                   c.name as company_name, c.website as company_website,
                   CASE WHEN a.id IS NOT NULL THEN true ELSE false END as already_applied,
                   (SELECT COUNT(*) FROM applications WHERE listing_id = l.id) as total_applicants,
                   CASE 
                       WHEN l.deadline = CURRENT_DATE THEN 'closing_today'
                       WHEN l.deadline <= CURRENT_DATE + INTERVAL '3 days' THEN '3_days_left'
                       ELSE 'open'
                   END as deadline_status
            FROM listings l
            JOIN companies c ON l.company_id = c.id
            LEFT JOIN applications a ON a.listing_id = l.id AND a.student_id = ${profile.data.id}
            WHERE (
                  l.title ILIKE ${searchPattern} 
                  OR c.name ILIKE ${searchPattern}
                  OR CAST(l.stipend AS TEXT) ILIKE ${searchPattern}
                  OR l.city ILIKE ${searchPattern}
              )
            ORDER BY l.created_at DESC
        `;
        return { success: true, data: result };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ============================================
// 5. APPLY FOR A JOB
// Uses: INSERT with UNIQUE constraint check,
//       triggers trg_update_profile_score (indirectly)
// ============================================
export async function applyForJob(listingId: number) {
    const profile = await getStudentProfile();
    if (!profile.success || !profile.data) return { success: false, error: "Unauthorized" };

    const sql = getDb();
    try {
        // Check if listing exists and is still active
        const listingCheck = await sql`
            SELECT id, deadline, is_active 
            FROM listings 
            WHERE id = ${listingId} AND is_active = true AND deadline >= CURRENT_DATE
        `;
        
        if (listingCheck.length === 0) {
            return { success: false, error: "This listing is no longer accepting applications." };
        }

        // Check for duplicate application (UNIQUE constraint: student_id + listing_id)
        const duplicateCheck = await sql`
            SELECT id FROM applications 
            WHERE student_id = ${profile.data.id} AND listing_id = ${listingId}
        `;
        
        if (duplicateCheck.length > 0) {
            return { success: false, error: "You have already applied to this position." };
        }

        // INSERT new application
        await sql`
            INSERT INTO applications (student_id, listing_id, status, applied_at)
            VALUES (${profile.data.id}, ${listingId}, 'applied', NOW())
        `;
        
        return { success: true };
    } catch (e: any) {
        // Handle unique constraint violation gracefully
        if (e.message?.includes('unique') || e.message?.includes('duplicate')) {
            return { success: false, error: "You have already applied to this position." };
        }
        return { success: false, error: e.message };
    }
}

// ============================================
// 6. UPDATE STUDENT PROFILE (Settings page)
// Uses: UPDATE, triggers trg_update_profile_score,
//       ARRAY type handling for skills
// ============================================
export async function updateStudentProfileData(formData: FormData) {
    const profile = await getStudentProfile();
    if (!profile.success || !profile.data) return { success: false, error: "Unauthorized" };

    const sql = getDb();
    
    const fullName = formData.get("full_name") as string;
    const bio = formData.get("bio") as string;
    const university = formData.get("university") as string;
    const education = formData.get("education") as string;
    const achievements = formData.get("achievements") as string;
    const skillsString = formData.get("skills") as string;
    const skills = skillsString ? skillsString.split(",").map(s => s.trim()).filter(Boolean) : [];

    try {
        // UPDATE triggers the trg_update_profile_score trigger
        // which calls calculate_profile_score() function
        // to automatically recalculate the profile_score column
        await sql`
            UPDATE students 
            SET full_name = ${fullName}, 
                bio = ${bio}, 
                university = ${university}, 
                education = ${education},
                achievements = ${achievements},
                skills = ${skills},
                updated_at = NOW()
            WHERE id = ${profile.data.id}
        `;
        
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}



// ============================================
// 8. DEACTIVATE ACCOUNT (Settings page)
// Uses: DELETE with CASCADE (removes student + applications + reviews)
// ============================================
export async function deactivateStudentAccount() {
    const session = await getAuthenticatedStudent();
    if (!session) return { success: false, error: "Unauthorized" };

    const studentUserId = (session.user as any).id;
    const sql = getDb();

    try {
        // DELETE from users table — CASCADE will automatically
        // remove the student record, all their applications,
        // and all their reviews due to ON DELETE CASCADE constraints
        await sql`DELETE FROM users WHERE id = ${studentUserId}`;
        
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ============================================
// 9. WITHDRAW APPLICATION
// Uses: DELETE with WHERE, SUBQUERY
// ============================================
export async function withdrawApplication(applicationId: number) {
    const profile = await getStudentProfile();
    if (!profile.success || !profile.data) return { success: false, error: "Unauthorized" };

    const sql = getDb();

    try {
        // Only allow withdrawal of own applications with 'applied' status
        const result = await sql`
            DELETE FROM applications 
            WHERE id = ${applicationId} 
              AND student_id = ${profile.data.id}
              AND status = 'applied'
            RETURNING id
        `;

        if (result.length === 0) {
            return { success: false, error: "Cannot withdraw this application. It may have already been processed." };
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
