import React from "react";
import Link from "next/link";
import { getStudentDashboardData } from "@/actions/student";

export default async function StudentDashboardPage() {
  const response = await getStudentDashboardData();

  if (!response.success || !response.data) {
    return (
      <div className="p-8 bg-[#101415] h-full">
        <h1 className="text-3xl font-black text-red-500 mb-4 uppercase tracking-tighter">Sync Failed: Unauthorized Access</h1>
        <p className="text-[#d1c6ab]">{response.error || "Critical error: Unable to decrypt dashboard data."}</p>
      </div>
    );
  }

  const { student, stats, recentApplications, recommendations } = response.data;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8 bg-[#101415] h-full flex flex-col">
      {/* Welcome Section */}
      <section className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mb-2">Welcome, {student.full_name.split(' ')[0]}.</h2>
          <p className="text-[#d1c6ab] text-lg font-medium">System status: <span className="text-[#facc15] font-black">{stats.interviews || 0} active interviews</span> synchronized for this cycle.</p>
        </div>
        <Link href="/dashboard/student/companies" className="bg-[#facc15] text-[#3c2f00] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#facc15]/10">
          Initialize Application
        </Link>
      </section>

      {/* Stats Bento Matrix */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#191c1e] p-8 rounded-[32px] border border-white/5 flex flex-col justify-between h-44 group hover:border-[#facc15]/40 transition-all relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#facc15]/5 blur-2xl rounded-full"></div>
          <div className="flex justify-between items-start relative z-10">
            <span className="material-symbols-outlined text-[#facc15] opacity-50">send</span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 mb-2">Total Deployments</p>
            <h3 className="text-5xl font-black text-[#e0e3e5] tracking-tighter">{stats.total_applications || 0}</h3>
          </div>
        </div>

        <div className="bg-[#191c1e] p-8 rounded-[32px] border border-white/5 flex flex-col justify-between h-44 group hover:border-[#facc15]/40 transition-all relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <span className="material-symbols-outlined text-[#facc15] opacity-50">workspace_premium</span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 mb-2">Active Offers</p>
            <h3 className="text-5xl font-black text-[#facc15] tracking-tighter">{stats.active_offers || 0}</h3>
          </div>
        </div>

        <div className="bg-[#191c1e] p-8 rounded-[32px] border border-white/5 flex flex-col justify-between h-44 group hover:border-[#facc15]/40 transition-all relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <span className="material-symbols-outlined text-[#facc15] opacity-50">group</span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 mb-2">Interview Phases</p>
            <h3 className="text-5xl font-black text-[#e0e3e5] tracking-tighter">{stats.interviews || 0}</h3>
          </div>
        </div>

        <div className="bg-[#191c1e] p-8 rounded-[32px] border border-white/5 flex flex-col justify-between h-44 group hover:border-red-500/40 transition-all relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <span className="material-symbols-outlined text-red-500 opacity-50">cancel</span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 mb-2">Deactivated</p>
            <h3 className="text-5xl font-black text-[#e0e3e5] tracking-tighter">{stats.rejected || 0}</h3>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Applications Feed */}
        <section className="xl:col-span-2">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-black text-[#e0e3e5] tracking-tight uppercase">Recent Submissions</h3>
            <Link className="text-[#facc15] text-[10px] font-black uppercase tracking-widest hover:underline" href="/dashboard/student/applications">View All History</Link>
          </div>
          <div className="bg-[#191c1e] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0b0f10]/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Organization</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Role Matrix</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Vector Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentApplications.length === 0 ? (
                  <tr>
                      <td colSpan={4} className="px-8 py-24 text-center text-[#d1c6ab]/30 font-black uppercase tracking-widest text-xs">No active signals found.</td>
                  </tr>
                ) : (
                  recentApplications.map((app: any) => (
                    <tr key={app.application_id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <span className="text-lg font-black text-[#e0e3e5] tracking-tight group-hover:text-[#facc15] transition-colors">{app.company_name}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-[#d1c6ab]">{app.listing_title}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium text-[#d1c6ab]/40">{formatDate(app.applied_at)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all 
                          ${app.status === 'applied' ? 'bg-white/5 text-[#d1c6ab] border-white/10' : ''}
                          ${app.status === 'interview' ? 'bg-[#facc15]/10 text-[#facc15] border-[#facc15]/30' : ''}
                          ${app.status === 'rejected' ? 'bg-red-900/10 text-red-400 border-red-900/30' : ''}
                          ${app.status === 'offered' ? 'bg-[#facc15] text-[#3c2f00] border-[#facc15]' : ''}
                        `}>
                          {app.status}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Matches Sidebar */}
        <section className="xl:col-span-1">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-black text-[#e0e3e5] tracking-tight uppercase">Top Matches</h3>
          </div>
          <div className="space-y-6">
            {recommendations.length === 0 ? (
              <div className="bg-[#191c1e] border border-white/5 border-dashed rounded-[32px] p-12 text-center opacity-30">
                  <span className="material-symbols-outlined text-4xl mb-4">radar</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Scanning for opportunities...</p>
              </div>
            ) : (
              recommendations.map((rec: any, index: number) => (
                <div key={rec.id} className="bg-[#191c1e] border border-white/5 rounded-[40px] overflow-hidden group transition-all hover:-translate-y-2 shadow-xl hover:border-[#facc15]/30">
                  <div className={`h-2 bg-[#facc15]/20 ${index % 2 === 0 ? 'bg-[#facc15]' : 'bg-white/10'}`}></div>
                  <div className="p-8">
                    <div className="mb-4">
                        <h4 className="font-black text-[#e0e3e5] text-xl tracking-tight leading-tight group-hover:text-[#facc15] transition-colors">{rec.title}</h4>
                        <p className="text-[#d1c6ab] text-xs font-bold mt-2 uppercase tracking-widest opacity-60">{rec.company_name} • {rec.city}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-8 bg-[#0b0f10]/50 px-4 py-2 rounded-xl border border-white/5 w-fit">
                        <span className="text-[#facc15] font-black text-xs">PKR {rec.stipend?.toLocaleString()}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#d1c6ab]/30">/ Month</span>
                    </div>
                    
                    <Link href={`/dashboard/student/companies`} className="block w-full text-center bg-[#0b0f10] text-[#e0e3e5] border border-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#facc15] hover:text-[#3c2f00] transition-all">
                        Initiate Protocol
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
