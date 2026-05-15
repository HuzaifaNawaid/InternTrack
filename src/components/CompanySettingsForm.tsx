"use client";

import React, { useState } from "react";
import { updateCompanyProfileData, deactivateCompanyAccount } from "@/actions/company";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CompanySettingsForm({ company }: { company: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await updateCompanyProfileData(formData);
    
    setLoading(false);
    if (result.success) {
      setMessage("System configurations updated successfully.");
      router.refresh();
    } else {
      setMessage(result.error || "Update protocol failed.");
    }
  }

  async function handleDeactivate() {
    const result = await deactivateCompanyAccount();
    if (result.success) {
      await signOut({ callbackUrl: "/login" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {message && (
        <div className={`p-5 rounded-2xl font-black uppercase tracking-widest text-[10px] border animate-pulse ${message.includes('success') ? 'bg-[#facc15]/10 text-[#facc15] border-[#facc15]/30' : 'bg-red-900/20 text-red-200 border-red-500/30'}`}>
          {message}
        </div>
      )}

      {/* Profile Calibration Surface */}
      <section className="bg-[#191c1e] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl group">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0b0f10]/30">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#facc15]">Corporate Identity Matrix</h3>
        </div>
        
        <div className="p-10 space-y-10">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-40 h-40 rounded-[32px] bg-[#0b0f10] border-2 border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center relative group/logo">
                <div className="absolute inset-0 bg-[#facc15]/5 opacity-0 group-hover/logo:opacity-100 transition-opacity"></div>
                <span className="text-[#facc15] text-6xl font-black tracking-tighter relative z-10">{company.name.charAt(0)}</span>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Entity Name</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={company.name}
                  className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all placeholder:text-white/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Domain Vector (URL)</label>
                <input 
                  type="url" 
                  name="website"
                  defaultValue={company.website || ""}
                  placeholder="https://hq.com"
                  className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all placeholder:text-white/10"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">HQ Coordinates</label>
                <input 
                  type="text" 
                  name="city"
                  defaultValue={company.city || ""}
                  placeholder="e.g. Islamabad, PK"
                  className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all placeholder:text-white/10"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Mission Briefing (Description)</label>
                <textarea 
                  name="description"
                  defaultValue={company.description || ""}
                  rows={5}
                  placeholder="Define your corporate mission..."
                  className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all placeholder:text-white/10 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Protocols */}
      <section className="bg-[#191c1e] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-[#0b0f10]/30">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500/70">Accounts Setting</h3>
        </div>
        
        <div className="p-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="font-black text-red-500 uppercase tracking-widest text-sm mb-1">Deactivate Account</p>
              <p className="text-xs text-[#d1c6ab]/40 font-bold">Permanently purge your organization profile and all active job postings.</p>
            </div>
            {!showDeactivateConfirm ? (
              <button 
                type="button" 
                onClick={() => setShowDeactivateConfirm(true)}
                className="text-red-500/60 border border-red-500/20 hover:bg-red-500/10 px-8 py-3 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px]"
              >
                Initiate Deactivation
              </button>
            ) : (
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="text-[#d1c6ab] bg-white/5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                >
                  Abort
                </button>
                <button 
                  type="button" 
                  onClick={handleDeactivate}
                  className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all"
                >
                  Confirm Purge
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-10 border-t border-white/5 mt-8">
        <button 
          type="submit" 
          disabled={loading} 
          className="px-12 py-5 bg-[#facc15] text-[#3c2f00] rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all active:scale-95 shadow-2xl shadow-[#facc15]/20 disabled:opacity-50"
        >
          {loading ? 'Synchronizing...' : 'Save All Configurations'}
        </button>
      </div>
    </form>
  );
}
