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
