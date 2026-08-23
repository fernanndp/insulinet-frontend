export function formatUnits(value: string): string {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "0";
  }

  return numericValue.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  });
}

export function formatDays(value: string): string {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "—";
  }

  return numericValue.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  });
}

export function formatEndDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("pt-BR");
}
