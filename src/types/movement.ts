export type MovementType =
  | "DOSE"
  | "STOCK_IN"
  | "ADJUSTMENT"
  | "DISCARD";

export type Movement = {
  id: number;
  movement_type: MovementType;
  quantity_units: string;
  occurred_at: string;
  occurred_time_known: boolean;
  notes: string | null;
};

export type DosePayload = {
  units: number;
  occurred_date: string | null;
  occurred_time: string | null;
  notes: string | null;
};

export type BatchDosePayload = {
  occurred_date: string;
  occurred_time: string | null;
  units: number;
  notes: string | null;
};
