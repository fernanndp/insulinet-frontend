import {
  apiRequest,
  authHeaders,
} from "./api";
import type {
  BatchDosePayload,
  DosePayload,
  Movement,
} from "../types/movement";

export async function getHistory(
  insulinId: number
): Promise<Movement[]> {
  return apiRequest(`/api/insulins/${insulinId}/history`, {
    headers: authHeaders(),
  });
}

export async function registerDose(
  insulinId: number,
  payload: DosePayload
): Promise<void> {
  await apiRequest(`/api/insulins/${insulinId}/doses`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function registerDoseBatch(
  insulinId: number,
  doses: BatchDosePayload[]
): Promise<void> {
  await apiRequest(`/api/insulins/${insulinId}/dose-batches`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doses }),
  });
}

export async function updateDose(
  insulinId: number,
  doseId: number,
  payload: DosePayload
): Promise<void> {
  await apiRequest(`/api/insulins/${insulinId}/doses/${doseId}`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
