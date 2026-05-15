"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full bg-[#1c2b3c] hover:bg-[#ffb4ab] hover:text-[#690005] text-[#d4e4fa] px-4 py-2 rounded-xl font-bold transition-colors"
    >
      Sign Out
    </button>
  );
}
