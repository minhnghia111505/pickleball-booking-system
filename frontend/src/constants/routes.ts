export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  COURTS: "/courts",
  BOOKINGS: "/bookings",
  PROFILE: "/profile",
  ADMIN: {
    ROOT: "/admin",
    COURTS: "/admin/courts",
    STATISTICS: "/admin/statistics",
    SCHEDULE: "/admin/schedule",
  },
} as const;
