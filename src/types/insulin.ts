export type StockAlertLevel =
  | "ok"
  | "low"
  | "critical"
  | "unknown";


export type ContainerAlertLevel =
  | "ok"
  | "expiring_soon"
  | "expired";


export type StockExpirationStatus =
  | "NO_DATA"
  | "NO_PROJECTION"
  | "SAFE"
  | "SAME_DAY"
  | "AT_RISK"
  | "EXPIRED";


export type Insulin = {
  id: number;

  name: string;

  concentration_units_per_ml:
    string;

  container_volume_ml:
    string;

  open_validity_days:
    number;

  active:
    boolean;

  created_at:
    string;
};


export type InsulinSummary = {
  insulin_id:
    number;

  insulin_name:
    string;

  current_stock_units:
    string;

  average_daily_consumption_units:
    string | null;

  history_days_used:
    number;

  estimated_days_remaining:
    string | null;

  estimated_end_date:
    string | null;

  projection_available:
    boolean;

  stock_alert_level:
    StockAlertLevel;

  container_alert_level:
    ContainerAlertLevel;

  container_alert_days:
    number | null;

  next_expiration_date:
    string | null;

  days_until_expiration:
    number | null;

  expiring_stock_units:
    string | null;

  estimated_expiring_stock_end_date:
    string | null;

  expiration_status:
    StockExpirationStatus;
};


export type InsulinWithSummary = {
  insulin:
    Insulin;

  summary:
    InsulinSummary;
};


export type CreateInsulinPayload = {
  name:
    string;

  concentration_units_per_ml:
    number;

  container_volume_ml:
    number;

  open_validity_days:
    number;
};


export type UpdateInsulinPayload =
  CreateInsulinPayload & {
    active:
      boolean;
  };