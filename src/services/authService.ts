import {
  apiRequest,
  setToken,
} from "./api";
import type {
  LoginResponse,
  MessageResponse,
} from "../types/auth";

export async function login(
  email: string,
  password: string
): Promise<void> {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  const data: LoginResponse = await apiRequest(
    "/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  setToken(data.access_token);
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  await apiRequest("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(
  email: string
): Promise<MessageResponse> {
  return apiRequest("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  await apiRequest("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      new_password: newPassword,
    }),
  });
}
