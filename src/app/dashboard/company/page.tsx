import React from "react";
import { getCompanyApplicants } from "@/actions/company";
import KanbanBoard from "@/components/KanbanBoard";

export default async function CompanyDashboardPage() {
  const applicantsResponse = await getCompanyApplicants();
  
  const applicants = applicantsResponse.data || [];

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-[#101415] p-8 h-full">
      <KanbanBoard initialApplicants={applicants} />
    </div>
  );
}
