import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, subscription } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [scoreDate, setScoreDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [scoreError, setScoreError] = useState('');
  
  const [winnings, setWinnings] = useState([]);
  const [proofFile, setProofFile] = useState(null);
  
  // Subscription state
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    fetchScores();
    fetchWinnings();
    fetchSubscriptions();
  }, []);

  const fetchScores = async () => {
    try {
      const res = await API.get('/scores');
      setScores(res.data.scores);
    } catch (err) { console.error(err); }
  };

  const fetchWinnings = async () => {
    try {
      const res = await API.get('/winner/my-winnings');
      setWinnings(res.data.winnings);
    } catch (err) { console.error(err); }
  }

  const fetchSubscriptions = async () => {
    try {
      const res = await API.get('/payment/my-subscriptions');
      setSubscriptions(res.data.subscriptions);
    } catch (err) { console.error(err); }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    setScoreError('');
    if(newScore < 1 || newScore > 45) {
      setScoreError('Score must be between 1 and 45.');
      return;
    }
    setLoading(true);
    try {
      await API.post('/scores', { score: Number(newScore), date: scoreDate });
      setNewScore('');
      setScoreDate('');
      fetchScores();
    } catch (err) { 
      console.error(err);
      setScoreError(err.response?.data?.message || 'Error executing array.');
    } 
    finally { setLoading(false); }
  };

  const handleProofUpload = async (drawId, matchType, prizeShare) => {
    if (!proofFile) {
      alert("Please select an image proof first.");
      return;
    }
    const formData = new FormData();
    formData.append('image', proofFile);
    formData.append('drawId', drawId);
    formData.append('matchType', matchType);
    formData.append('prizeAmount', prizeShare);

    try {
      await API.post('/winner/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Proof submitted successfully.");
      setProofFile(null);
      fetchWinnings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting proof");
    }
  };

  const handleDeleteSubscription = async (id) => {
    try {
      await API.delete(`/payment/cancel/${id}`);
      fetchSubscriptions();
    } catch (err) {
      alert("Error cancelling subscription");
    }
  };

  const handleResumePayment = (sub) => {
    const amount = sub.plan === "yearly" ? 1000000 : 100000;
    const options = {
      key: 'rzp_test_SXONAICSSMElAV',
      amount: amount,
      currency: "INR",
      name: "Golf Charity Platform",
      description: `${sub.plan} Subscription Continuation`,
      order_id: sub.razorpayOrderId,
      handler: async function (response) {
        try {
          await API.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan: sub.plan,
          });
          window.location.reload(); 
        } catch (err) {
          alert("Payment verification failed.");
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: { color: "#10B981" }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
      alert(`Payment Failed: ${response.error.description}`);
    });
    rzp1.open();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{user?.name}</span></h1>
        <p className="text-slate-400 text-lg">Manage your impact, log scores, and track your platform progression.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Profile Status
            </h3>
            <div className={`text-4xl font-black capitalize tracking-tight ${user?.subscriptionStatus === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {user?.subscriptionStatus}
            </div>
            {subscription && user?.subscriptionStatus === 'active' && (
              <div className="mt-4 text-sm font-medium text-slate-300 bg-slate-900/50 inline-block px-3 py-1.5 rounded-lg border border-slate-700">
                Renews: {new Date(subscription.endDate).toLocaleDateString()}
              </div>
            )}
          </div>
          {user?.subscriptionStatus !== 'active' && (
             <button onClick={() => navigate('/subscribe')} className="btn-primary mt-6 w-full shadow-emerald-500/20 shadow-lg relative z-10">Activate Subscription</button>
          )}
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
          <div className="relative z-10">
             <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="text-emerald-500 text-lg">♥</span> Your Active Charity
             </h3>
             <div className="text-2xl font-bold truncate text-white mb-4">
               {user?.charityId?.name || "No Charity Selected"}
             </div>
             <div className="mt-2 flex items-center gap-4">
               <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Contribution Level</span>
               <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-xl font-black border border-emerald-500/30 shadow-inner">
                 {user?.contributionPercentage || 0}%
               </span>
             </div>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-20 blur-xl rounded-3xl z-0"></div>
          <div className="relative z-10">
             <h3 className="text-slate-300 font-bold mb-2 uppercase tracking-wider text-sm">Realized Winnings</h3>
             <div className="text-5xl font-black text-white mt-3 truncate tracking-tighter">
               ₹{winnings.filter(w => w.proofStatus === 'paid').reduce((acc, curr) => acc + curr.prizeShare, 0).toLocaleString()}
             </div>
             <div className="mt-5 text-sm font-bold text-emerald-400 bg-slate-900/50 inline-block px-4 py-2 rounded-xl border border-emerald-500/20">
               {winnings.filter(w => w.proofStatus === 'paid').length} Processed Disbursements
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-5 bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
             <div className="p-2 bg-emerald-500/20 rounded text-emerald-400">⛳</div>
             Log Round Protocol
          </h2>
          <form onSubmit={handleScoreSubmit} className="space-y-6">
            {scoreError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500 font-medium">{scoreError}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider pl-1">Measurement (1-45)</label>
                <input 
                  type="number" min="1" max="45" required 
                  className="w-full bg-slate-900/80 border-2 border-slate-700 focus:border-emerald-500 rounded-2xl p-4 text-2xl font-bold text-emerald-400 transition-colors focus:ring-0 shadow-inner" 
                  value={newScore} onChange={(e) => setNewScore(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider pl-1">Protocol Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-900/80 border-2 border-slate-700 focus:border-emerald-500 rounded-2xl p-4 text-lg font-bold text-emerald-400 transition-colors focus:ring-0 shadow-inner" 
                  value={scoreDate} onChange={(e) => setScoreDate(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" disabled={loading || user?.subscriptionStatus !== 'active'} className="w-full py-4 text-lg font-bold btn-primary rounded-xl shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_25px_rgba(16,185,129,0.4)] disabled:shadow-none transition-all">
              {loading ? 'Processing Array...' : 'Commit Sequence'}
            </button>
            {user?.subscriptionStatus !== 'active' && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-500 font-medium flex items-center gap-2">
                 <span>⚠️</span> Subscription Required to push sequences.
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-7 bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Chronological Registry</h2>
            <div className="flex items-center gap-2 text-xs font-bold bg-slate-900/80 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 shadow-inner">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               ROLLING 5 FRAMEWORK
            </div>
          </div>
          <div className="space-y-4">
            {scores.length === 0 ? (
              <div className="text-slate-500 border-2 border-dashed border-slate-700 p-12 rounded-2xl text-center font-medium">Data matrix is currently empty. Waiting for inputs.</div>
            ) : (
              scores.map((s, idx) => (
                <div key={s._id} className="group flex justify-between items-center p-5 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:bg-slate-800 hover:border-emerald-500/30 focus-within:ring-2 transition-all shadow-sm translate-y-0 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                     <span className="text-sm font-black text-slate-700 w-6">0{idx + 1}</span>
                     <div>
                       <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Timestamp</div>
                       <div className="text-sm text-slate-300 font-medium">{new Date(s.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                     </div>
                  </div>
                  <div className="flex items-end gap-1">
                     <span className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors drop-shadow-lg">{s.score}</span>
                     <span className="text-sm font-bold text-slate-500 mb-1">pt</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {winnings.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl p-8 rounded-3xl mb-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <span className="text-9xl font-black text-emerald-500">🏆</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-8 relative z-10 tracking-tight">Pending Proof Submissions</h2>
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
             {winnings.map(w => (
                <div key={w.drawId} className="p-6 bg-slate-900/80 rounded-2xl border border-emerald-500/20 shadow-xl group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                       <div className="inline-block bg-emerald-500/20 text-emerald-400 font-black px-3 py-1 rounded border border-emerald-500/30 mb-2 uppercase text-xs tracking-wider">
                          Level {w.matchCount} Match Detected
                       </div>
                       <div className="text-slate-400 text-sm font-medium">Draw cycle: {new Date(w.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors tracking-tighter">₹{w.prizeShare?.toLocaleString() || '0'}</div>
                       <div className="text-xs uppercase font-bold text-slate-500">Estimated Yield</div>
                    </div>
                  </div>
                  
                  {w.proofStatus === 'missing' ? (
                     <div className="flex flex-col gap-4 mt-6 p-5 border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 transition-colors rounded-xl bg-slate-800/50">
                        <label className="text-sm font-bold text-emerald-400 mb-1 flex items-center justify-between">
                           Upload Photographic Evidence
                           <span className="text-xs text-slate-500 font-medium hidden sm:inline">JPG, PNG, WEBP</span>
                        </label>
                        <input type="file" accept="image/*" onChange={e => setProofFile(e.target.files[0])} className="text-sm text-slate-300 font-medium file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border border-slate-600 file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 file:transition-colors file:cursor-pointer w-full bg-slate-900 rounded-xl" />
                        <button onClick={() => handleProofUpload(w.drawId, w.matchCount, w.prizeShare)} className="btn-primary py-3 w-full font-bold shadow-lg shadow-emerald-500/20 mt-2">Transmit Evidence</button>
                     </div>
                  ) : (
                    <div className="mt-6 flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700">
                       <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verification Status</span>
                       <span className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize border
                          ${w.proofStatus === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 
                            w.proofStatus === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 
                            w.proofStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                            'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                         • {w.proofStatus} Process
                       </span>
                    </div>
                  )}
                </div>
             ))}
          </div>
        </div>
      )}

      {/* Subscription History Tracker */}
      <h2 className="text-3xl font-extrabold mt-12 mb-8 tracking-tight">Your Subscription Ledger</h2>
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl mb-12">
        <table className="w-full text-left relative z-10">
          <thead className="bg-slate-800">
            <tr>
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Tier / Period</th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Initialization Date</th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">State</th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {subscriptions?.map(sub => (
              <tr key={sub._id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-6 capitalize">
                   <span className="text-white font-bold">{sub.plan} Coverage</span>
                </td>
                <td className="py-4 px-6 text-slate-300">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block tracking-wider uppercase
                    ${sub.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 
                      sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                      'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                    • {sub.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-3">
                  {sub.status === 'pending' && (
                    <>
                      <button onClick={() => handleDeleteSubscription(sub._id)} className="text-xs bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500 font-bold px-4 py-2 rounded-lg transition-colors shadow">Drop Cart</button>
                      <button onClick={() => handleResumePayment(sub)} className="text-xs bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500 font-bold px-4 py-2 rounded-lg transition-colors shadow shadow-emerald-500/20">Pay Now</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr><td colSpan="4" className="py-6 px-6 text-center text-slate-500">No subscription history detected.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;
