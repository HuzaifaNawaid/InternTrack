"use server";

import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { UserRole, ActionResponse } from "@/types";

interface RegisterFormData {
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
  // Student specific
  university?: string;
  major?: string;
  // Company specific
  companyName?: string;
  industry?: string;
}

export async function registerUser(formData: RegisterFormData): Promise<ActionResponse> {
  const sql = getDb();
  
  try {
    // 1. Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${formData.email}`;
    if (existing.length > 0) {
      return { success: false, error: "Email is already registered" };
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // 3. Insert user and related profile using CTE (transactional safety)
    if (formData.role === "student") {
      const education = formData.major || null;
      await sql`
        WITH new_user AS (
          INSERT INTO users (email, password, role)
          VALUES (${formData.email}, ${hashedPassword}, ${formData.role})
          RETURNING id
        )
        INSERT INTO students (user_id, full_name, university, education)
        SELECT id, ${formData.fullName}, ${formData.university || null}, ${education}
        FROM new_user;
      `;
    } else if (formData.role === "company") {
      const name = formData.companyName || formData.fullName;
      const description = formData.industry ? `Industry: ${formData.industry}` : null;
      await sql`
        WITH new_user AS (
          INSERT INTO users (email, password, role)
          VALUES (${formData.email}, ${hashedPassword}, ${formData.role})
          RETURNING id
        )
        INSERT INTO companies (user_id, name, description)
        SELECT id, ${name}, ${description}
        FROM new_user;
      `;
    }

    return { success: true };
  } catch (error: any) {
    console.error("[Auth Action Error]:", error);
    return { success: false, error: "Failed to create account. Please try again." };
  }
}
