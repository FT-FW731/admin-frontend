import { safeGetItem, safeRemoveItem, safeSetItem } from "./storage";

export const tokenControl = (
  action: "set" | "get" | "remove",
  token?: string
): string | void => {
  if (action === "set" && token) {
    safeSetItem("token", token);
  } else if (action === "get") {
    return safeGetItem("token") ?? undefined;
  } else if (action === "remove") {
    safeRemoveItem("token");
  }
};

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout> | null;
  function debounced(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  }
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };
  return debounced;
}

export function formatNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "0";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat("en-IN").format(num);
}
