import {
  apiRequest,
  authHeaders,
} from "./api";
import type { User } from "../types/auth";

export async function getCurrentUser(): Promise<User> {
  return apiRequest("/api/users/me", {
    headers: authHeaders(),
  });
}
