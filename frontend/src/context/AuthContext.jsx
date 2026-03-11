import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const authApi = axios.create({
  baseURL:         import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
});

export function AuthProvider({ children }) {
  // undefined = still loading, null = not logged in, object = logged in
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    authApi.get('/auth/me')
      .then((r) => setUser(r.data.data))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await authApi.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
