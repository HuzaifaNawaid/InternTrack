"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "company">("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#101415] text-[#d1c6ab] font-sans">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-[#101415]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="font-bold text-2xl tracking-tighter text-[#facc15]">
            InternTrack
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/register">
                <button className="bg-[#facc15] text-[#3c2f00] font-bold px-6 py-2 rounded-lg scale-95 active:scale-90 transition-transform">Get Started</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-[#191c1e] rounded-2xl border border-white/10 p-10 shadow-2xl relative overflow-hidden group">
          {/* Subtle Glow background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#facc15]/5 blur-[80px] rounded-full group-hover:bg-[#facc15]/10 transition-all duration-700"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-[#e0e3e5] tracking-tighter">Welcome Back</h1>
              <p className="text-sm text-[#d1c6ab]">Precision-engineered talent management.</p>
            </div>

            {/* Role Selection Toggle */}
            <div className="flex bg-[#0b0f10] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  role === "student"
                    ? "bg-[#facc15] text-[#3c2f00] shadow-lg shadow-[#facc15]/20"
                    : "text-[#d1c6ab] hover:text-[#e0e3e5]"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("company")}
                className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  role === "company"
                    ? "bg-[#facc15] text-[#3c2f00] shadow-lg shadow-[#facc15]/20"
                    : "text-[#d1c6ab] hover:text-[#e0e3e5]"
                }`}
              >
                Recruiter
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab] ml-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0b0f10] border border-white/5 rounded-xl px-4 py-4 text-[#e0e3e5] focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#d1c6ab]/30"
                  placeholder="name@company.com"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1c6ab]">Password</label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0b0f10] border border-white/5 rounded-xl px-4 py-4 text-[#e0e3e5] focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#d1c6ab]/30"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#facc15] text-[#3c2f00] py-5 rounded-xl text-lg font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-[#facc15]/10"
              >
                {isLoading ? "Validating..." : "Initiate Login"}
              </button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-[#d1c6ab]">
                New here?{" "}
                <Link href="/register" className="text-[#facc15] font-black hover:underline uppercase tracking-widest text-xs">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
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
