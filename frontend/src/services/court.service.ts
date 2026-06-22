import { apiClient } from "@/lib/axios";
import { Court, PageResponse } from "@/types/court.type";

export const courtService = {
  getCourts: async (params?: { search?: string; page?: number; size?: number }) => {
    const res = await apiClient.get<{ data: PageResponse<Court> }>("/courts", {
      params,
    }) as unknown as { data: PageResponse<Court> };
    return res.data;
  },

  getCourtById: async (id: number) => {
    const res = await apiClient.get<{ data: Court }>(`/courts/${id}`) as unknown as { data: Court };
    return res.data;
  },
};
