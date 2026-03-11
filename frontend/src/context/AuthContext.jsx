import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const TOKEN_KEY = 'tm_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
});

export function AuthProvider({ children }) {
  // undefined = loading, null = not logged in, object = logged in user
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // Pick up token from URL after Google OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem(TOKEN_KEY, urlToken);
      // Clean token from URL without triggering a reload
      window.history.replaceState({}, '', window.location.pathname);
    }

    const token = urlToken ?? getToken();
    if (!token) return setUser(null);

    authApi.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setUser(r.data.data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
