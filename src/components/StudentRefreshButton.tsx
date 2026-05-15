"use client";

import { useRouter } from "next/navigation";

export default function StudentRefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    router.push("/dashboard/student/companies");
  };

  return (
    <button
      onClick={handleRefresh}
      className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/5 bg-[#191c1e] text-[#d1c6ab] hover:text-[#facc15] hover:border-[#facc15]/30 transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20"
    >
      <span className="material-symbols-outlined text-sm">refresh</span>
      Reset Matrix
    </button>
  );
}
