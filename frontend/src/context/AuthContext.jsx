import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data.user);
          setSubscription(data.subscription);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    // Fetch deep subscription logic instantly
    const meReq = await API.get('/auth/me');
    setUser(meReq.data.user);
    setSubscription(meReq.data.subscription);
    return data;
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    const meReq = await API.get('/auth/me');
    setUser(meReq.data.user);
    setSubscription(meReq.data.subscription);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSubscription(null);
  };

  const updateUserSubscriptionStatus = (status) => {
    setUser((prev) => ({ ...prev, subscriptionStatus: status }));
  };

  return (
    <AuthContext.Provider value={{ user, subscription, login, register, logout, loading, updateUserSubscriptionStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
