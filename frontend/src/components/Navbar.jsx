import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              Fairway Impact
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/charities" className="text-slate-300 hover:text-white transition-colors">Charities</Link>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Admin Panel</Link>
                ) : (
                  <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="flex items-center text-slate-300 hover:text-white transition-colors ml-4">
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Log in</Link>
                <Link to="/register" className="btn-primary">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
