export type ContainerStatus =
  | "SEALED"
  | "OPEN"
  | "EMPTY"
  | "DISCARDED";

export type InsulinContainer = {
  id: number;
  insulin_id: number;
  status: ContainerStatus;
  initial_units: string;
  remaining_units: string;
  opened_at: string | null;
  created_at: string;
};
