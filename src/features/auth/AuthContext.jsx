import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';

const AuthContext = createContext(null);
const storageKey = 'applyflow.token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(storageKey));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem(storageKey);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api('/auth/me', { token }).then(({ user: currentUser }) => setUser(currentUser)).catch(clearSession).finally(() => setLoading(false));
  }, [token]);

  const startSession = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem(storageKey, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = async () => {
    try { if (token) await api('/auth/logout', { method: 'POST', token }); } finally { clearSession(); }
  };

  const value = useMemo(() => ({ token, user, loading, startSession, logout }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
