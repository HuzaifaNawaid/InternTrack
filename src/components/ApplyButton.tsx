"use client";

import React, { useState, useTransition } from "react";
import { applyForJob } from "@/actions/student";

export default function ApplyButton({ listingId, alreadyApplied }: { listingId: number; alreadyApplied: boolean }) {
  const [applied, setApplied] = useState(alreadyApplied);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleApply() {
    setError("");
    startTransition(async () => {
      const result = await applyForJob(listingId);
      if (result.success) {
        setApplied(true);
      } else {
        setError(result.error || "Failed to apply.");
      }
    });
  }

  if (applied) {
    return (
      <div className="inline-flex px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-[#d1c6ab] border border-white/10 opacity-50 cursor-not-allowed">
        Application Sent
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button 
        onClick={handleApply}
        disabled={isPending}
        className="bg-[#facc15] text-[#3c2f00] px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#facc15]/10 disabled:opacity-50"
      >
        {isPending ? "Initializing..." : "Initiate Application"}
      </button>
      {error && <p className="text-[9px] font-black uppercase tracking-widest text-red-400 max-w-[200px] text-right">{error}</p>}
    </div>
  );
}
