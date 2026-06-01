const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Pickleball Booking";

export const env = {
  apiUrl: apiUrl.replace(/\/$/, ""),
  appName,
  isDev: process.env.NODE_ENV === "development",
} as const;
