import { apiClient } from "@/lib/axios";
import { Court } from "@/types/court.type";

export const favoriteService = {
  getMyFavorites: async () => {
    const res = await apiClient.get<{ data: Court[] }>("/favorites") as unknown as { data: Court[] };
    return res.data;
  },

  addFavorite: async (courtId: number) => {
    const res = await apiClient.post(`/favorites/${courtId}`);
    return res;
  },

  removeFavorite: async (courtId: number) => {
    const res = await apiClient.delete(`/favorites/${courtId}`);
    return res;
  },
};
