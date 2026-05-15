import React from "react";
import { getCompanyReviews, getAllCompaniesWithRatings } from "@/actions/reviews";
import Link from "next/link";

export default async function CompanyReviewsDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const companyId = parseInt(params.id);
  
  const [reviewsResponse, companiesResponse] = await Promise.all([
    getCompanyReviews(companyId),
    getAllCompaniesWithRatings()
  ]);

  const reviews = reviewsResponse.data || [];
  const company = (companiesResponse.data || []).find((c: any) => c.id === companyId);

  if (!company) {
    return <div className="p-8 text-red-500">Company not found.</div>;
  }

  const RatingBar = ({ label, score }: { label: string, score: number | string }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
        <span className="text-[#d1c6ab]">{label}</span>
        <span className="text-[#facc15]">{score || 0} / 5</span>
      </div>
      <div className="h-1.5 w-full bg-[#1c2b3c] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#facc15] shadow-[0_0_10px_#facc15] transition-all duration-1000" 
          style={{ width: `\${(Number(score) || 0) * 20}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      <Link 
        href="/dashboard/student/reviews" 
        className="inline-flex items-center gap-2 text-[#d1c6ab] hover:text-[#facc15] font-bold text-sm transition-colors group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Back to All Companies
      </Link>

      {/* Hero Section */}
      <div className="bg-[#122131] p-10 rounded-3xl border border-[#4d4632]/30 shadow-2xl flex flex-col md:flex-row gap-10 items-center">
        <div className="h-32 w-32 bg-[#010f1f] rounded-2xl flex items-center justify-center border border-[#4d4632]/30 text-5xl">
          <span className="font-black text-[#d1c6ab]">{company.name.charAt(0)}</span>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-5xl font-black text-[#d4e4fa] tracking-tighter">{company.name}</h2>
          <p className="text-[#d1c6ab] font-medium leading-relaxed">{company.description || "Leading the future of technology and innovation."}</p>
          <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-[#facc15]/10 text-[#facc15] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#facc15]/20">
              {company.total_reviews} Total Reviews
            </span>
            <span className="px-3 py-1 bg-[#d4e4fa]/10 text-[#d4e4fa] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#d4e4fa]/20">
              Verified Ratings
            </span>
          </div>
        </div>

        <div className="bg-[#010f1f] p-6 rounded-2xl border border-[#4d4632]/30 min-w-[200px] text-center space-y-1">
          <p className="text-[#d1c6ab] text-[10px] font-black uppercase tracking-widest">Overall Score</p>
          <h3 className="text-6xl font-black text-[#facc15]">{company.overall_rating || "—"}</h3>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`text-sm \${s <= Math.round(Number(company.overall_rating)) ? "text-[#facc15]" : "text-[#4d4632]"}`}>★</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Rating Breakdown */}
        <div className="space-y-6">
          <h4 className="text-xl font-black text-[#d4e4fa] uppercase tracking-tighter">Rating Breakdown</h4>
          <div className="bg-[#122131] p-6 rounded-2xl border border-[#4d4632]/30 space-y-6 shadow-xl">
            <RatingBar label="Culture & Vibe" score={company.avg_culture} />
            <RatingBar label="Learning Scope" score={company.avg_learning} />
            <RatingBar label="Stipend & Perks" score={company.avg_stipend} />
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-xl font-black text-[#d4e4fa] uppercase tracking-tighter">Student Feedback</h4>
          
          {reviews.length === 0 ? (
            <div className="p-12 text-center bg-[#122131] rounded-2xl border border-[#4d4632]/20 text-[#d1c6ab] italic">
              No detailed reviews yet. Be the first to share your experience!
            </div>
          ) : (
            reviews.map((review: any) => (
              <div key={review.id} className="bg-[#122131] p-8 rounded-2xl border border-[#4d4632]/30 shadow-xl space-y-6 hover:border-[#facc15]/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#facc15]/10 flex items-center justify-center text-[#facc15] font-black text-sm border border-[#facc15]/20">
                      {review.student_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#d4e4fa]">{review.student_name}</p>
                      <p className="text-[10px] text-[#d1c6ab] uppercase font-black tracking-widest">Verified Intern</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#d1c6ab] font-bold">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-6 py-2 border-y border-[#4d4632]/20">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-[#d1c6ab] font-bold">Culture</span>
                        <span className="text-[#facc15] font-black">{review.culture_rating}/5</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-[#d1c6ab] font-bold">Learning</span>
                        <span className="text-[#facc15] font-black">{review.learning_rating}/5</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-[#d1c6ab] font-bold">Stipend</span>
                        <span className="text-[#facc15] font-black">{review.stipend_rating}/5</span>
                    </div>
                </div>

                <div className="relative">
                  <span className="absolute -top-4 -left-2 text-6xl text-[#facc15]/10 font-serif leading-none italic">"</span>
                  <p className="text-[#d1c6ab] leading-relaxed italic relative z-10">{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
