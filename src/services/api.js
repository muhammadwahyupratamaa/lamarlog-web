const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function api(path, { token, headers, withMeta = false, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    });
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi dan alamat API.', 0);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.error?.message || 'Terjadi kesalahan pada server.', response.status, payload.error?.details);
  return withMeta ? payload : payload.data;
}
