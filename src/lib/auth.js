export const authStorageKey = 'applyflow.token';

export const readToken = (storage) => storage.getItem(authStorageKey);
export const saveToken = (storage, token) => storage.setItem(authStorageKey, token);
export const removeToken = (storage) => storage.removeItem(authStorageKey);

export function routeAccess(user, loading, guest = false) {
  if (loading) return 'loading';
  if (guest) return user ? '/dashboard' : 'allow';
  return user ? 'allow' : '/login';
}
