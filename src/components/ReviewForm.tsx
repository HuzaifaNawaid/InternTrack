"use client";

import React, { useState } from "react";
import { submitReview } from "@/actions/reviews";

interface Company {
  id: number;
  name: string;
}

interface ReviewFormProps {
  eligibleCompanies: Company[];
}

export default function ReviewForm({ eligibleCompanies }: ReviewFormProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [culture, setCulture] = useState(5);
  const [learning, setLearning] = useState(5);
  const [stipend, setStipend] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("company_id", selectedCompany);
    formData.append("culture", culture.toString());
    formData.append("learning", learning.toString());
    formData.append("stipend", stipend.toString());
    formData.append("comment", comment);

    const result = await submitReview(formData);
    setLoading(false);

    if (result.success) {
      setMessage({ type: "success", text: "Review protocols completed successfully." });
      setSelectedCompany("");
      setComment("");
      window.location.reload();
    } else {
      setMessage({ type: "error", text: result.error || "Submission failure." });
    }
  };

  if (eligibleCompanies.length === 0) {
    return (
      <div className="bg-[#191c1e] p-8 rounded-[32px] border border-white/5 text-[#d1c6ab]/40 text-center italic text-xs font-bold uppercase tracking-widest leading-relaxed">
        Deployment Eligibility Required: Reviews are restricted to completed internship vectors (status: offered).
      </div>
    );
  }

  const StarRating = ({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) => (
    <div className="flex flex-col gap-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">{label}</label>
      <div className="flex gap-2 bg-[#0b0f10] p-3 rounded-2xl border border-white/5 w-fit">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-xl transition-all hover:scale-110 active:scale-90 ${star <= value ? "text-[#facc15]" : "text-white/10"}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-[#191c1e] p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-10">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#facc15]">Initialize Feedback Protocol</h3>
      
      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Target Organization</label>
          <select
            required
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl py-4 px-6 text-[#e0e3e5] focus:border-[#facc15]/50 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#0b0f10]">Select verified company...</option>
            {eligibleCompanies.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0b0f10]">{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StarRating label="Corporate Culture" value={culture} onChange={setCulture} />
          <StarRating label="Learning Velocity" value={learning} onChange={setLearning} />
          <StarRating label="Compensation Value" value={stipend} onChange={setStipend} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]/40 ml-1">Mission Debrief (Review Content)</label>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Outline your technical and cultural experience..."
            rows={5}
            className="w-full bg-[#0b0f10] border border-white/5 rounded-2xl py-4 px-6 text-[#e0e3e5] focus:border-[#facc15]/50 transition-all outline-none resize-none placeholder:text-white/5"
          />
        </div>

        {message.text && (
          <div className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border animate-pulse ${message.type === "success" ? "bg-[#facc15]/10 text-[#facc15] border-[#facc15]/30" : "bg-red-900/10 text-red-400 border-red-900/30"}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedCompany}
          className="w-full bg-[#facc15] text-[#3c2f00] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-[#facc15]/20"
        >
          {loading ? "Transmitting..." : "Post Review Protocol"}
        </button>
      </div>
    </form>
  );
}
