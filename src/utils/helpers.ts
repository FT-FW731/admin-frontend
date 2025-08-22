export const tokenControl = (
  action: "set" | "get" | "remove",
  token?: string
): string | void => {
  if (action === "set" && token) {
    localStorage.setItem("token", token);
  } else if (action === "get") {
    return localStorage.getItem("token");
  } else if (action === "remove") {
    localStorage.removeItem("token");
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
