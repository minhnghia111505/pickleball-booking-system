import { apiClient } from "@/lib/axios";

export interface ClubServiceEntity {
  id: number;
  name: string;
  type: string;
  price: number;
  icon?: string;
  imageUrl?: string;
  status: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const clubServiceService = {
  getManagerServices: async (page = 0, size = 20) => {
    const res = await apiClient.get<{ data: PageResponse<ClubServiceEntity> }>("/manager/services", {
      params: { page, size },
    }) as unknown as { data: PageResponse<ClubServiceEntity> };
    return res.data;
  },

  createService: async (data: Partial<ClubServiceEntity>) => {
    const res = await apiClient.post<{ data: ClubServiceEntity }>("/manager/services", data) as unknown as { data: ClubServiceEntity };
    return res.data;
  },

  updateService: async (id: number, data: Partial<ClubServiceEntity>) => {
    const res = await apiClient.put<{ data: ClubServiceEntity }>(`/manager/services/${id}`, data) as unknown as { data: ClubServiceEntity };
    return res.data;
  },

  deleteService: async (id: number) => {
    await apiClient.delete(`/manager/services/${id}`);
  },
};
