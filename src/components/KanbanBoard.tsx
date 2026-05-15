"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/actions/company";

type Applicant = {
  application_id: number;
  student_name: string;
  university: string | null;
  major: string | null;
  job_title: string;
  status: string;
  applied_at: string;
};

const COLUMNS = [
  { id: "applied", label: "Applied" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interviewing" },
  { id: "offered", label: "Offered" },
  { id: "rejected", label: "Rejected" },
];

export default function KanbanBoard({ initialApplicants }: { initialApplicants: Applicant[] }) {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (appId: number, newStatus: string) => {
    setUpdatingId(appId);
    
    // Optimistic UI update
    setApplicants(prev => 
      prev.map(app => app.application_id === appId ? { ...app, status: newStatus } : app)
    );

    const res = await updateApplicationStatus(appId, newStatus);
    if (!res.success) {
      alert("Failed to update status: " + res.error);
      // Revert if failed
      setApplicants(initialApplicants);
    }
    
    setUpdatingId(null);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "applied": return "border-[#facc15] text-[#facc15]";
      case "shortlisted": return "border-[#d1c6ab] text-[#d1c6ab]";
      case "interview": return "border-[#facc15] text-[#facc15] shadow-[0_0_10px_rgba(250,204,21,0.2)]";
      case "offered": return "bg-[#facc15] text-[#3c2f00] font-black";
      case "rejected": return "bg-[#363a3b] text-[#d1c6ab] opacity-50";
      default: return "border-white/10 text-[#d1c6ab]";
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] overflow-x-auto pb-6 custom-scrollbar px-2">
      {COLUMNS.map((col) => {
        const columnApps = applicants.filter(a => (a.status || "applied") === col.id);
        
        return (
          <div key={col.id} className="min-w-[320px] w-[320px] flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-[#e0e3e5] tracking-tighter flex items-center gap-2">
                {col.label} 
                <span className="text-xs font-bold px-2 py-0.5 bg-[#191c1e] text-[#facc15] rounded-full border border-white/5">
                    {columnApps.length}
                </span>
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 custom-scrollbar">
              {columnApps.length === 0 ? (
                 <div className="text-xs text-[#d1c6ab]/40 uppercase tracking-widest font-black text-center py-12 border border-white/5 border-dashed rounded-2xl">
                    Sector Clear
                 </div>
              ) : (
                columnApps.map((app) => (
                  <div 
                    key={app.application_id} 
                    className={`bg-[#191c1e] border border-white/5 p-6 rounded-2xl transition-all cursor-pointer group relative overflow-hidden ${
                      col.id === "rejected" ? "opacity-40 grayscale" : "hover:border-[#facc15]/40 hover:shadow-[0_0_20px_rgba(250,204,21,0.05)] hover:-translate-y-1"
                    } ${updatingId === app.application_id ? "opacity-50" : ""}`}
                  >
                    {/* Decorative Vector */}
                    <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#facc15]/5 blur-2xl rounded-full group-hover:bg-[#facc15]/10 transition-all"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-black text-[#e0e3e5] tracking-tight group-hover:text-[#facc15] transition-colors">{app.student_name}</h4>
                        
                        {/* Context Menu for Status Change */}
                        <div className="relative group/menu">
                            <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] border transition-all ${getStatusColor(col.id)}`}>
                                {col.id}
                            </span>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 bg-[#0b0f10] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 w-40 overflow-hidden backdrop-blur-xl">
                                {COLUMNS.map(c => (
                                <div 
                                    key={c.id} 
                                    onClick={() => handleStatusChange(app.application_id, c.id)}
                                    className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab] hover:bg-[#191c1e] hover:text-[#facc15] cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                                >
                                    Relocate to {c.label}
                                </div>
                                ))}
                            </div>
                        </div>
                        </div>
                        
                        <div className="space-y-1 mb-6">
                            <p className="text-[#d1c6ab] text-xs font-medium">{app.university || "University"}</p>
                            <p className="text-[#d1c6ab]/60 text-[10px] uppercase tracking-widest font-bold">{app.major || "Discipline Unspecified"}</p>
                        </div>

                        <div className="bg-[#0b0f10]/50 p-3 rounded-xl border border-white/5 mb-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 mb-1">Target Role</p>
                            <p className="text-sm font-bold text-[#e0e3e5]">{app.job_title}</p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#facc15] text-[#3c2f00] flex items-center justify-center text-[10px] font-black">
                                {getInitials(app.student_name)}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40">Verified</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#d1c6ab]/30">
                            {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
