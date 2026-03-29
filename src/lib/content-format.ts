export function formatLongDate(date: Date | null) {
  if (!date) {
    return "Draft"
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(date)
}

export function formatShortDate(date: Date | null) {
  if (!date) {
    return "Draft"
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
