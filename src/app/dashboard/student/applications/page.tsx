import React from "react";
import { getStudentAllApplications } from "@/actions/student";
import Link from "next/link";

export default async function ApplicationsPage() {
  const response = await getStudentAllApplications();
  
  if (!response.success || !response.data) {
    return (
      <div className="p-8 bg-[#101415] h-full">
        <h1 className="text-3xl font-black text-red-500 mb-4 uppercase tracking-tighter">Protocol Failure: Data Stream Interrupted</h1>
        <p className="text-[#d1c6ab]">{response.error || "Critical error: Unable to retrieve your application history."}</p>
      </div>
    );
  }

  const applications = response.data;
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'applied') return <div className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] bg-white/5 text-[#d1c6ab] border border-white/10">Applied</div>;
    if (status === 'interview') return <div className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/30">Interview Phase</div>;
    if (status === 'offered') return <div className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] bg-[#facc15] text-[#3c2f00] border border-[#facc15]">Offer Extended</div>;
    if (status === 'rejected') return <div className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] bg-red-900/10 text-red-400 border border-red-900/30">Deactivated</div>;
    return <div className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border border-white/10 text-[#d1c6ab]">{status}</div>;
  };

  return (
    <div className="p-8 bg-[#101415] h-full flex flex-col">
      {/* Page Header Section */}
      <section className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mb-3">Application History</h2>
          <p className="text-[#d1c6ab] text-lg">Track and manage your professional deployment vector in real-time.</p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex justify-between items-center mb-10 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4">
          {["All Submissions", "Applied", "Interview Phase", "Offer", "Deactivated"].map((filter, i) => (
            <button key={filter} className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${i === 0 ? "bg-[#facc15] text-[#3c2f00] border-[#facc15]" : "bg-[#191c1e] text-[#d1c6ab]/40 border-white/5 hover:text-[#d1c6ab] hover:border-white/10"}`}>
                {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Application Table Surface */}
      <div className="bg-[#191c1e] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0b0f10]/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Organization / Matrix</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Deployment Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Initialization Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.length === 0 ? (
                  <tr>
                      <td colSpan={4} className="px-8 py-24 text-center text-[#d1c6ab]/20 font-black uppercase tracking-widest text-sm">No application records found.</td>
                  </tr>
              ) : (
                  applications.map((app: any) => (
                      <tr key={app.application_id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                            <div className="text-lg font-black text-[#e0e3e5] tracking-tight group-hover:text-[#facc15] transition-colors">{app.company_name}</div>
                            <div className="text-[10px] font-bold text-[#d1c6ab]/40 mt-1 uppercase tracking-widest">{app.listing_city}</div>
                        </td>
                        <td className="px-8 py-6">
                            <p className="text-sm font-bold text-[#e0e3e5]">{app.listing_title}</p>
                        </td>
                        <td className="px-8 py-6 text-xs font-medium text-[#d1c6ab]/40">{formatDate(app.applied_at)}</td>
                        <td className="px-8 py-6">
                          {getStatusBadge(app.status)}
                        </td>
                      </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-[#0b0f10]/30 border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab]/30">Metrics: {applications.length} Entries Synchronized</p>
          <div className="flex items-center gap-6">
            <button className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 hover:text-white transition-all disabled:opacity-30">Previous</button>
            <div className="flex gap-4">
              <button className="w-8 h-8 rounded-lg bg-[#facc15] text-[#3c2f00] font-black text-[10px]">1</button>
              <button className="w-8 h-8 rounded-lg bg-white/5 text-[#d1c6ab] font-black text-[10px] hover:bg-white/10">2</button>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 hover:text-white transition-all disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
