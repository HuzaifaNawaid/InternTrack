"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    role: "student" as UserRole,
    fullName: "",
    email: "",
    password: "",
    university: "",
    major: "",
    companyName: "",
    industry: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || formData.password.length < 8) {
      setError("Please fill all fields and ensure password is at least 8 characters.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await registerUser(formData);

    if (!res.success) {
      setError(res.error || "Registration failed");
      setIsLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (signInRes?.error) {
      setError("Account created but failed to log in automatically.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#101415] text-[#d1c6ab] font-sans">
      {/* TopAppBar with Progress */}
      <nav className="sticky top-0 w-full z-50 bg-[#101415]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="font-bold text-2xl tracking-tighter text-[#facc15]">
            InternTrack
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#facc15]">Stage {step} of 2</span>
                <div className="w-32 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div 
                        className="h-full bg-[#facc15] transition-all duration-500 ease-out" 
                        style={{ width: step === 1 ? "50%" : "100%" }}
                    ></div>
                </div>
            </div>
            <Link href="/login" className="text-xs font-black uppercase tracking-widest text-[#d1c6ab] hover:text-[#facc15] transition-colors">Login</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        {step === 1 && (
          <div className="max-w-[500px] w-full bg-[#191c1e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#facc15]/5 blur-[80px] rounded-full group-hover:bg-[#facc15]/10 transition-all duration-700"></div>
            
            <div className="relative z-10 p-10 space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-black text-[#e0e3e5] tracking-tighter">Initialize Profile</h1>
                <p className="text-sm text-[#d1c6ab]">Join the next generation of industry leaders.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleNextStep} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab] ml-1">Identity Vector</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative cursor-pointer border rounded-xl p-6 transition-all duration-300 group ${formData.role === "student" ? "border-[#facc15] bg-[#0b0f10] shadow-lg shadow-[#facc15]/10" : "border-white/5 bg-[#0b0f10]/50 hover:border-white/10"}`}>
                      <input type="radio" name="role" value="student" className="sr-only" checked={formData.role === "student"} onChange={handleChange} />
                      <div className="text-center">
                        <div className={`text-xs font-black uppercase tracking-widest ${formData.role === "student" ? "text-[#facc15]" : "text-[#d1c6ab]"}`}>Student</div>
                        <div className="text-[8px] text-[#d1c6ab]/50 mt-1 uppercase">Talent Pool</div>
                      </div>
                    </label>

                    <label className={`relative cursor-pointer border rounded-xl p-6 transition-all duration-300 group ${formData.role === "company" ? "border-[#facc15] bg-[#0b0f10] shadow-lg shadow-[#facc15]/10" : "border-white/5 bg-[#0b0f10]/50 hover:border-white/10"}`}>
                      <input type="radio" name="role" value="company" className="sr-only" checked={formData.role === "company"} onChange={handleChange} />
                      <div className="text-center">
                        <div className={`text-xs font-black uppercase tracking-widest ${formData.role === "company" ? "text-[#facc15]" : "text-[#d1c6ab]"}`}>Company</div>
                        <div className="text-[8px] text-[#d1c6ab]/50 mt-1 uppercase">Acquisition</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab] ml-1">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full bg-[#0b0f10] border border-white/5 rounded-xl px-4 py-4 text-[#e0e3e5] focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#d1c6ab]/30" placeholder="e.g. Alan Turing" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab] ml-1">Primary Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#0b0f10] border border-white/5 rounded-xl px-4 py-4 text-[#e0e3e5] focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#d1c6ab]/30" placeholder="alan@example.com" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab] ml-1">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} className="w-full bg-[#0b0f10] border border-white/5 rounded-xl px-4 py-4 text-[#e0e3e5] focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#d1c6ab]/30" placeholder="••••••••" />
                    <p className="text-[10px] text-[#d1c6ab]/50 mt-2 font-bold uppercase tracking-tighter">Min. 8 characters required</p>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#facc15] text-[#3c2f00] py-5 rounded-xl text-lg font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#facc15]/10 flex items-center justify-center gap-2">
                  Next Step <span className="text-xl">→</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-[600px] w-full bg-[#191c1e] rounded-2xl border border-white/10 shadow-2xl p-10 space-y-8 relative overflow-hidden">
            <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-[#d1c6ab] hover:text-[#facc15] flex items-center gap-2 transition-colors">
              <span className="text-lg">←</span> Previous Stage
            </button>
            
            <div className="space-y-2">
                <h2 className="text-4xl font-black text-[#e0e3e5] tracking-tighter">Domain Calibration</h2>
                <p className="text-sm text-[#d1c6ab]">Finalize your sector-specific metadata.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {formData.role === "student" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab] ml-1">University / Institute</label>
                      <input type="text" name="university" value={formData.university} onChange={handleChange} required className="w-full bg-[#0b0f10] border border-white/5 rounded-xl px-4 py-4 text-[#e0e3e5] focus:outline-none focus:border-[#facc15]/50 transition-all" placeholder="e.g. MIT" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab] ml-1">Core Discipline</label>
                      <input type="text" name="major" value={formData.major} onChange={handleChange} required className="w-full bg-[#0b0f10] border border-white/5 rounded-xl px-4 py-4 text-[#e0e3e5] focus:outline-none focus:border-[#facc15]/50 transition-all" placeholder="e.g. Quantum Engineering" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab] ml-1">Organization Name</label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full bg-[#0b0f10] border border-white/5 rounded-xl px-4 py-4 text-[#e0e3e5] focus:outline-none focus:border-[#facc15]/50 transition-all" placeholder="e.g. SpaceX" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab] ml-1">Industrial Vertical</label>
                      <input type="text" name="industry" value={formData.industry} onChange={handleChange} required className="w-full bg-[#0b0f10] border border-white/5 rounded-xl px-4 py-4 text-[#e0e3e5] focus:outline-none focus:border-[#facc15]/50 transition-all" placeholder="e.g. Aerospace" />
                    </div>
                  </>
                )}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-[#facc15] text-[#3c2f00] py-5 rounded-xl text-lg font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#facc15]/10">
                {isLoading ? "Synchronizing..." : "Complete Integration"}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 bg-[#0b0f10]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto">
          <div className="text-2xl font-black text-[#facc15] mb-4 md:mb-0">InternTrack</div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-[#d1c6ab]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
