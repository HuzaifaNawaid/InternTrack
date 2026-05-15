"use client";

import { useRouter } from "next/navigation";

export default function CandidateRefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    router.push("/dashboard/company/candidates");
  };

  return (
    <button
      onClick={handleRefresh}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#facc15]/40 text-[#facc15] hover:bg-[#facc15]/10 transition-all text-xs font-bold"
    >
      <span className="material-symbols-outlined text-sm">refresh</span>
      Show All
    </button>
  );
}
