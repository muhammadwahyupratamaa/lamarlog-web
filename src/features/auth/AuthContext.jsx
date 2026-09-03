import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, unauthorizedEvent } from '../../services/api';
import { readToken, removeToken, saveToken } from '../../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readToken(localStorage));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    removeToken(localStorage);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api('/auth/me', { token }).then(({ user: currentUser }) => setUser(currentUser)).catch(clearSession).finally(() => setLoading(false));
  }, [token, clearSession]);

  useEffect(() => {
    window.addEventListener(unauthorizedEvent, clearSession);
    return () => window.removeEventListener(unauthorizedEvent, clearSession);
  }, [clearSession]);

  const startSession = ({ token: nextToken, user: nextUser }) => {
    saveToken(localStorage, nextToken);
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
