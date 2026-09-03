const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuth(values, mode) {
  const errors = {};
  if (mode === 'register' && !values.name.trim()) errors.name = 'Nama wajib diisi.';
  if (!emailPattern.test(values.email.trim())) errors.email = 'Masukkan email yang valid.';
  if (!values.password) errors.password = 'Password wajib diisi.';
  else if (mode === 'register' && (values.password.length < 8 || values.password.length > 72)) errors.password = 'Password harus 8–72 karakter.';
  if (mode === 'register' && values.password !== values.confirmPassword) errors.confirmPassword = 'Konfirmasi password tidak cocok.';
  return errors;
}
