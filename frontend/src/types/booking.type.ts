import { PageResponse } from "./common";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface BookingUserSummary {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface BookingCourtSummary {
  id: number;
  name: string;
  address: string;
}

export interface Booking {
  id: number;
  user: BookingUserSummary;
  court: BookingCourtSummary;
  bookingDate: string;
  startTime: string;
  endTime: string;
  bookingStatus: BookingStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourtScheduleSlot {
  bookingId: number | null;
  startTime: string;
  endTime: string;
  bookingStatus: BookingStatus | null;
}

export interface CourtSchedule {
  courtId: number;
  courtName: string;
  bookingDate: string;
  slots: CourtScheduleSlot[];
}

export interface CreateBookingRequest {
  courtId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  services?: { serviceId: number; quantity: number }[];
}
