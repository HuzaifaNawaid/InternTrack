"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/actions/company";
import Link from "next/link";

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createListing(formData);

    if (result.success) {
      router.push("/dashboard/company/postings");
      router.refresh();
    } else {
      setError(result.error || "Failed to post job. Please check all fields.");
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex-1 overflow-y-auto bg-[#101415]">
      {/* Page Header */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mb-3">Initialize Posting</h2>
          <p className="text-[#d1c6ab] text-lg">Define the parameters to acquire elite student talent.</p>
        </div>
        <Link 
          href="/dashboard/company/postings"
          className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d1c6ab] hover:text-[#facc15] transition-all mb-2 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Abort
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="p-5 rounded-2xl bg-red-900/20 text-red-200 border border-red-500/30 font-black uppercase tracking-widest text-[10px] animate-shake">
            {error}
          </div>
        )}

        <section className="bg-[#191c1e] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-[#0b0f10]/30">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#facc15]">Listing Parameter Matrix</h3>
          </div>
          
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Internship Role / Designation</label>
              <input 
                type="text" 
                name="title"
                placeholder="e.g. AI Engineering Intern"
                className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all placeholder:text-white/5"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Geographic Deployment</label>
              <input 
                type="text" 
                name="city"
                placeholder="e.g. Islamabad / Remote"
                className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all placeholder:text-white/5"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Monthly Compensation (PKR)</label>
              <input 
                type="number" 
                name="stipend"
                placeholder="e.g. 35000"
                className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all placeholder:text-white/5"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Application Termination Date</label>
              <input 
                type="date" 
                name="deadline"
                className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Technological Prerequisites</label>
              <input 
                type="text" 
                name="skills"
                placeholder="Next.js, Python, Cloud Architectures..."
                className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all placeholder:text-white/5"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Mission Description</label>
              <textarea 
                name="description"
                rows={6}
                placeholder="Outline the responsibilities and learning objectives..."
                className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl px-6 py-4 text-[#e0e3e5] focus:border-[#facc15]/50 outline-none transition-all placeholder:text-white/5 resize-none"
                required
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-10 border-t border-white/5 mt-8">
          <button 
            type="submit" 
            disabled={loading} 
            className="px-12 py-5 bg-[#facc15] text-[#3c2f00] rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all active:scale-95 shadow-2xl shadow-[#facc15]/20 disabled:opacity-50"
          >
            {loading ? 'Initializing...' : 'Publish Posting'}
          </button>
        </div>
      </form>
    </div>
  );
}
