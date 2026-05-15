"use client";

import React from "react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full py-4 bg-[#facc15] text-[#3c2f00] rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-2xl shadow-[#facc15]/20 group"
    >
      <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform duration-500">logout</span>
      <span>Sign Out</span>
    </button>
  );
}
