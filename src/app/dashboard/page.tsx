import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardController() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const role = (session.user as any)?.role;

  if (role === "student") {
    redirect("/dashboard/student");
  } else if (role === "company") {
    redirect("/dashboard/company");
  } else if (role === "admin") {
    redirect("/admin");
  } else {
    // Fallback if role is missing or unknown
    return (
      <div className="min-h-screen bg-[#051424] text-white flex items-center justify-center">
        <p>Invalid role configuration.</p>
      </div>
    );
  }
}
