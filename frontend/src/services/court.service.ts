import { apiClient } from "@/lib/axios";
import { Court, PageResponse } from "@/types/court.type";

export const courtService = {
  getCourts: async (params?: { search?: string; clubId?: number; page?: number; size?: number }) => {
    const res = await apiClient.get<{ data: PageResponse<Court> }>("/courts", {
      params,
    }) as unknown as { data: PageResponse<Court> };
    return res.data;
  },

  getCourtById: async (id: number) => {
    const res = await apiClient.get<{ data: Court }>(`/courts/${id}`) as unknown as { data: Court };
    return res.data;
  },

  createCourt: async (data: Partial<Court>) => {
    const res = await apiClient.post<{ data: Court }>("/courts", data) as unknown as { data: Court };
    return res.data;
  },

  updateCourt: async (id: number, data: Partial<Court>) => {
    const res = await apiClient.put<{ data: Court }>(`/courts/${id}`, data) as unknown as { data: Court };
    return res.data;
  },

  deleteCourt: async (id: number) => {
    await apiClient.delete(`/courts/${id}`);
  },
};
