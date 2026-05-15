import React from "react";
import { getStudentProfile } from "@/actions/student";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const response = await getStudentProfile();

  if (!response.success || !response.data) {
    return (
      <div className="p-8 bg-[#101415] h-full">
        <h1 className="text-2xl font-black uppercase tracking-widest text-red-500">Protocol Failure: Profile Synchronization Error</h1>
        <p className="mt-4 text-[#d1c6ab]">{response.error || "Critical error: Unable to retrieve student profile."}</p>
      </div>
    );
  }

  const student = response.data;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-[#101415] h-full flex flex-col">
      {/* Page Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mb-3">Profile Calibration</h2>
        <p className="text-[#d1c6ab] text-lg font-medium">Manage your professional identity and application parameters with total precision.</p>
      </div>

      <SettingsForm student={student} />
    </div>
  );
}
