import Link from "next/link";
import { getCompanyListings } from "@/actions/company";

export default async function JobPostingsPage({ searchParams }: { searchParams: { status?: string } }) {
  const listingsResponse = await getCompanyListings();
  
  const allListings = listingsResponse.data || [];
  const statusFilter = searchParams.status || "all";

  const listings = allListings.filter((l: any) => {
    if (statusFilter === "active") return l.is_active;
    if (statusFilter === "closed") return !l.is_active;
    return true;
  });

  const activeCount = allListings.filter((l: any) => l.is_active).length;

  return (
    <div className="p-8 h-full bg-[#101415] flex-1 overflow-y-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mb-3">Job Postings</h2>
          <p className="text-[#d1c6ab] text-lg">Manage your active internships and track applicant volume with surgical precision.</p>
        </div>
        <Link 
          href="/dashboard/company/postings/new"
          className="bg-[#facc15] text-[#3c2f00] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-[#facc15]/10"
        >
          <span className="material-symbols-outlined font-black">add</span>
          Post New Job
        </Link>
      </div>

      {/* Dashboard Stats Surface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#191c1e] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#facc15]/5 blur-3xl rounded-full group-hover:bg-[#facc15]/10 transition-all"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/50 mb-4">Total Active Listings</p>
          <div className="flex items-end justify-between">
            <span className="text-5xl font-black text-[#facc15] tracking-tighter">{activeCount}</span>
            <span className="text-[10px] font-black text-[#facc15] bg-[#facc15]/10 px-3 py-1 rounded-full uppercase tracking-widest border border-[#facc15]/20">Live</span>
          </div>
        </div>
      </div>

      {/* Main Listings Interface */}
      <div className="bg-[#191c1e] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-[#0b0f10]/30">
          <div className="flex gap-8">
            {[
              { id: "all", label: "All Sectors" },
              { id: "active", label: "Active" },
              { id: "closed", label: "Deactivated" }
            ].map(filter => (
              <Link 
                key={filter.id}
                href={`/dashboard/company/postings?status=${filter.id}`}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                  statusFilter === filter.id 
                    ? "text-[#facc15]" 
                    : "text-[#d1c6ab]/40 hover:text-[#d1c6ab]"
                }`}
              >
                {filter.label}
                {statusFilter === filter.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#facc15] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0b0f10]/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Vector / Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Deployment</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Volume</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {listings.map((job: any) => (
                <tr key={job.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-lg font-black text-[#e0e3e5] tracking-tight group-hover:text-[#facc15] transition-colors">{job.title}</div>
                    <div className="text-[10px] font-bold text-[#d1c6ab]/40 mt-1 uppercase tracking-widest">Stipend: PKR {job.stipend?.toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-[#d1c6ab]">{job.location || job.city || "Remote"}</td>
                  <td className="px-8 py-6 text-xs text-[#d1c6ab]/50 font-medium">
                    {new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-[#0b0f10] h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-[#facc15] h-full shadow-[0_0_10px_rgba(250,204,21,0.3)]" 
                          style={{ width: `${Math.min((Number(job.applicant_count) / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-[#e0e3e5] font-black">{job.applicant_count}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {job.is_active ? (
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#facc15]/5 border border-[#facc15]/20 text-[#facc15] text-[9px] font-black uppercase tracking-[0.15em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#facc15] mr-2 animate-pulse"></span>
                        Active
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#d1c6ab]/40 text-[9px] font-black uppercase tracking-[0.15em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d1c6ab]/20 mr-2"></span>
                        Deactivated
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-6 bg-[#0b0f10]/30 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab]/30">Metrics: {listings.length} Results Synchronized</p>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#d1c6ab] hover:bg-white/5 hover:text-white transition-all disabled:opacity-30">Previous</button>
            <button className="px-6 py-2 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#d1c6ab] hover:bg-white/5 hover:text-white transition-all disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
