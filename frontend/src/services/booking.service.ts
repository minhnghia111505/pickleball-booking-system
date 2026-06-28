import { apiClient } from "@/lib/axios";
import { PageResponse } from "@/types/common";
import { Booking, CourtSchedule, CreateBookingRequest } from "@/types/booking.type";

export const bookingService = {
  createBooking: async (request: CreateBookingRequest) => {
    const res = await apiClient.post<{ data: Booking }>("/bookings", request) as unknown as { data: Booking };
    return res.data;
  },

  getMyBookings: async (params?: { page?: number; size?: number }) => {
    const res = await apiClient.get<{ data: PageResponse<Booking> }>("/bookings/my-bookings", {
      params,
    }) as unknown as { data: PageResponse<Booking> };
    return res.data;
  },

  getClubBookings: async (params?: { page?: number; size?: number }) => {
    const res = await apiClient.get<{ data: PageResponse<Booking> }>("/bookings/club", {
      params,
    }) as unknown as { data: PageResponse<Booking> };
    return res.data;
  },

  cancelBooking: async (id: number) => {
    const res = await apiClient.delete<{ data: null }>(`/bookings/${id}`) as unknown as { data: null };
    return res.data;
  },

  payBooking: async (id: number) => {
    const res = await apiClient.post<{ data: null }>(`/bookings/${id}/pay`) as unknown as { data: null };
    return res.data;
  },

  getCourtSchedule: async (courtId: number, date: string) => {
    const res = await apiClient.get<{ data: CourtSchedule }>(`/bookings/court/${courtId}`, {
      params: { date },
    }) as unknown as { data: CourtSchedule };
    return res.data;
  },
};
