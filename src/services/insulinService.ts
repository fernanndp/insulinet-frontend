import {
  apiRequest,
  authHeaders,
} from "./api";
import type {
  CreateInsulinPayload,
  Insulin,
  InsulinSummary,
  UpdateInsulinPayload,
} from "../types/insulin";

export async function listInsulins(): Promise<Insulin[]> {
  return apiRequest("/api/insulins", {
    headers: authHeaders(),
  });
}

export async function getInsulinSummary(
  insulinId: number
): Promise<InsulinSummary> {
  return apiRequest(`/api/insulins/${insulinId}/summary`, {
    headers: authHeaders(),
  });
}

export async function createInsulin(
  payload: CreateInsulinPayload
): Promise<void> {
  await apiRequest("/api/insulins", {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateInsulin(
  insulinId: number,
  payload: UpdateInsulinPayload
): Promise<void> {
  await apiRequest(`/api/insulins/${insulinId}`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
