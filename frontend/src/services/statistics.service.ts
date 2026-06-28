import { apiClient } from "@/lib/axios";

export interface DashboardStatistics {
  startDate: string;
  endDate: string;
  periodDays: number;
  summary: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
  };
  bookingsByStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  revenueTrend: {
    date: string;
    amount: number;
  }[];
  topCourts: {
    courtId: number;
    courtName: string;
    bookingCount: number;
    percentage: number;
  }[];
  topUsers: {
    userId: number;
    fullName: string;
    email: string;
    bookingCount: number;
  }[];
}

export const statisticsService = {
  getManagerDashboard: async (days?: number) => {
    const res = await apiClient.get<{ data: DashboardStatistics }>("/manager/statistics/overview", {
      params: { days },
    }) as unknown as { data: DashboardStatistics };
    return res.data;
  },

  getAdminDashboard: async (days?: number) => {
    const res = await apiClient.get<{ data: DashboardStatistics }>("/statistics/dashboard", {
      params: { days },
    }) as unknown as { data: DashboardStatistics };
    return res.data;
  },
};
