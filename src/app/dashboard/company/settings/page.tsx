import React from "react";
import { getCompanyProfile } from "@/actions/company";
import CompanySettingsForm from "@/components/CompanySettingsForm";

export default async function CompanySettingsPage() {
  const response = await getCompanyProfile();

  if (!response.success || !response.data) {
    return (
      <div className="p-8 text-red-500 bg-[#101415] h-full">
        <h1 className="text-2xl font-black uppercase tracking-widest">Protocol Failure: Data Synchronization Error</h1>
        <p className="mt-4 text-[#d1c6ab]">{response.error || "Critical error: Unable to retrieve company profile from the secure vault."}</p>
      </div>
    );
  }

  const company = response.data;

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex-1 overflow-y-auto bg-[#101415]">
      {/* Page Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mb-3">Calibration</h2>
        <p className="text-[#d1c6ab] text-lg">Manage your company identity and portal protocols with total precision.</p>
      </div>

      <CompanySettingsForm company={company} />
    </div>
  );
}
