import { apiClient } from "@/lib/axios";

export interface StaffEntity {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";
  avatarUrl?: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const staffService = {
  getManagerStaffs: async (page = 0, size = 20) => {
    const res = await apiClient.get<{ data: PageResponse<StaffEntity> }>("/manager/staffs", {
      params: { page, size },
    }) as unknown as { data: PageResponse<StaffEntity> };
    return res.data;
  },

  createStaff: async (data: { email: string; fullName: string; phone: string }) => {
    const res = await apiClient.post<{ data: StaffEntity }>("/manager/staffs", data) as unknown as { data: StaffEntity };
    return res.data;
  },

  updateStaff: async (id: number, data: { fullName: string; phone: string; status: string }) => {
    const res = await apiClient.put<{ data: StaffEntity }>(`/manager/staffs/${id}`, data) as unknown as { data: StaffEntity };
    return res.data;
  },
};
