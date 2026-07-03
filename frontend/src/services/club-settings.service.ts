import { apiClient } from "@/lib/axios";

export interface ClubSettingsEntity {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  description: string | null;
  logoUrl: string | null;
  status: string;
}

export const clubSettingsService = {
  getSettings: async () => {
    const res = await apiClient.get<{ data: ClubSettingsEntity }>("/manager/club/settings") as unknown as { data: ClubSettingsEntity };
    return res.data;
  },

  updateSettings: async (data: {
    name: string;
    address: string;
    phone: string;
    email?: string;
    description?: string;
    logoUrl?: string;
  }) => {
    const res = await apiClient.put<{ data: ClubSettingsEntity }>("/manager/club/settings", data) as unknown as { data: ClubSettingsEntity };
    return res.data;
  },
};
