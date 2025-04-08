// src/services/authService.ts
import config from '../config';
import { swalSuccess } from '../utills/swalAlert';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const res = await fetch(`${config.BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login gagal');
  } else {
    await swalSuccess("Login Berhasil");
  }

  return res.json(); // { message, token }
}

export async function register(payload: RegisterPayload) {
  const res = await fetch(`${config.BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registrasi gagal');
  } else {
    await swalSuccess("Register Berhasil");
  }

  return res.json(); // { message }
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${config.BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengirim email reset password');
  } else {
    await swalSuccess("Berhasil Mengirim Email");
  }

  return res.json(); // { message }
}