import {
  apiRequest,
  authHeaders,
} from "./api";

export async function addStock(
  insulinId: number,
  containers: number
): Promise<void> {
  await apiRequest(`/api/insulins/${insulinId}/stock`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ containers }),
  });
}

export async function adjustStock(
  insulinId: number,
  actualStockUnits: number,
  notes: string
): Promise<void> {
  await apiRequest(`/api/insulins/${insulinId}/adjustments`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      actual_stock_units: actualStockUnits,
      notes,
    }),
  });
}

export async function updateStockEntry(
  insulinId: number,
  movementId: number,
  units: number
): Promise<void> {
  await apiRequest(
    `/api/insulins/${insulinId}/stock/${movementId}`,
    {
      method: "PATCH",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ units }),
    }
  );
}
