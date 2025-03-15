import { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children, navigate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.request('/api/auth/me', 'GET');
      setUser(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      localStorage.removeItem('token');

      if (
        !window.location.pathname.includes('onboarding') &&
        !window.location.pathname.includes('signup') &&
        !window.location.pathname.includes('login')
      ) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.request('/api/auth/login', 'POST', { email, password });

      if (!response || !response.token) {
        console.error('Login failed: No token returned');
        return;
      }

      localStorage.setItem('token', response.token);
      setUser(response.user);

      navigate(response.user.role === 'BUSINESS_OWNER' ? '/onboarding' : '/dashboard');
    } catch (error) {
      console.error('Login failed:', error?.message || 'Unknown error during login');
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await api.request('/api/auth/register', 'POST', {
        email,
        password,
        role: 'BUSINESS_OWNER',
      });

      if (!response || !response.token) {
        console.error('Signup failed: No token returned');
        return;
      }

      localStorage.setItem('token', response.token);
      setUser(response.user);

      navigate('/onboarding');
    } catch (error) {
      console.error('Signup failed:', error?.message || 'Unknown error during signup');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = { user, login, signup, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;