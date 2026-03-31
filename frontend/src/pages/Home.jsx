import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-slate-950">
      {/* Dynamic Background FX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-[30%] left-[30%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 pt-32 pb-20 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Col: Main Copy */}
        <div className="lg:w-1/2 text-left flex flex-col items-start animate-in fade-in slide-in-from-left-8 duration-1000">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm mb-8 shadow-inner shadow-emerald-500/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              The New Way to Play Golf
           </div>
           
           <h1 className="text-6xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-6 relative z-10">
             Drive <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-sm">Impact</span> <br/>
             Every Swing.
           </h1>
           
           <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-lg border-l-4 border-emerald-500 pl-6 bg-gradient-to-r from-emerald-500/5 to-transparent py-2">
             Transform your Stableford scores into powerful charitable contributions. Participate in monthly cash draws, rack up winnings, and support the causes you love.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
             <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto text-center btn-primary text-xl px-10 py-5 rounded-2xl shadow-[0_20px_40px_-15px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.7)] transition-all font-bold group relative overflow-hidden">
               <span className="relative z-10 text-white flex items-center justify-center gap-2">
                 {user ? "View Dashboard" : "Start Your Journey"} 
                 <span className="group-hover:translate-x-1 transition-transform">→</span>
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
             </Link>
             <a href="#how-it-works" className="w-full sm:w-auto text-center !bg-transparent hover:!bg-white/5 text-slate-300 hover:text-white font-bold py-5 px-8 rounded-2xl transition-all border border-slate-700 hover:border-slate-500 text-xl backdrop-blur-sm">
               How You Win
             </a>
           </div>

           <div className="mt-12 flex items-center gap-6 pt-8 border-t border-slate-800 w-full">
              <div>
                 <div className="text-3xl font-black text-white">₹5M+</div>
                 <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Donated Globally</div>
              </div>
              <div className="w-px h-12 bg-slate-800"></div>
              <div>
                 <div className="text-3xl font-black text-white">12,500+</div>
                 <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Players</div>
              </div>
           </div>
        </div>

        {/* Right Col: Visual Mockups / Floating Cards */}
        <div className="lg:w-1/2 relative h-[600px] w-full hidden md:block animate-in fade-in slide-in-from-right-8 duration-1000">
           {/* Abstract Phone/App Frame */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[650px] bg-slate-900 border-[8px] border-slate-800 rounded-[3rem] shadow-2xl shadow-emerald-500/20 z-10 overflow-hidden relative rotate-min-3">
              <div className="absolute top-0 w-full h-8 bg-black flex justify-center items-center rounded-t-3xl border-b border-slate-800 z-50">
                <div className="w-20 h-5 bg-slate-900 rounded-b-xl border border-t-0 border-slate-800"></div>
              </div>
              
              <div className="p-6 pt-16 h-full flex flex-col gap-4 bg-gradient-to-b from-slate-900 to-slate-950">
                 <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-white font-bold text-xl">My Dashboard</h4>
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Active Member</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-lg">🏌️</div>
                 </div>

                 <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-inner">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Winnings</p>
                    <p className="text-3xl text-white font-black">₹45,200</p>
                    <div className="mt-3 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 inline-block rounded font-bold border border-blue-500/20">3 Pending Transfers</div>
                 </div>

                 <div className="space-y-3 mt-2">
                    <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                       <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 rounded">45 pt</span>
                       <span className="text-slate-500 text-xs font-medium">May 12, 2026</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                       <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 rounded">42 pt</span>
                       <span className="text-slate-500 text-xs font-medium">May 08, 2026</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                       <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 rounded">39 pt</span>
                       <span className="text-slate-500 text-xs font-medium">Apr 21, 2026</span>
                    </div>
                 </div>
                 
                 <div className="mt-auto bg-emerald-500 py-3 rounded-xl text-center text-white font-bold shadow-lg shadow-emerald-500/30">
                    Submit Process Image
                 </div>
              </div>
           </div>
           
           {/* Floating elements behind */}
           <div className="absolute top-20 right-10 bg-slate-800/80 backdrop-blur-xl p-4 rounded-2xl border border-emerald-500/40 shadow-2xl z-20 animate-bounce transition-all duration-1000 rotate-6" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-3">
                 <div className="text-3xl">🎯</div>
                 <div>
                   <p className="text-white font-bold leading-tight">Match 5 Numbers</p>
                   <p className="text-emerald-400 text-sm font-black tracking-tighter">WIN JACKPOT</p>
                 </div>
              </div>
           </div>

           <div className="absolute bottom-32 -left-10 bg-slate-800/90 backdrop-blur-xl p-4 rounded-2xl border border-teal-500/40 shadow-2xl z-20 animate-bounce transition-all duration-1000 -rotate-3" style={{ animationDuration: '6s', animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                 <div className="text-3xl">🤝</div>
                 <div>
                   <p className="text-slate-300 text-sm">Supporting</p>
                   <p className="text-teal-400 font-bold">Fairway Kids</p>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Feature Grid Section */}
      <div id="how-it-works" className="w-full relative z-10 bg-slate-900 border-t border-slate-800 py-32 mt-10">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20 max-w-3xl mx-auto">
               <h2 className="text-emerald-500 font-bold tracking-widest uppercase mb-4 text-sm">The Logic Engine</h2>
               <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Built for Golfers. Designed for Good.</h3>
               <p className="text-slate-400 text-lg">Every month, our algorithmic drawing engine cross-references your top Stableford rounds against the dynamic pool logic, splitting payouts instantly.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-slate-800/30 p-10 rounded-[2rem] border border-slate-700/50 hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-8 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">01</div>
                  <h4 className="text-2xl font-bold text-white mb-4">Subscribe & Support</h4>
                  <p className="text-slate-400 leading-relaxed text-lg">Dedicate a portion of your subscription to a charity of your choice. A strict minimum 10% is enforced to guarantee maximum impact.</p>
               </div>
               
               <div className="bg-slate-800/30 p-10 rounded-[2rem] border border-slate-700/50 hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-8 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">02</div>
                  <h4 className="text-2xl font-bold text-white mb-4">Track Progress</h4>
                  <p className="text-slate-400 leading-relaxed text-lg">Log your Stableford scores (1-45). Our database isolates and retains your latest 5 rolling active scores for precision drawing.</p>
               </div>

               <div className="bg-slate-800/30 p-10 rounded-[2rem] border border-slate-700/50 hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-8 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">03</div>
                  <h4 className="text-2xl font-bold text-white mb-4">Win the Draw</h4>
                  <p className="text-slate-400 leading-relaxed text-lg">Match 3, 4, or 5 numbers in our monthly automated draw to slice huge cash prizes from the global multi-tiered pool!</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Home;
