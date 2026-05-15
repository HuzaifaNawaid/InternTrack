import React from "react";
import { getCompanyProfile } from "@/actions/company";
import { redirect } from "next/navigation";
import CompanyTopSearchBar from "@/components/CompanyTopSearchBar";
import CompanySidebarNav from "@/components/CompanySidebarNav";
import SignOutButton from "@/components/SignOutButton";

export default async function CompanyDashboardLayout({ children }: { children: React.ReactNode }) {
  const profileResponse = await getCompanyProfile();
  
  if (!profileResponse.success || !profileResponse.data) {
    redirect("/");
  }

  const company = profileResponse.data;

  return (
    <div className="font-sans text-base overflow-x-hidden min-h-screen bg-[#101415] text-[#e0e3e5]">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col p-8 gap-2 bg-[#0b0f10] border-r border-white/5 w-[260px] z-50">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#facc15]">InternTrack</h2>
          <p className="text-[#d1c6ab] text-sm opacity-70">Recruiter Portal</p>
        </div>
        <CompanySidebarNav />
        
        <div className="mt-auto flex flex-col gap-2">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[260px] h-screen flex flex-col">
        {/* TopNavBar */}
        <header className="h-16 flex justify-between items-center px-6 border-b border-white/5 bg-[#0b0f10]/50 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4 flex-1">
            <CompanyTopSearchBar />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l border-[#273647] pl-6 ml-2">
              <img alt="Company Profile" className="w-10 h-10 rounded-full border border-[#facc15]/50 object-cover" src={company.logo_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuC-pJP7bJcz35OJEphZ7riBx1yg7yA11F3RztsF-Fl6MQdm91vc30cRB9DGheLWObte3ZGGRpH_ZC0fsZnpoWyceSfAT5ky1pOjeXzzLT9Ov9f4xmj2XX_-RHCTkse2AF6b5O09M27EIv3kSyCWVqsrQNf3at6J_27_aN4XYguchTzU79eQ0k7BJ87r4t8k-FWqm8Du6q6PKWf4gt5yA4geFL1Ksd5spjHFbPS6tyoOn2KTfWsLngmObaiiE5JUIeuE1GTywNsTTqK8"} />
              <p className="text-base font-bold text-[#facc15]">{company.name}</p>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        {children}
      </main>
    </div>
  );
}
