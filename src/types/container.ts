export type ContainerStatus =
  | "SEALED"
  | "OPEN"
  | "EMPTY"
  | "DISCARDED";

export type ContainerExpirationStatus =
  | "not_applicable"
  | "ok"
  | "expiring_soon"
  | "expired";

export type InsulinContainer = {
  id: number;
  insulin_id: number;
  status: ContainerStatus;
  initial_units: string;
  remaining_units: string;
  opened_at: string | null;
  created_at: string;
  expires_at: string | null;
  days_until_expiration: number | null;
  expiration_status: ContainerExpirationStatus;
};
