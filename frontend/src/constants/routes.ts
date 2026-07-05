export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  COURTS: "/courts",
  MAP: "/map",
  BOOKINGS: "/bookings",
  FAVORITES: "/favorites",
  PROFILE: "/profile",

  STAFF: {
    ROOT: "/staff",
    DASHBOARD: "/staff/dashboard",
    BOOKINGS: "/staff/bookings",
  },

  MANAGER: {
    ROOT: "/manager",
    DASHBOARD: "/manager/dashboard",
    COURTS: "/manager/courts",
    BOOKINGS: "/manager/bookings",
  },

  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CLUBS: "/admin/clubs",
    COURTS: "/admin/courts",
    STATISTICS: "/admin/statistics",
  },
} as const;

/** Returns the correct home/dashboard URL for a given role */
export function getRoleHomePath(role: string): string {
  switch (role) {
    case "ROLE_STAFF":
      return ROUTES.STAFF.DASHBOARD;
    case "ROLE_MANAGER":
      return ROUTES.MANAGER.DASHBOARD;
    case "ROLE_SUPER_ADMIN":
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.HOME;
  }
}
