import React from "react";
import { getCompanyApplicants } from "@/actions/company";
import CandidateRefreshButton from "@/components/CandidateRefreshButton";

export default async function CandidatesPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;

  const applicantsResponse = await getCompanyApplicants(search);
  const applicants = applicantsResponse.data || [];

  const totalCandidates = applicants.length;
  const inScreening = applicants.filter((a: any) => a.status === "applied" || a.status === "shortlisted").length;
  const interviewing = applicants.filter((a: any) => a.status === "interview").length;

  return (
    <div className="p-8 h-full bg-[#101415] flex-1 overflow-y-auto">
      {/* Page Header */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mb-3">Candidates</h2>
          <p className="text-[#d1c6ab] text-lg">Monitor and track your applicant pool across the recruitment vector.</p>
        </div>
        <CandidateRefreshButton />
      </div>

      {/* Active Search Indicator */}
      {search && (
        <div className="mb-8 flex items-center gap-3 bg-[#facc15]/5 border border-[#facc15]/20 rounded-2xl px-6 py-4 animate-pulse">
          <span className="material-symbols-outlined text-[#facc15]">search</span>
          <p className="text-sm text-[#e0e3e5] font-black uppercase tracking-widest">
            Filtering Results: <span className="text-[#facc15]">&quot;{search}&quot;</span>
            <span className="text-[#d1c6ab]/50 ml-4 font-bold">({totalCandidates} Match Detected)</span>
          </p>
        </div>
      )}

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#191c1e] p-8 rounded-[32px] border border-white/5 flex flex-col justify-between hover:border-[#facc15]/30 transition-all group relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#facc15]/5 blur-3xl rounded-full group-hover:bg-[#facc15]/10 transition-all"></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/50">Total Talent Pool</p>
            <h3 className="text-5xl font-black text-[#facc15] tracking-tighter mt-4">{totalCandidates.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-[#191c1e] p-8 rounded-[32px] border border-white/5 flex flex-col justify-between hover:border-[#facc15]/30 transition-all group relative overflow-hidden">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/50">Active Screening</p>
            <h3 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mt-4">{inScreening}</h3>
          </div>
        </div>

        <div className="bg-[#191c1e] p-8 rounded-[32px] border border-white/5 flex flex-col justify-between hover:border-[#facc15]/30 transition-all group relative overflow-hidden">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/50">Interview Phase</p>
            <h3 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mt-4">{interviewing}</h3>
          </div>
        </div>
      </div>

      {/* Candidates Detail Surface */}
      <div className="bg-[#191c1e] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#0b0f10]/30">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#d1c6ab]">Candidate Pipeline Stream</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0b0f10]/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Candidate / Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Institution</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Vector Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <span className="material-symbols-outlined text-8xl mb-6">person_search</span>
                      <p className="text-xl font-black uppercase tracking-widest">No Signal Detected</p>
                    </div>
                  </td>
                </tr>
              ) : (
                applicants.map((candidate: any) => (
                  <tr key={candidate.application_id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="h-12 w-12 rounded-2xl bg-[#facc15] text-[#3c2f00] flex items-center justify-center font-black text-xl shadow-lg shadow-[#facc15]/10">
                          {candidate.student_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-lg font-black text-[#e0e3e5] tracking-tight group-hover:text-[#facc15] transition-colors">{candidate.student_name}</p>
                          <p className="text-[10px] font-bold text-[#d1c6ab]/40 uppercase tracking-widest mt-1">Initiated {new Date(candidate.applied_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-[#d1c6ab]">{candidate.university || "—"}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#e0e3e5] tracking-tight">{candidate.job_title}</td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        candidate.status === 'offered' ? 'bg-[#facc15] text-[#3c2f00] border-[#facc15]' :
                        candidate.status === 'interview' ? 'bg-[#facc15]/5 text-[#facc15] border-[#facc15]/30 shadow-[0_0_15px_rgba(250,204,21,0.05)]' :
                        'bg-white/5 text-[#d1c6ab]/50 border-white/10'
                      }`}>
                        {candidate.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-[#0b0f10]/30 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab]/30">Metrics: {applicants.length} Synchronized Profiles</p>
        </div>
      </div>
    </div>
  );
}
