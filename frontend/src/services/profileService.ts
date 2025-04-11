import config from '../config/env';
import { login } from './authService';
import { encryptAuthData } from '../utils/crypto';
import { useAuthStore } from '../stores/auth';

export async function updateUserProfile(data: any, token: string) {
  const res = await fetch(`${config.BASE_URL}/api/users/update-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Gagal update profil');

  return result;
}

export async function reLoginIfNeeded(email?: string, password?: string) {
  if (email && password) {
    const auth = useAuthStore();
    const { session, user: newUser } = await login({ email, password });
    auth.login(session, newUser);
    await auth.checkAuth();

    const encrypted = localStorage.getItem('auth_data');
    if (encrypted) {
      const updatedEncrypted = encryptAuthData(email, password);
      localStorage.setItem('auth_data', updatedEncrypted);
    }
  }
}
