import {
  apiRequest,
  authHeaders,
} from "./api";

import type {
  InsulinContainer,
} from "../types/container";


export async function listContainers(
  insulinId: number
): Promise<InsulinContainer[]> {
  return apiRequest(
    `/api/insulins/${insulinId}/containers`,
    {
      headers:
        authHeaders(),
    }
  );
}


export async function discardContainer(
  insulinId: number,
  containerId: number
): Promise<void> {
  await apiRequest(
    `/api/insulins/${insulinId}/containers/${containerId}/discard`,
    {
      method:
        "POST",

      headers:
        authHeaders(),
    }
  );
}


export async function updateContainersExpiration(
  insulinId: number,
  containerIds: number[],
  expirationDate: string
): Promise<InsulinContainer[]> {
  return apiRequest(
    `/api/insulins/${insulinId}/containers/expiration`,
    {
      method:
        "PATCH",

      headers: {
        ...authHeaders(),

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        container_ids:
          containerIds,

        expiration_date:
          expirationDate,
      }),
    }
  );
}