"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyTopSearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/company/candidates?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/dashboard/company/candidates`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md group">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#facc15]/40 text-lg group-focus-within:text-[#facc15] transition-colors">search</span>
      <input 
        className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm font-medium focus:outline-none focus:border-[#facc15]/30 text-[#e0e3e5] transition-all placeholder:text-[#d1c6ab]/20" 
        placeholder="Search candidates, roles, or universities..." 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 rounded-lg border border-white/5 text-[8px] font-black uppercase tracking-widest text-[#d1c6ab]/30 pointer-events-none group-focus-within:opacity-0 transition-opacity">
        Enter
      </div>
    </form>
  );
}
