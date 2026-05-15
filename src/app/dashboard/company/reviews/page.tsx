import React from "react";
import { getAuthenticatedCompanyReviews } from "@/actions/reviews";

export default async function CompanyReviewsPage() {
    const reviewsResponse = await getAuthenticatedCompanyReviews();
    const reviews = reviewsResponse.success ? reviewsResponse.data : [];

    return (
        <div className="flex-grow p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-[#e0e3e5] tracking-tighter mb-2">Student Feedback</h1>
                        <p className="text-[#d1c6ab] text-lg">Monitor and analyze candidate sentiment and program performance.</p>
                    </div>
                    <div className="bg-[#191c1e] px-6 py-4 rounded-2xl border border-white/5 flex gap-12">
                        <div className="text-center">
                            <div className="text-3xl font-black text-[#facc15]">{reviews?.length || 0}</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold text-[#d1c6ab]">Total Reviews</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-[#facc15]">
                                {reviews && reviews.length > 0 
                                    ? (reviews.reduce((acc, r) => acc + (r.culture_rating + r.learning_rating + r.stipend_rating) / 3, 0) / reviews.length).toFixed(1)
                                    : "0.0"}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest font-bold text-[#d1c6ab]">Avg Score</div>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="grid grid-cols-1 gap-6">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-[#191c1e] border border-white/5 p-8 rounded-3xl hover:border-[#facc15]/30 transition-all group relative overflow-hidden">
                                {/* Decorative Initial */}
                                <div className="absolute -right-4 -bottom-4 text-[120px] font-black text-[#facc15]/5 select-none pointer-events-none group-hover:text-[#facc15]/10 transition-all">
                                    {review.student_name.charAt(0)}
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#facc15] text-[#3c2f00] rounded-full flex items-center justify-center font-black text-xl">
                                                {review.student_name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#e0e3e5]">{review.student_name}</h3>
                                                <p className="text-xs text-[#d1c6ab] opacity-60">Verified Intern • {new Date(review.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="text-center px-4 py-2 bg-[#0b0f10] rounded-xl border border-white/5">
                                                <div className="text-[#facc15] font-black text-lg">{review.culture_rating}</div>
                                                <div className="text-[8px] uppercase tracking-tighter text-[#d1c6ab]">Culture</div>
                                            </div>
                                            <div className="text-center px-4 py-2 bg-[#0b0f10] rounded-xl border border-white/5">
                                                <div className="text-[#facc15] font-black text-lg">{review.learning_rating}</div>
                                                <div className="text-[8px] uppercase tracking-tighter text-[#d1c6ab]">Learning</div>
                                            </div>
                                            <div className="text-center px-4 py-2 bg-[#0b0f10] rounded-xl border border-white/5">
                                                <div className="text-[#facc15] font-black text-lg">{review.stipend_rating}</div>
                                                <div className="text-[8px] uppercase tracking-tighter text-[#d1c6ab]">Stipend</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#0b0f10]/50 p-6 rounded-2xl border border-white/5 italic text-[#d1c6ab] leading-relaxed relative">
                                        <span className="material-symbols-outlined absolute -top-3 -left-2 text-4xl text-[#facc15] opacity-20">format_quote</span>
                                        "{review.comment}"
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-[#191c1e] rounded-[40px] border border-white/5 border-dashed">
                            <span className="material-symbols-outlined text-8xl text-[#d1c6ab] opacity-20 mb-6">rate_review</span>
                            <h3 className="text-2xl font-bold text-[#e0e3e5] mb-2">No Reviews Yet</h3>
                            <p className="text-[#d1c6ab]">Feedback from completed internships will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
