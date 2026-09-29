import {
  apiRequest,
  authHeaders,
} from "./api";

import type {
  MessageResponse,
  User,
} from "../types/auth";


export async function getCurrentUser():
  Promise<User> {
  return apiRequest(
    "/api/users/me",
    {
      headers: authHeaders(),
    }
  );
}


export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<MessageResponse> {
  return apiRequest(
    "/api/users/me/password",
    {
      method: "PATCH",

      headers: {
        ...authHeaders(),
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        current_password:
          currentPassword,

        new_password:
          newPassword,
      }),
    }
  );
}