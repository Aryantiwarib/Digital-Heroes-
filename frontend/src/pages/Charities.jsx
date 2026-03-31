import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharity, setSelectedCharity] = useState(null);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await API.get('/charities');
      setCharities(res.data.charities);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
          Our Charity Partners
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          We believe in creating positive change. Explore the charities that benefit from your subscription.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading Charities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charities.length === 0 ? (
            <p className="text-slate-500 text-center col-span-full py-10">No charities listed yet.</p>
          ) : (
            charities.map((charity) => (
              <div 
                key={charity._id} 
                onClick={() => setSelectedCharity(charity)}
                className="glass-panel p-6 rounded-2xl flex flex-col hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer pointer-events-auto border border-transparent hover:border-emerald-500/50"
              >
                 <div className="w-full h-48 bg-slate-800 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-slate-700">
                    {charity.image ? (
                        <img src={charity.image} alt={charity.name} className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <span className="text-slate-500 text-sm">No Image Provided</span>
                    )}
                 </div>
                 <h3 className="text-2xl font-bold mb-3">{charity.name}</h3>
                 <p className="text-slate-400 mb-6 flex-grow line-clamp-2">{charity.description}</p>
                 <div className="border-t border-slate-700/50 pt-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-emerald-400 bg-emerald-900/40 px-3 py-1 rounded-full">
                      Learn More &rarr;
                    </span>
                 </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedCharity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCharity(null)}>
          <div 
            className="w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-64 bg-slate-800 relative">
               {selectedCharity.image ? (
                  <img src={selectedCharity.image} alt={selectedCharity.name} className="object-cover w-full h-full" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">No Image Provided</div>
               )}
               <button 
                  onClick={() => setSelectedCharity(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
            </div>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">{selectedCharity.name}</h2>
              <div className="prose prose-invert border-b border-slate-700 pb-6 mb-6">
                 <p className="text-slate-300 text-lg leading-relaxed">{selectedCharity.description}</p>
              </div>
              
              <div>
                <h4 className="text-emerald-400 font-bold mb-3 uppercase tracking-wider text-sm">Upcoming Events & Milestones</h4>
                <ul className="space-y-3">
                   <li className="flex items-start">
                     <span className="bg-emerald-500/20 text-emerald-400 p-1 rounded mr-3 mt-0.5">🗓️</span>
                     <div>
                       <p className="font-bold text-slate-200">Annual Golf Charity Scramble</p>
                       <p className="text-sm text-slate-400">Join us on the greens to raise funds and awareness.</p>
                     </div>
                   </li>
                   <li className="flex items-start">
                     <span className="bg-emerald-500/20 text-emerald-400 p-1 rounded mr-3 mt-0.5">🎯</span>
                     <div>
                       <p className="font-bold text-slate-200">Community Outreach Goal 2026</p>
                       <p className="text-sm text-slate-400">Expanding our local chapters by 20% this year.</p>
                     </div>
                   </li>
                </ul>
              </div>
              
              <div className="mt-10">
                <button onClick={() => setSelectedCharity(null)} className="btn-primary w-full shadow-emerald-500/20 shadow-lg">Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charities;
