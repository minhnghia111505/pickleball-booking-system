import { apiClient } from "@/lib/axios";

export interface Club {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  logoUrl: string;
  status: string;
}

export interface ClubServiceItem {
  id: number;
  clubId: number;
  name: string;
  type: string;
  price: number;
  status: string;
  imageUrl: string;
}

export const clubService = {
  getClubs: async (params?: { search?: string; page?: number; size?: number }) => {
    const res = await apiClient.get("/clubs", { params });
    return res.data;
  },

  getClubById: async (id: number): Promise<Club> => {
    const res = await apiClient.get(`/clubs/${id}`);
    return res.data;
  },

  getClubServices: async (id: number): Promise<ClubServiceItem[]> => {
    const res = await apiClient.get(`/clubs/${id}/services`);
    return res.data;
  },
};
