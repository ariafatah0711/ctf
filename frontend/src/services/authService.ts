// src/services/authService.ts
import config from '../config/env';
import { swalSuccess, swalError } from '../utils/swalAlert';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export async function checkSetupStatus() {
  const res = await fetch(`${config.BASE_URL}/api/setup`)
  if (!res.ok) throw new Error('Gagal memeriksa status setup')
  return res.json()
}

export async function setupAdmin({ email, password }: { email: string, password: string }) {
  const res = await fetch(`${config.BASE_URL}/api/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const errorRes = await res.json()
    throw new Error(errorRes.message || 'Setup gagal')
  }

  return res.json()
}


export async function login(payload: LoginPayload) {
  try {
    const res = await fetch(`${config.BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      swalError(data.message || 'Login gagal');
      return null;
    }

    swalSuccess('Login Berhasil');
    return data; // { message, token }

  } catch (err) {
    swalError('Terjadi kesalahan saat login');
    return null;
  }
}

export async function register(payload: RegisterPayload) {
  try {
    const res = await fetch(`${config.BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      swalError(data.message || 'Registrasi gagal');
      return null;
    }

    swalSuccess('Register Berhasil');
    return data;

  } catch (err) {
    swalError('Terjadi kesalahan saat registrasi');
    return null;
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await fetch(`${config.BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      swalError(data.message || 'Gagal mengirim email reset password');
      return null;
    }

    swalSuccess('Berhasil Mengirim Email');
    return data;

  } catch (err) {
    swalError('Terjadi kesalahan saat mengirim email');
    return null;
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const res = await fetch(`${config.BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      swalError(data.message || 'Reset password gagal');
      return null;
    }

    swalSuccess('Reset password berhasil');
    return data;

  } catch (err) {
    swalError('Terjadi kesalahan saat reset password');
    return null;
  }
}
