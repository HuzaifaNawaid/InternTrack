import React from "react";
import Link from "next/link";
import { getAllCompaniesWithRatings, getEligibleCompaniesToReview } from "@/actions/reviews";
import ReviewForm from "@/components/ReviewForm";

export default async function ReviewsPage() {
  const [companiesResponse, eligibilityResponse] = await Promise.all([
    getAllCompaniesWithRatings(),
    getEligibleCompaniesToReview()
  ]);

  const companies = companiesResponse.data || [];
  const eligibleCompanies = eligibilityResponse.data || [];

  const RatingBadge = ({ score, label }: { score: number | string, label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-xl font-black text-[#facc15] tracking-tighter">{score || "—"}</span>
      <span className="text-[8px] uppercase text-[#d1c6ab]/40 font-black tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="p-8 bg-[#101415] h-full flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-black text-[#e0e3e5] tracking-tighter mb-3">Intelligence Hub</h2>
        <p className="text-[#d1c6ab] text-lg max-w-2xl font-medium leading-relaxed">
          Aggregated feedback from the student vanguard. Transparency leads to superior career trajectories.
        </p>
      </div>

      {/* Review Submission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <div className="lg:col-span-2">
            <ReviewForm eligibleCompanies={eligibleCompanies} />
        </div>
        
        <div className="space-y-6">
            <div className="bg-[#191c1e] p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#facc15]/5 blur-3xl rounded-full group-hover:bg-[#facc15]/10 transition-all"></div>
                <h4 className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.3em] mb-8 ml-1">Protocol Guidelines</h4>
                <ul className="space-y-8">
                    <li className="flex gap-5">
                        <span className="text-[#facc15] font-black text-sm opacity-30">01</span>
                        <p className="text-xs text-[#d1c6ab] font-bold leading-relaxed uppercase tracking-widest">Complete an internship vector to synchronize eligibility.</p>
                    </li>
                    <li className="flex gap-5">
                        <span className="text-[#facc15] font-black text-sm opacity-30">02</span>
                        <p className="text-xs text-[#d1c6ab] font-bold leading-relaxed uppercase tracking-widest">Rate parameters on a surgical 1-5 scale.</p>
                    </li>
                    <li className="flex gap-5">
                        <span className="text-[#facc15] font-black text-sm opacity-30">03</span>
                        <p className="text-xs text-[#d1c6ab] font-bold leading-relaxed uppercase tracking-widest">Contribute to the collective intelligence of the platform.</p>
                    </li>
                </ul>
            </div>
        </div>
      </div>

      {/* Company Ratings Matrix */}
      <div className="space-y-10">
        <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-[#e0e3e5] tracking-tight uppercase">Leaderboard Matrix</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {companies.map((company: any) => (
            <Link 
              key={company.id} 
              href={`/dashboard/student/reviews/${company.id}`}
              className="bg-[#191c1e] p-8 rounded-[40px] border border-white/5 hover:border-[#facc15]/30 transition-all group shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8"
            >
              <div className="flex items-center gap-8 w-full sm:w-auto">
                <div className="h-20 w-20 bg-[#0b0f10] rounded-[24px] flex items-center justify-center border border-white/5 text-4xl group-hover:scale-110 transition-transform shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#facc15]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="font-black text-[#facc15] relative z-10">{company.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#e0e3e5] tracking-tighter group-hover:text-[#facc15] transition-colors">{company.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-[#d1c6ab]/40 font-black uppercase tracking-[0.2em]">{company.total_reviews} Synchronized Reviews</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 pr-4 w-full sm:w-auto justify-center">
                <RatingBadge score={company.avg_culture} label="Culture" />
                <RatingBadge score={company.avg_learning} label="Velocity" />
                <RatingBadge score={company.avg_stipend} label="Value" />
                <div className="w-px h-12 bg-white/5 mx-2 hidden lg:block"></div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-[#facc15] tracking-tighter">{company.overall_rating || "—"}</span>
                  <span className="text-[8px] uppercase text-[#e0e3e5] font-black tracking-widest opacity-30">Global</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
