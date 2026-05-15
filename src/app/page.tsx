"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    const ring = document.getElementById('cursor-ring');
    
    if (window.innerWidth >= 768 && cursor && ring) {
        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            requestAnimationFrame(() => {
                cursor.style.left = `${clientX}px`;
                cursor.style.top = `${clientY}px`;
                ring.style.left = `${clientX}px`;
                ring.style.top = `${clientY}px`;
            });
        };

        document.addEventListener('mousemove', onMouseMove);

        const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                ring.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                ring.classList.remove('active');
            });
        });

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
        };
    }
  }, []);

  return (
    <div className="bg-[#101415] text-[#e0e3e5] font-sans overflow-x-hidden min-h-screen">
      {/* Custom Styles for this page */}
      <style jsx global>{`
        .glass-card {
            background: rgba(29, 32, 34, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glow-accent {
            background: radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.08) 0%, transparent 70%);
            animation: pulse-glow 15s ease-in-out infinite alternate;
        }
        @keyframes pulse-glow {
            0% { transform: scale(1) translate(0, 0); opacity: 0.5; }
            50% { transform: scale(1.2) translate(2%, 2%); opacity: 0.8; }
            100% { transform: scale(1) translate(-2%, -2%); opacity: 0.5; }
        }
        .text-glow {
            text-shadow: 0 0 20px rgba(250, 204, 21, 0.4);
        }
        .hover-lift {
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
            transform: translateY(-4px);
        }
        @media (min-width: 768px) {
            body {
                cursor: none !important;
            }
            a, button, [role="button"] {
                cursor: none !important;
            }
        }
        #custom-cursor.active {
            transform: translate(-50%, -50%) scale(0.5);
        }
        #cursor-ring.active {
            transform: translate(-50%, -50%) scale(1.5);
            background: rgba(250, 204, 21, 0.1);
            border-color: rgba(250, 204, 21, 0.5);
        }
      `}</style>

      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-[-20] opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#facc15 1px, transparent 1px), linear-gradient(90deg, #facc15 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-[#101415]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="font-bold text-2xl tracking-tighter text-[#facc15]">
            InternTrack
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a className="text-[#d1c6ab] font-medium hover:text-[#facc15] transition-all duration-200 ease-in-out" href="#features">Features</a>
            <a className="text-[#d1c6ab] font-medium hover:text-[#facc15] transition-all duration-200 ease-in-out" href="#students">For Students</a>
            <a className="text-[#d1c6ab] font-medium hover:text-[#facc15] transition-all duration-200 ease-in-out" href="#companies">For Companies</a>
            <a className="text-[#d1c6ab] font-medium hover:text-[#facc15] transition-all duration-200 ease-in-out" href="#about">About</a>
          </nav>
          <div className="flex gap-4 items-center">
            <Link href="/login">
                <button className="text-[#d1c6ab] font-medium hover:text-[#facc15] transition-all duration-200 ease-in-out scale-95 active:scale-90">Login</button>
            </Link>
            <Link href="/register">
                <button className="bg-[#facc15] text-[#3c2f00] font-bold px-6 py-2 rounded-lg scale-95 active:scale-90 transition-transform">Get Started</button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-20">
          <div className="absolute inset-0 glow-accent -z-10 will-change-transform"></div>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl font-black leading-tight tracking-tighter">
                Precision-Engineered <br/>
                <span className="text-[#facc15]">Talent Acquisition</span>
              </h1>
              <p className="text-lg text-[#d1c6ab] max-w-xl leading-relaxed">
                A high-performance ecosystem designed to bridge the gap between elite student talent and the world's most ambitious organizations. Streamline discovery, tracking, and placement with surgical precision.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="w-full md:w-auto">
                    <button className="bg-[#facc15] text-[#3c2f00] px-12 py-4 font-bold text-xl rounded-xl shadow-lg hover:shadow-[#facc15]/20 transition-all active:scale-95 w-full md:w-auto">
                      Get Started Now
                    </button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card p-4 rounded-xl shadow-2xl relative z-10 hover-lift">
                <img 
                  alt="Dashboard Analytics" 
                  className="rounded-lg border border-white/5 w-full aspect-video object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8dc5lfuEmKl8pBRtRGizCqthQo0wyX4LBDSciKIjR9h3NCeRMh5eSmlAxn9P1q6ARfzA1o9UDKVCIvoOKL8aoCCOKqEp2n3Nl5E4SCyS0fEBwtrNnoNJy26obO5gH6VOBj8YLIPUEDT4yisnD17GepAN9Ywg6GVhNJdnr9pSqLNx_uQk_03NIL6HNosg0qA6JQVk29jJJwP7JkpMP-xsiNC2ft9CDqCTfhv9ZjJWXmePie_x1Y0RJGlwVHjljdami9yu_IePeKze3"
                />
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#facc15]/10 blur-[100px] -z-10"></div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 px-6 bg-[#0b0f10]" id="about">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8">Bridging the Gap with <span className="text-[#facc15]">Calculated Ambition</span></h2>
                <div className="space-y-6 text-[#d1c6ab] text-lg">
                  <p>
                    InternTrack isn't just a platform; it's a high-performance engine for career acceleration. We've built an infrastructure that respects the complexity of modern talent markets.
                  </p>
                  <p>
                    Our mission is to eliminate the friction in elite talent discovery. By providing students with a visible pipeline and companies with data-rich applicant management, we ensure the right talent meets the right opportunity at the right time.
                  </p>
                </div>
                <div className="mt-12 flex gap-8">
                  <div>
                    <h4 className="text-3xl font-bold text-[#facc15]">98%</h4>
                    <p className="text-xs uppercase tracking-widest font-bold">Match Accuracy</p>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div>
                    <h4 className="text-3xl font-bold text-[#facc15]">14 Days</h4>
                    <p className="text-xs uppercase tracking-widest font-bold">Avg. Hire Time</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="glass-card aspect-square rounded-xl flex items-center justify-center hover-lift">
                    <span className="material-symbols-outlined text-4xl text-[#facc15]">precision_manufacturing</span>
                  </div>
                  <div className="glass-card aspect-[4/5] rounded-xl overflow-hidden hover-lift">
                    <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0U3vx534TKYK2yND7I4nvKD-EKFsBH_aFR4Kj0EHZcYalVpbv-wR4Rl-CMZ8Bdoo6zKrQ1Y8M-7qSvNBqMcqYAKCLcYaBS1qs7BGbGnjRCo41CQphZjem6qk65qQdYKAQjpoQNSKk2yKahBYYmSfk60AI65b2zJBT3jLuS72K_Ck5sN3TDKUMI4JUWZuNrFLNgpwAwuCcG5fXxldxXxhIVFvoljzxkms1SRvAbL-X8jKsMGBH4NwHGIMP_g1YjVEyBjYjRqp1niWX" 
                        alt="Elite Workspace" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="glass-card aspect-[4/5] rounded-xl overflow-hidden hover-lift">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR3QZk-HGQS-9HMEn3QmrnO_3jFO6YPHHjr29mB5eGBCHUCpC70LmXiMxPNimpbZ4LZOAIPYxQh4x8p-hFpPXSw-8_PB4LsZxRaCwdtOVJT2bg5mpNevfXDPWBBx1JyQ9UdbUVoCeIxPVLRLGZZchiqum7w7vs5RMts3nmTIqTQyWTvomJ6bJgsKm3tZK5Qn0vMr20viQ_ozR1KKnSzaMJPHewG9mYssWTUJ8QnduJK8NmOhNVXB21Rl4XWz8rIbckKM1HsCfDCmpU" alt="Collaboration" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="glass-card aspect-square rounded-xl flex items-center justify-center hover-lift">
                    <span className="material-symbols-outlined text-4xl text-[#facc15]">rocket_launch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 px-6" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">The Platform <span className="text-[#facc15]">Capabilities</span></h2>
              <p className="text-lg text-[#d1c6ab] max-w-2xl mx-auto">
                Precision-engineered tools to manage the entire internship lifecycle from a single, high-density interface.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto">
              <div className="md:col-span-2 glass-card p-8 rounded-2xl flex flex-col justify-between group hover:border-[#facc15]/30 transition-all hover-lift min-h-[400px]">
                <div>
                  <span className="material-symbols-outlined text-[#facc15] text-4xl mb-4">insights</span>
                  <h3 className="text-2xl font-bold mb-4">Real-Time Application Tracking</h3>
                  <p className="text-[#d1c6ab] max-w-md">
                    Monitor every stage of your pipeline with zero latency. From initial contact to final offer, every status change is reflected instantly.
                  </p>
                </div>
                <div className="mt-8 border-t border-white/5 pt-8">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBequd3ppzmBRULyYaXV8K3xvN6WbVLTvx1Q5bRGuijTbbDXakkmXNM7GVbhYn87-7uxVT0Q1oH5B6VpORH1CDlKB7xyY47dJ_9PBJwwUG36XWrVN6QvBi85Nltae2pSw2DVXypcGlCAOydkBwebAKv9vmA6YV3hVcxcu-xaS9DTJh5ZnIfCVt_xcGPtQez-Jq92q3_wkb7KTkBD1XEiHk0GoOR_daJYvrWfrXF476zZ6a-SQw8XuM7cmMqspMa_e1SHXuoT_uCP22w" alt="Analytics View" className="rounded-lg w-full h-40 object-cover" />
                </div>
              </div>
              <div className="glass-card p-8 rounded-2xl flex flex-col items-start justify-center group hover:border-[#facc15]/30 transition-all hover-lift">
                <span className="material-symbols-outlined text-[#facc15] text-4xl mb-6">psychology</span>
                <h3 className="text-2xl font-bold mb-4">Automated Matching</h3>
                <p className="text-[#d1c6ab]">
                  Our proprietary algorithm pairs elite talent with specific organizational needs based on technical skills and cultural alignment.
                </p>
              </div>
              <div className="glass-card p-8 rounded-2xl group hover:border-[#facc15]/30 transition-all hover-lift flex flex-col items-start justify-center">
                <span className="material-symbols-outlined text-[#facc15] text-4xl mb-6">star</span>
                <h3 className="text-2xl font-bold mb-4">Verified Internship Reviews</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-[#d1c6ab]"><span className="font-bold text-white">Verification:</span> Only students with an 'Offered' status can submit reviews.</p>
                  <p className="text-[#d1c6ab]"><span className="font-bold text-white">Multi-dimensional Rating:</span> Evaluate Culture, Learning, and Stipend.</p>
                  <p className="text-[#d1c6ab]"><span className="font-bold text-white">Integrity:</span> Enforced one-review-per-company limit.</p>
                </div>
              </div>
              <div className="md:col-span-2 glass-card p-8 rounded-2xl flex items-center gap-8 group hover:border-[#facc15]/30 transition-all hover-lift">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-[#facc15] text-4xl mb-4">shield</span>
                  <h3 className="text-2xl font-bold mb-4">Elite Data Security</h3>
                  <p className="text-[#d1c6ab]">
                    Enterprise-grade encryption for all candidate and corporate data. We maintain the highest standards of privacy and compliance.
                  </p>
                </div>
                <div className="hidden md:block w-48 h-full rounded-xl border border-white/5 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0U3vx534TKYK2yND7I4nvKD-EKFsBH_aFR4Kj0EHZcYalVpbv-wR4Rl-CMZ8Bdoo6zKrQ1Y8M-7qSvNBqMcqYAKCLcYaBS1qs7BGbGnjRCo41CQphZjem6qk65qQdYKAQjpoQNSKk2yKahBYYmSfk60AI65b2zJBT3jLuS72K_Ck5sN3TDKUMI4JUWZuNrFLNgpwAwuCcG5fXxldxXxhIVFvoljzxkms1SRvAbL-X8jKsMGBH4NwHGIMP_g1YjVEyBjYjRqp1niWX" alt="Security" className="w-full h-full object-cover opacity-50 hover:opacity-80 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STUDENT ADVANTAGE SECTION */}
        <section id="students" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-lg bg-[#facc15] text-[#3c2f00] flex items-center justify-center shrink-0 font-bold">1</div>
                <div>
                  <h3 className="text-2xl font-bold text-[#facc15] mb-2">Discovery</h3>
                  <p className="text-[#d1c6ab]">Access a curated list of elite opportunities not found on generic job boards.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-lg bg-[#363a3b]/20 text-[#d1c6ab] flex items-center justify-center shrink-0 font-bold">2</div>
                <div>
                  <h3 className="text-2xl font-bold text-[#e0e3e5] mb-2">Effortless Tracking</h3>
                  <p className="text-[#d1c6ab]">Automatically organize every application and follow-up in a central hub.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-lg bg-[#363a3b]/20 text-[#d1c6ab] flex items-center justify-center shrink-0 font-bold">3</div>
                <div>
                  <h3 className="text-2xl font-bold text-[#e0e3e5] mb-2">Career-Level Success</h3>
                  <p className="text-[#d1c6ab]">Analyze your results and optimize your approach for top-tier placements.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#191c1e] border border-white/5 p-12 rounded-3xl relative overflow-hidden group hover-lift shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-[#e0e3e5] mb-2">The Student</h2>
                <h2 className="text-4xl font-black text-[#facc15] mb-8">Advantage</h2>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-[#d1c6ab]">
                    <span className="material-symbols-outlined text-[#facc15]">check_circle</span> Visible Pipeline Management
                  </li>
                  <li className="flex items-center gap-3 text-[#d1c6ab]">
                    <span className="material-symbols-outlined text-[#facc15]">check_circle</span> Direct Recruiting Channels
                  </li>
                  <li className="flex items-center gap-3 text-[#d1c6ab]">
                    <span className="material-symbols-outlined text-[#facc15]">check_circle</span> Elite Opportunity Alerts
                  </li>
                </ul>
                <Link href="/register">
                  <button className="w-full py-4 bg-[#facc15] text-[#3c2f00] font-bold rounded-lg hover:brightness-110 transition-all">Join the Elite</button>
                </Link>
              </div>
              <span className="material-symbols-outlined absolute -right-8 -top-8 text-[200px] opacity-10 text-[#facc15] rotate-12">school</span>
            </div>
          </div>
        </section>

        {/* HIGH-DENSITY RECRUITMENT SECTION */}
        <section id="companies" className="py-24 bg-[#0b0f10]">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <h2 className="text-4xl font-black text-[#e0e3e5] mb-4">High-Density <span className="text-[#facc15]">Recruitment</span></h2>
            <p className="text-lg text-[#d1c6ab] max-w-2xl mx-auto">Transform your intern program from a logistical burden into a strategic advantage.</p>
          </div>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 bg-[#191c1e] border border-white/5 rounded-2xl group hover:border-[#facc15]/30 transition-all hover-lift">
              <h3 className="text-2xl font-bold text-[#e0e3e5] mb-4">Streamlined Screening</h3>
              <p className="text-[#d1c6ab] mb-8 leading-relaxed">Reduce time-to-hire by 60% with automated technical screening and cultural fit assessment.</p>
              <div className="text-6xl font-black text-[#facc15]">60%</div>
              <div className="text-[10px] uppercase tracking-widest text-[#d1c6ab] font-bold mt-2">Time Saved</div>
            </div>
            {/* Card 2 */}
            <div className="p-8 bg-[#191c1e] border border-[#facc15]/40 rounded-2xl relative shadow-[0_0_30px_rgba(250,204,21,0.05)] hover-lift">
              <h3 className="text-2xl font-bold text-[#e0e3e5] mb-4">Precision Hiring</h3>
              <p className="text-[#d1c6ab] mb-8 leading-relaxed">Target candidates that precisely match your engineering requirements and stack.</p>
              <div className="text-6xl font-black text-[#facc15]">94%</div>
              <div className="text-[10px] uppercase tracking-widest text-[#d1c6ab] font-bold mt-2">Retain Rate</div>
            </div>
            {/* Card 3 */}
            <div className="p-8 bg-[#191c1e] border border-white/5 rounded-2xl group hover:border-[#facc15]/30 transition-all hover-lift">
              <h3 className="text-2xl font-bold text-[#e0e3e5] mb-4">Exportable Insights</h3>
              <p className="text-[#d1c6ab] mb-8 leading-relaxed">Generate boardroom-ready PDFs detailing pipeline health and candidate quality metrics.</p>
              <div className="text-6xl font-black text-[#facc15]">Instant</div>
              <div className="text-[10px] uppercase tracking-widest text-[#d1c6ab] font-bold mt-2">Reporting</div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#e0e3e5]">Frequently <span className="text-[#facc15]">Asked</span></h2>
          </div>
          <div className="space-y-4">
            {/* FAQ Item */}
            <div className="bg-[#191c1e] border border-white/5 rounded-xl overflow-hidden group hover:border-[#facc15]/20 transition-all">
              <button className="w-full p-6 flex justify-between items-center text-left hover:bg-white/5 transition-colors group">
                <span className="text-xl font-bold text-[#e0e3e5]">Is InternTrack free for students?</span>
                <span className="material-symbols-outlined text-[#facc15] group-hover:rotate-90 transition-transform">add</span>
              </button>
              <div className="px-6 pb-6 text-[#d1c6ab]">
                Yes, InternTrack is completely free for individual students. We believe talent discovery should be frictionless for the next generation of engineers and leaders.
              </div>
            </div>
            <div className="bg-[#191c1e] border border-white/5 rounded-xl overflow-hidden group hover:border-[#facc15]/20 transition-all">
              <button className="w-full p-6 flex justify-between items-center text-left hover:bg-white/5 transition-colors group">
                <span className="text-xl font-bold text-[#e0e3e5]">How does the matching algorithm work?</span>
                <span className="material-symbols-outlined text-[#facc15] group-hover:rotate-90 transition-transform">add</span>
              </button>
              <div className="px-6 pb-6 text-[#d1c6ab]">
                Our proprietary algorithm analyzes technical skill sets, project history, and behavioral indicators to map talent against organizational requirements with 98% accuracy.
              </div>
            </div>
            <div className="bg-[#191c1e] border border-white/5 rounded-xl overflow-hidden group hover:border-[#facc15]/20 transition-all">
              <button className="w-full p-6 flex justify-between items-center text-left hover:bg-white/5 transition-colors group">
                <span className="text-xl font-bold text-[#e0e3e5]">What kind of companies use the platform?</span>
                <span className="material-symbols-outlined text-[#facc15] group-hover:rotate-90 transition-transform">add</span>
              </button>
              <div className="px-6 pb-6 text-[#d1c6ab]">
                We partner with elite tech organizations, high-growth startups, and Fortune 500 firms looking for top-tier early-career talent.
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-24 border-t border-white/5 bg-[#0b0f10]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto">
          <div className="mb-8 md:mb-0">
            <div className="text-3xl font-black text-[#facc15] mb-4">InternTrack</div>
            <p className="text-[#d1c6ab] max-w-xs">© 2024 InternTrack. Precision-engineered for ambitious talent.</p>
          </div>
          <div className="flex flex-wrap gap-8 text-xs font-bold uppercase tracking-widest">
            <a className="text-[#d1c6ab] hover:text-white transition-colors" href="#">Privacy</a>
            <a className="text-[#d1c6ab] hover:text-white transition-colors" href="#">Terms</a>
            <a className="text-[#d1c6ab] hover:text-white transition-colors" href="#">Contact</a>
          </div>
        </div>
      </footer>

      {/* Custom Cursor Elements */}
      <div className="fixed top-0 left-0 w-3 h-3 bg-[#facc15] rounded-full pointer-events-none z-[9999] translate-x-[-50%] translate-y-[-50%] transition-transform duration-75 ease-out md:block hidden" id="custom-cursor"></div>
      <div className="fixed top-0 left-0 w-10 h-10 border border-[#facc15]/30 rounded-full pointer-events-none z-[9998] translate-x-[-50%] translate-y-[-50%] transition-transform duration-300 ease-out md:block hidden" id="cursor-ring"></div>
    </div>
  );
}
