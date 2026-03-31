import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const { user, updateUserSubscriptionStatus } = useContext(AuthContext);
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState(user?.charityId || '');
  const [contribution, setContribution] = useState(user?.contributionPercentage || 10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/charities').then(res => setCharities(res.data.charities)).catch(console.error);
  }, []);

  const handleSubscribe = async (plan) => {
    if (!selectedCharity) {
      alert("Please select a charity first.");
      return;
    }
    setLoading(true);
    try {
      // Create Razorpay order
      const { data } = await API.post('/payment/create-order', { plan });
      const order = data.order;

      const options = {
        key: 'rzp_test_SXONAICSSMElAV', // Pulled from the user's .env screenshot previously
        amount: order.amount,
        currency: order.currency,
        name: "Golf Charity Platform",
        description: `${plan} Subscription`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });
            updateUserSubscriptionStatus('active');
            navigate('/dashboard');
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#10B981"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (err) {
      console.error(err);
      alert("Error initiating checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
          Activate Your Impact
        </h1>
        <p className="text-slate-400 text-lg">Choose your subscription plan to join the draws and support your selected charity.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl mb-12 border border-emerald-500/20">
        <h2 className="text-2xl font-bold mb-6">Your Charity Configuration</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Selected Charity</label>
            <select 
              className="input-field appearance-none cursor-pointer" 
              value={selectedCharity} 
              onChange={(e) => setSelectedCharity(e.target.value)}
            >
              <option value="">Select a Charity to Support</option>
              {charities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Contribution Percentage</label>
            <input 
              type="number" 
              min="10" 
              max="100" 
              className="input-field" 
              value={contribution} 
              onChange={(e) => setContribution(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-2">Minimum 10%. This portion of your fee goes directly to the charity.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-2xl text-center hover:border-emerald-500/50 border border-transparent transition-colors">
          <h3 className="text-2xl font-bold mb-2">Monthly</h3>
          <div className="text-4xl font-extrabold text-emerald-400 mb-4">₹1,000<span className="text-sm text-slate-500 font-normal">/mo</span></div>
          <ul className="text-slate-300 mb-8 space-y-3 text-left w-max mx-auto">
            <li>✓ Entry to 1 Monthly Draw</li>
            <li>✓ Rolling 5 Scores</li>
            <li>✓ Charity Match Auto-Deduct</li>
          </ul>
          <button 
            onClick={() => handleSubscribe('monthly')}
            disabled={loading}
            className="w-full btn-primary"
          >
            Subscribe Monthly
          </button>
        </div>

        <div className="glass-panel p-8 rounded-2xl text-center border border-emerald-500 relative">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
            BEST VALUE
          </div>
          <h3 className="text-2xl font-bold mb-2">Yearly</h3>
          <div className="text-4xl font-extrabold text-emerald-400 mb-4">₹10,000<span className="text-sm text-slate-500 font-normal">/yr</span></div>
          <ul className="text-slate-300 mb-8 space-y-3 text-left w-max mx-auto">
            <li>✓ 2 Months Free</li>
            <li>✓ Entry to all 12 Draws</li>
            <li>✓ Charity Match Auto-Deduct</li>
            <li>✓ Priority Verification</li>
          </ul>
          <button 
            onClick={() => handleSubscribe('yearly')}
            disabled={loading}
            className="w-full btn-primary"
          >
            Subscribe Yearly
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
