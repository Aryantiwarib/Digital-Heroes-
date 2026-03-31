import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({ users: [], charities: [], draws: [], winners: [], scores: [], subscriptions: [] });
  const [loading, setLoading] = useState(false);

  const [charityForm, setCharityForm] = useState({ name: '', description: '', image: '' });
  const [drawType, setDrawType] = useState('random');

  const [editUser, setEditUser] = useState(null);
  const [editScore, setEditScore] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users' || activeTab === 'reports') {
        const res = await API.get('/auth/users');
        setData((prev) => ({ ...prev, users: res.data.users }));
      }
      if (activeTab === 'charities' || activeTab === 'reports') {
        const res = await API.get('/charities');
        setData((prev) => ({ ...prev, charities: res.data.charities }));
      }
      if (activeTab === 'draws' || activeTab === 'reports') {
        const res = await API.get('/draw/results');
        setData((prev) => ({ ...prev, draws: res.data.draws }));
      }
      if (activeTab === 'winners') {
        const res = await API.get('/winner');
        setData((prev) => ({ ...prev, winners: res.data.winners }));
      }
      if (activeTab === 'scores' || activeTab === 'reports') {
        const res = await API.get('/scores/all');
        setData((prev) => ({ ...prev, scores: res.data.scores }));
      }
      if (activeTab === 'payments' || activeTab === 'reports') {
        const res = await API.get('/payment/subscriptions');
        setData((prev) => ({ ...prev, subscriptions: res.data.subscriptions }));
      }
    } catch (err) { } finally { setLoading(false); }
  };

  const handleUpdateUser = async () => {
    try {
      await API.put(`/auth/users/${editUser._id}`, editUser);
      setEditUser(null);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleUpdateScore = async () => {
    try {
      await API.put(`/scores/${editScore._id}`, editScore);
      setEditScore(null);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleCreateCharity = async (e) => {
    e.preventDefault();
    try {
      await API.post('/charities', charityForm);
      setCharityForm({ name: '', description: '', image: '' });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleDeleteCharity = async (id) => {
    try {
      await API.delete(`/charities/${id}`);
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleRunDraw = async (e) => {
    e.preventDefault();
    try {
      await API.post('/draw/run', { type: drawType });
      fetchData();
    } catch(err) { 
      alert(err.response?.data?.message || 'Error running draw');
      console.error(err); 
    }
  };

  const handlePublishDraw = async (id) => {
    try {
      await API.post(`/draw/publish/${id}`);
      fetchData();
      alert('Draw published successfully. Jackpot rollover updated.');
    } catch(err) {
      alert(err.response?.data?.message || 'Error publishing draw');
      console.error(err);
    }
  };

  const verifyWinner = async (id, status) => {
    try {
      await API.put(`/winner/verify/${id}`, { status });
      fetchData();
    } catch(err) { console.error(err); }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-2xl sticky top-24">
          <div className="flex items-center gap-3 mb-6 px-4">
             <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">\</div>
             <h2 className="text-xl font-bold tracking-tight">Admin</h2>
          </div>
          <nav className="space-y-1">
            {['users', 'scores', 'charities', 'draws', 'winners', 'payments', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all capitalize flex items-center gap-3 ${
                  activeTab === tab ? 'bg-gradient-to-r from-emerald-500/20 to-transparent text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-700/30 hover:text-white border-l-2 border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        {loading && <div className="text-emerald-500 font-medium mb-6 animate-pulse flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Loading dataset...</div>}

        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Users Overview</h2>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Name</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Email</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Role</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Status</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {data.users.map((u) => (
                    editUser?._id === u._id ? (
                      <tr key={u._id} className="bg-slate-700/50">
                        <td className="py-2 px-6"><input className="input-field p-2 text-sm" value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} /></td>
                        <td className="py-2 px-6"><input className="input-field p-2 text-sm" value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} /></td>
                        <td className="py-2 px-6">
                           <select className="input-field p-2 text-sm" value={editUser.role} onChange={e => setEditUser({...editUser, role: e.target.value})}>
                              <option value="user">User</option><option value="admin">Admin</option>
                           </select>
                        </td>
                        <td className="py-2 px-6">
                           <select className="input-field p-2 text-sm" value={editUser.subscriptionStatus} onChange={e => setEditUser({...editUser, subscriptionStatus: e.target.value})}>
                              <option value="active">Active</option><option value="expired">Expired</option><option value="inactive">Inactive</option>
                           </select>
                        </td>
                        <td className="py-2 px-6 text-right">
                           <button onClick={handleUpdateUser} className="text-emerald-400 hover:text-white mr-2 text-sm">Save</button>
                           <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-white text-sm">Cancel</button>
                        </td>
                      </tr>
                    ) : (
                    <tr key={u._id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="py-4 px-6 font-medium">{u.name}</td>
                      <td className="py-4 px-6 text-slate-400">{u.email}</td>
                      <td className="py-4 px-6"><span className="text-sm bg-slate-700 text-slate-300 px-3 py-1 rounded-full">{u.role}</span></td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.subscriptionStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {u.subscriptionStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <button onClick={() => setEditUser(u)} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded">Edit</button>
                      </td>
                    </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'scores' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Scores Matrix Directory</h2>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">User</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Score</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Date</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {data.scores.map((s) => (
                    editScore?._id === s._id ? (
                      <tr key={s._id} className="bg-slate-700/50">
                        <td className="py-2 px-6">{s.userId?.name}</td>
                        <td className="py-2 px-6"><input type="number" className="input-field p-2 w-20 text-sm" value={editScore.score} onChange={e => setEditScore({...editScore, score: e.target.value})} /></td>
                        <td className="py-2 px-6"><input type="date" className="input-field p-2 text-sm" value={editScore.date ? new Date(editScore.date).toISOString().split('T')[0] : ''} onChange={e => setEditScore({...editScore, date: e.target.value})} /></td>
                        <td className="py-2 px-6 text-right">
                           <button onClick={handleUpdateScore} className="text-emerald-400 hover:text-emerald-300 mr-3 text-sm">Save</button>
                           <button onClick={() => setEditScore(null)} className="text-slate-400 hover:text-white text-sm">Cancel</button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={s._id} className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-4 px-6 text-slate-300 font-medium">{s.userId?.name || 'Unknown'}</td>
                        <td className="py-4 px-6 text-white font-bold">{s.score}</td>
                        <td className="py-4 px-6 text-slate-400">{s.date ? new Date(s.date).toLocaleDateString() : 'N/A'}</td>
                        <td className="py-4 px-6 text-right">
                           <button onClick={() => setEditScore(s)} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded">Edit</button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'charities' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Manage Charities</h2>
            <form onSubmit={handleCreateCharity} className="mb-10 p-8 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white">Add New Charity Organization</h3>
              <div className="grid grid-cols-2 gap-6">
                <input type="text" placeholder="Charity Name" required className="input-field bg-slate-900 focus:bg-slate-800 border-slate-600" value={charityForm.name} onChange={(e) => setCharityForm({...charityForm, name: e.target.value})} />
                <input type="text" placeholder="Image URL Anchor (Optional)" className="input-field bg-slate-900 focus:bg-slate-800 border-slate-600" value={charityForm.image} onChange={(e) => setCharityForm({...charityForm, image: e.target.value})} />
              </div>
              <textarea placeholder="Detailed description of the charity's impact..." required className="input-field bg-slate-900 focus:bg-slate-800 border-slate-600 min-h-[120px]" value={charityForm.description} onChange={(e) => setCharityForm({...charityForm, description: e.target.value})}></textarea>
              <button type="submit" className="btn-primary px-8">Create Charity</button>
            </form>

            <div className="space-y-4">
              {data.charities.map(c => (
                <div key={c._id} className="flex justify-between items-center p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow hover:shadow-lg transition-all">
                  <div>
                    <h4 className="font-bold text-xl mb-1 text-white">{c.name}</h4>
                    <p className="text-sm text-slate-400 max-w-2xl line-clamp-2">{c.description}</p>
                  </div>
                  <button onClick={() => handleDeleteCharity(c._id)} className="text-red-400 hover:text-white font-bold border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500 transition-colors shadow-sm">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'draws' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Draw Engine</h2>
            <form onSubmit={handleRunDraw} className="mb-12 p-8 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-2xl flex items-end gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none -mr-10 -mt-20"></div>
              <div className="flex-grow relative z-10">
                <label className="block text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wider">Execute Monthly Protocol</label>
                <select className="input-field bg-slate-900 border-slate-600 text-lg" value={drawType} onChange={(e) => setDrawType(e.target.value)}>
                  <option value="random">True Randomization Matrix</option>
                  <option value="algorithm">Algorithmic Distribution (Frequency Weighted)</option>
                </select>
              </div>
              <button type="submit" className="btn-primary flex-shrink-0 px-10 py-4 text-lg font-bold relative z-10 shadow-emerald-500/40 shadow-lg">Simulate Draw Engine</button>
            </form>

            <h3 className="text-2xl font-bold mb-6 tracking-tight">Latest Draw Outcome</h3>
            <div className="grid gap-6">
              {data.draws.slice(0, 1).map(d => (
                <div key={d._id} className={`p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border ${d.status === 'simulated' ? 'border-amber-500/50' : 'border-slate-700/50'} hover:border-slate-500 transition-colors`}>
                  
                  {d.status === 'simulated' && (
                    <div className="mb-4 bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex justify-between items-center text-amber-400 font-bold sm:flex-row flex-col gap-4">
                      <span className="flex items-center gap-2">⚠️ <span>Simulation Complete. Awaiting Verification & Publication</span></span>
                      <button onClick={() => handlePublishDraw(d._id)} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-2 rounded-lg shadow-lg shadow-amber-500/20 font-black tracking-wide w-full sm:w-auto transition-transform hover:scale-105">Approve & Publish Results</button>
                    </div>
                  )}
                  {d.status === 'published' && (
                    <div className="mb-4 inline-block bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      ✓ Published & Rollover Activated
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6 border-b border-slate-700/50 pb-4">
                    <div>
                        <div className="text-sm text-slate-400 font-medium mb-1">{new Date(d.drawDate).toLocaleDateString()}</div>
                        <div className="text-emerald-400 font-extrabold capitalize tracking-wide">{d.type} Process</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-white">₹{d.totalPrizePool.toFixed(2)}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Aggregate Pool</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {d.winningNumbers.map((num, idx) => (
                      <span key={idx} className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 font-bold text-xl flex items-center justify-center border border-emerald-500/30 shadow-inner">
                        {num}
                      </span>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 text-sm text-slate-300 font-medium border border-slate-700/50 shadow-inner">
                    <div className="flex justify-between items-center mb-3">
                      <span>Active Winners Bracket</span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">{d.results.length} Identifiers</span>
                    </div>
                    {d.results.length > 0 && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-slate-700/50">
                        {d.results.map((r, i) => (
                          <div key={i} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                            <span className="text-white font-bold tracking-wide">{r.userId?.name || 'Unknown User'}</span>
                            <span className="text-amber-400 font-bold">{r.matchCount} Matches (₹{r.prizeShare.toFixed(2)})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'winners' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Compliance & Verification</h2>
             <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">User</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Payout Value</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Proof Material</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">State</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold text-right">Approvals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {data.winners.length === 0 && <tr><td colSpan="5" className="text-center py-10 text-slate-500 font-medium">No validations in queue.</td></tr>}
                  {data.winners.map((w) => (
                    <tr key={w._id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="py-4 px-6">
                         <div className="font-bold text-white">{w.userId?.name || 'Unknown'}</div>
                         <div className="text-sm text-emerald-400 font-medium">{w.matchType} Number Match</div>
                      </td>
                      <td className="py-4 px-6 text-white font-mono font-medium tracking-tight bg-slate-900/40">₹{w.prizeAmount?.toFixed(2) || '0.00'}</td>
                      <td className="py-4 px-6">
                         {w.proofImage ? (
                            <a 
                              href={`http://localhost:8000/${w.proofImage}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-blue-400 hover:text-blue-300 underline font-medium flex items-center gap-1"
                            >
                               <span className="text-lg">📄</span> View Evidence
                            </a>
                         ) : (
                            <span className="text-slate-500 italic">No File</span>
                         )}
                      </td>
                      <td className="py-4 px-6 capitalize">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block border
                           ${w.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                             w.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                             w.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                             'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          • {w.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                         {w.status === 'pending' && <button onClick={() => verifyWinner(w._id, 'approved')} className="text-xs bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500 font-bold px-4 py-2 rounded-lg transition-colors shadow">Authorize</button>}
                         {w.status === 'approved' && <button onClick={() => verifyWinner(w._id, 'paid')} className="text-xs bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500 font-bold px-4 py-2 rounded-lg transition-colors shadow">Complete Dispense</button>}
                         {(w.status === 'pending' || w.status === 'approved') && <button onClick={() => verifyWinner(w._id, 'rejected')} className="text-xs bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500 font-bold px-4 py-2 rounded-lg transition-colors shadow">Reject</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           </div>
        )}

        {activeTab === 'payments' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Subscription Ledgers</h2>
             <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
               <table className="w-full text-left relative z-10">
                 <thead className="bg-slate-800">
                   <tr>
                     <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Client / Email</th>
                     <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Tier / Period</th>
                     <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">Transaction Reference</th>
                     <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-bold">State</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-700/50">
                   {data.subscriptions?.map(sub => (
                     <tr key={sub._id} className="hover:bg-slate-700/30 transition-colors">
                       <td className="py-4 px-6">
                         <div className="font-bold text-white text-lg">{sub.userId?.name || 'Unknown'}</div>
                         <div className="text-slate-400 text-sm mt-1">{sub.userId?.email || 'N/A'}</div>
                       </td>
                       <td className="py-4 px-6 capitalize">
                          <span className="text-white font-medium">{sub.plan}</span>
                          <div className="text-slate-500 text-xs mt-1">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </div>
                       </td>
                       <td className="py-4 px-6 font-mono text-sm text-slate-300">
                         <div>Order: <span className="text-teal-400">{sub.razorpayOrderId || 'N/A'}</span></div>
                         {sub.razorpaySubscriptionId && <div>Pay ID: <span className="text-emerald-400">{sub.razorpaySubscriptionId}</span></div>}
                       </td>
                       <td className="py-4 px-6">
                         <span className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block tracking-wider uppercase
                           ${sub.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 
                             sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                             'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                           • {sub.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {activeTab === 'reports' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Platform Intelligence Analytics</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800/80 backdrop-blur-xl p-8 border border-emerald-500/20 rounded-3xl shadow-lg relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                   <h3 className="text-slate-400 font-bold mb-3 uppercase tracking-wider text-sm relative z-10">Total Enrolled Users</h3>
                   <div className="text-6xl text-emerald-400 font-black tracking-tighter relative z-10">{data.users?.length || 0}</div>
                </div>
                <div className="bg-slate-800/80 backdrop-blur-xl p-8 border border-teal-500/20 rounded-3xl shadow-lg relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                   <h3 className="text-slate-400 font-bold mb-3 uppercase tracking-wider text-sm relative z-10">Active Cohort</h3>
                   <div className="text-6xl text-teal-400 font-black tracking-tighter relative z-10">{data.users?.filter(u => u.subscriptionStatus === 'active').length || 0}</div>
                </div>
                <div className="bg-emerald-600/20 backdrop-blur-xl p-8 border border-emerald-500/40 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
                   <h3 className="text-emerald-300 font-bold mb-3 uppercase tracking-wider text-sm">Aggregate Dispensed Volume</h3>
                   <div className="text-5xl text-white font-black tracking-tighter mt-4">₹{data.draws?.reduce((acc, curr) => acc + curr.totalPrizePool, 0).toLocaleString() || '0.00'}</div>
                </div>
             </div>
             
             <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-white border-b border-slate-700/50 pb-4">Real-Time Philanthropic Topology</h3>
                <div className="space-y-4">
                   {data.charities?.map(c => (
                     <div key={c._id} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                        <span className="text-lg font-medium text-slate-200">{c.name}</span>
                        <div className="flex items-center gap-3">
                           <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(((data.users?.filter(u => u.charityId === c._id).length || 0) / (data.users?.length || 1)) * 100, 100)}%` }}></div>
                           </div>
                           <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded w-32 text-center">
                             {data.users?.filter(u => u.charityId === c._id).length || 0} Backer(s)
                           </span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
