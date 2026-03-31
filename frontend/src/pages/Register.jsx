import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    charityId: '',
    contributionPercentage: 10
  });
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Optionally fetch charities for the dropdown
    API.get('/charities').then(res => setCharities(res.data.charities)).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.contributionPercentage < 10) {
      setError("Minimum charity contribution is 10%");
      return;
    }
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Join the Movement
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Create your account today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center bg-red-900/30 p-2 rounded">{error}</div>}
          <div className="space-y-4">
            <input type="text" name="name" required className="input-field" placeholder="Full Name" onChange={handleChange} />
            <input type="email" name="email" required className="input-field" placeholder="Email address" onChange={handleChange} />
            <input type="password" name="password" required className="input-field" placeholder="Password" onChange={handleChange} />
            
            <select name="charityId" className="input-field appearance-none" onChange={handleChange} required>
              <option value="">Select a Charity to Support</option>
              {charities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            <div>
              <label className="text-sm text-slate-400 block mb-2">Contribution (%) - Minimum 10%</label>
              <input type="number" name="contributionPercentage" min="10" max="100" className="input-field" value={formData.contributionPercentage} onChange={handleChange} />
            </div>
          </div>
          <div>
            <button type="submit" className="w-full btn-primary text-lg">Sign up</button>
          </div>
          <div className="text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
