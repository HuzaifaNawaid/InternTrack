"use server";

import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getAuthenticatedCompany() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "company") {
        return null; // Return null so we can bypass in dev
    }
    return session;
}

export async function getCompanyProfile() {
    const session = await getAuthenticatedCompany();
    
    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    const companyUserId = (session.user as any).id;
    const sql = getDb();

    try {
        // Query without logo_url for now as it might be missing in live DB
        const companyResult = await sql`
            SELECT c.id, c.name, c.description, c.website, u.email
            FROM companies c
            JOIN users u ON c.user_id = u.id
            WHERE c.user_id = ${companyUserId}
        `;
        
        if (companyResult.length === 0) {
            // Auto-create profile if missing for a valid company user (Dev convenience)
            const newCompany = await sql`
                INSERT INTO companies (user_id, name)
                VALUES (${companyUserId}, ${session.user?.name || "My Company"})
                RETURNING id, name, description, website
            `;
            return { success: true, data: { ...newCompany[0], email: session.user?.email, logo_url: "" } };
        }

        return { success: true, data: { ...companyResult[0], logo_url: "" } };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getCompanyDashboardStats() {
    const session = await getAuthenticatedCompany();
    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    const profile = await getCompanyProfile();
    if (!profile.success || !profile.data) return profile;

    const sql = getDb();
    try {
        const statsResult = await sql`
            SELECT 
                COUNT(*) as total_listings,
                COUNT(*) FILTER (WHERE is_active = true) as active_listings,
                (SELECT COUNT(*) FROM applications a JOIN listings l ON a.listing_id = l.id WHERE l.company_id = ${profile.data.id}) as total_applications
            FROM listings
            WHERE company_id = ${profile.data.id}
        `;
        return { success: true, data: statsResult[0] };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getCompanyListings() {
    const session = await getAuthenticatedCompany();
    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    const profile = await getCompanyProfile();
    if (!profile.success || !profile.data) return profile;

    const sql = getDb();
    try {
        const listings = await sql`
            SELECT id, title, description, city, stipend, is_active, created_at,
            (SELECT COUNT(*) FROM applications a WHERE a.listing_id = listings.id) as applicant_count
            FROM listings
            WHERE company_id = ${profile.data.id}
            ORDER BY created_at DESC
        `;
        return { success: true, data: listings };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getCompanyApplicants(search?: string) {
    const session = await getAuthenticatedCompany();
    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    const profile = await getCompanyProfile();
    if (!profile.success || !profile.data) return profile;

    const sql = getDb();
    try {
        const searchTerm = search ? `%${search}%` : null;
        
        const applicants = await sql`
            SELECT 
                a.id as application_id,
                s.full_name as student_name,
                s.university,
                l.title as job_title,
                a.status,
                a.applied_at
            FROM applications a
            JOIN students s ON a.student_id = s.id
            JOIN listings l ON a.listing_id = l.id
            WHERE l.company_id = ${profile.data.id}
            ${searchTerm ? sql`AND (s.full_name ILIKE ${searchTerm} OR s.university ILIKE ${searchTerm} OR l.title ILIKE ${searchTerm})` : sql``}
            ORDER BY a.applied_at DESC
        `;
        return { success: true, data: applicants };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateApplicationStatus(applicationId: number, status: string) {
    const session = await getAuthenticatedCompany();
    if (!session) return { success: false, error: "Unauthorized" };

    const profile = await getCompanyProfile();
    if (!profile.success || !profile.data) return profile;

    const sql = getDb();
    try {
        // Verify ownership before update
        const verify = await sql`
            SELECT a.id FROM applications a 
            JOIN listings l ON a.listing_id = l.id 
            WHERE a.id = ${applicationId} AND l.company_id = ${profile.data.id}
        `;
        if (verify.length === 0) return { success: false, error: "Unauthorized or Application not found" };

        await sql`
            UPDATE applications 
            SET status = ${status}
            WHERE id = ${applicationId}
        `;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateCompanyProfileData(formData: FormData) {
    const session = await getAuthenticatedCompany();
    if (!session) return { success: false, error: "Unauthorized" };

    const companyUserId = (session.user as any).id;
    const name = formData.get("name") as string;
    const website = formData.get("website") as string;
    const description = formData.get("description") as string;
    const city = formData.get("city") as string;

    const sql = getDb();
    try {
        await sql`
            UPDATE companies
            SET 
                name = ${name}, 
                website = ${website}, 
                description = ${description},
                city = ${city},
                updated_at = now()
            WHERE user_id = ${companyUserId}
        `;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function createListing(formData: FormData) {
    const session = await getAuthenticatedCompany();
    if (!session) return { success: false, error: "Unauthorized" };

    const profile = await getCompanyProfile();
    if (!profile.success || !profile.data) return { success: false, error: "Company profile missing" };

    const companyId = profile.data.id;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const city = formData.get("city") as string;
    const stipend = parseInt(formData.get("stipend") as string) || 0;
    const deadline = formData.get("deadline") as string;
    const skills = (formData.get("skills") as string)?.split(",").map(s => s.trim()).filter(s => s) || [];

    const sql = getDb();
    try {
        await sql`
            INSERT INTO listings (company_id, title, description, city, stipend, skills, deadline)
            VALUES (${companyId}, ${title}, ${description}, ${city}, ${stipend}, ${skills}, ${deadline})
        `;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deactivateCompanyAccount() {
    const session = await getAuthenticatedCompany();
    if (!session) return { success: false, error: "Unauthorized" };

    const companyUserId = (session.user as any).id;
    const sql = getDb();
    try {
        // This will cascade delete company, listings, applications, etc.
        await sql`DELETE FROM users WHERE id = ${companyUserId}`;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
