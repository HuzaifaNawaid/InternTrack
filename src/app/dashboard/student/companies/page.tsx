import React from "react";
import { getActiveListings } from "@/actions/student";
import ApplyButton from "@/components/ApplyButton";
import StudentRefreshButton from "@/components/StudentRefreshButton";

export default async function CompaniesPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  
  const response = await getActiveListings(search);
  
  if (!response.success || !response.data) {
    return (
      <div className="p-8 bg-[#101415] h-full">
        <h1 className="text-3xl font-black text-red-500 mb-4 uppercase tracking-tighter">Sync Failed: Data Stream Interrupted</h1>
        <p className="text-[#d1c6ab]">{response.error || "Critical error: Unable to retrieve internship opportunities."}</p>
      </div>
    );
  }

  const listings = response.data;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8 bg-[#101415] h-full flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mb-3">Discovery Matrix</h2>
          <p className="text-[#d1c6ab] text-lg font-medium">Browse and discover new internship vectors synchronized to your profile.</p>
        </div>
        <StudentRefreshButton />
      </div>

      {/* Active Search Indicator */}
      {search && (
        <div className="mb-8 flex items-center gap-3 bg-[#facc15]/5 border border-[#facc15]/20 rounded-2xl px-6 py-4 animate-pulse">
          <span className="material-symbols-outlined text-[#facc15]">search</span>
          <p className="text-sm text-[#e0e3e5] font-black uppercase tracking-widest">
            Filtering Matrix: <span className="text-[#facc15]">&quot;{search}&quot;</span>
            <span className="text-[#d1c6ab]/50 ml-4 font-bold">({listings.length} Signals Detected)</span>
          </p>
        </div>
      )}

      {/* Main Listings Surface */}
      <div className="bg-[#191c1e] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-[#0b0f10]/30">
          <div className="flex gap-10">
            <button className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-[#facc15] pb-2">Active Roles</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0b0f10]/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Role / Organization</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Coordinates</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Deployment Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Compensation</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 text-center">Applicants</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <span className="material-symbols-outlined text-8xl mb-6">work_off</span>
                      <p className="text-xl font-black uppercase tracking-widest">No Signals Detected</p>
                    </div>
                  </td>
                </tr>
              ) : (
                listings.map((listing: any) => (
                  <tr key={listing.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="text-lg font-black text-[#e0e3e5] tracking-tight group-hover:text-[#facc15] transition-colors">{listing.title}</div>
                      <div className="text-[10px] font-bold text-[#d1c6ab]/40 mt-1 uppercase tracking-widest">{listing.company_name}</div>
                    </td>
                    <td className="px-8 py-6">
                        <span className="text-sm font-bold text-[#d1c6ab]">{listing.city || "Global / Remote"}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-[#d1c6ab]/60">{formatDate(listing.created_at)}</span>
                        {listing.deadline_status === 'closing_today' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-red-900/10 text-red-500 text-[8px] font-black uppercase tracking-widest border border-red-900/30 w-fit animate-pulse">
                            Closing Imminent
                          </span>
                        )}
                        {listing.deadline_status === '3_days_left' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#facc15]/10 text-[#facc15] text-[8px] font-black uppercase tracking-widest border border-[#facc15]/30 w-fit">
                            Final 72 Hours
                          </span>
                        )}
                        {listing.deadline_status === 'open' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/5 text-green-400 text-[8px] font-black uppercase tracking-widest border border-white/10 w-fit">
                            Open Vector
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2 bg-[#0b0f10] px-4 py-2 rounded-xl border border-white/5 w-fit">
                            <span className="text-[#facc15] font-black text-xs">PKR {listing.stipend?.toLocaleString()}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#d1c6ab]/30">/ MO</span>
                        </div>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-[#e0e3e5] text-xl">
                      {listing.total_applicants || 0}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <ApplyButton listingId={listing.id} alreadyApplied={listing.already_applied} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 border-t border-white/5 bg-[#0b0f10]/30">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab]/30">Metrics: {listings.length} Active Prototypes Synchronized</p>
        </div>
      </div>
    </div>
  );
}
