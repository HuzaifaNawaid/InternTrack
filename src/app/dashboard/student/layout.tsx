import React from "react";
import Link from "next/link";
import { getStudentProfile } from "@/actions/student";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/SidebarNav";
import TopSearchBar from "@/components/TopSearchBar";
import SignOutButton from "@/components/SignOutButton";

export default async function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const profileResponse = await getStudentProfile();

  if (!profileResponse.success || !profileResponse.data) {
    redirect("/");
  }

  const student = profileResponse.data;

  return (
    <div className="font-sans text-base overflow-x-hidden min-h-screen bg-[#101415] text-[#e0e3e5]">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0b0f10] flex flex-col p-8 border-r border-white/5 z-50">
        <div className="mb-12">
          <h1 className="text-2xl font-black text-[#facc15] tracking-tighter">InternTrack</h1>
          <p className="text-[#d1c6ab] text-xs font-bold uppercase tracking-widest opacity-60">Student Portal</p>
        </div>
        <SidebarNav />
        <div className="mt-auto">
          <SignOutButton />
        </div>
      </aside>

      {/* TopAppBar */}
      <header className="fixed top-0 right-0 z-40 flex justify-between items-center h-16 px-8 w-[calc(100%-16rem)] ml-64 bg-[#0b0f10]/50 backdrop-blur-xl border-b border-white/5">
        <TopSearchBar />
        <div className="flex items-center gap-6">
          <div className="h-6 w-px bg-white/5 mx-2"></div>
          <div className="flex items-center gap-2 font-bold">
             {student.full_name}
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}
