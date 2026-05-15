"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CompanySidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/company", label: "Dashboard", icon: "dashboard" },
    { href: "/dashboard/company/candidates", label: "Candidates", icon: "group" },
    { href: "/dashboard/company/postings", label: "Jobs", icon: "work" },
    { href: "/dashboard/company/reviews", label: "Reviews", icon: "star" },
    { href: "/dashboard/company/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <nav className="flex flex-col gap-2 flex-grow mt-6">
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        return (
          <Link 
            key={link.href}
            href={link.href} 
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 ${
              isActive 
                ? "bg-[#191c1e] text-[#facc15] border border-[#facc15]/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]" 
                : "text-[#d1c6ab] hover:text-[#facc15] hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
