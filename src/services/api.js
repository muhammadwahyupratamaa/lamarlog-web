const configuredBaseUrl = import.meta.env?.VITE_API_BASE_URL?.replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function api(path, { token, headers, withMeta = false, baseUrl = configuredBaseUrl, ...options } = {}) {
  if (!baseUrl) throw new ApiError('Alamat API belum diatur. Tambahkan VITE_API_BASE_URL.', 0);
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    });
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi dan alamat API.', 0);
  }

  const payload = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.error?.message || 'Terjadi kesalahan pada server.', response.status, payload.error?.details);
  if (response.status === 204) return undefined;
  if (!Object.hasOwn(payload, 'data') || payload.data == null) throw new ApiError('Respons server tidak valid.', response.status);
  return withMeta ? payload : payload.data;
}
