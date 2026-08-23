export type Insulin = {
  id: number;
  name: string;
  concentration_units_per_ml: string;
  container_volume_ml: string;
  active: boolean;
  created_at: string;
};

export type InsulinSummary = {
  insulin_id: number;
  insulin_name: string;
  current_stock_units: string;
  average_daily_consumption_units: string | null;
  history_days_used: number;
  estimated_days_remaining: string | null;
  estimated_end_date: string | null;
  projection_available: boolean;
};

export type InsulinWithSummary = {
  insulin: Insulin;
  summary: InsulinSummary;
};

export type CreateInsulinPayload = {
  name: string;
  concentration_units_per_ml: number;
  container_volume_ml: number;
};

export type UpdateInsulinPayload = CreateInsulinPayload & {
  active: boolean;
};
