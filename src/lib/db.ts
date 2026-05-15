import { neon } from "@neondatabase/serverless";

/**
 * Creates and returns a Neon serverless SQL client.
 * Uses the HTTP-based driver — no persistent connections, no pool overhead.
 * Perfect for serverless environments (Vercel Edge / Lambda).
 *
 * Usage:
 *   const sql = getDb();
 *   const result = await sql`SELECT * FROM users WHERE id = ${userId}`;
 */
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Please add it to your .env.local file."
    );
  }

  return neon(databaseUrl);
}

/**
 * Convenience: pre-initialized SQL tagged template function.
 * Import this directly in Server Actions for cleaner code.
 *
 * Usage:
 *   import { sql } from "@/lib/db";
 *   const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
 */
export const sql = getDb();
