import { apiClient } from "@/lib/axios";

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
}

export const userService = {
  getProfile: async () => {
    const res = await apiClient.get<{ data: UserProfile }>("/users/profile") as unknown as { data: UserProfile };
    return res.data;
  },

  updateProfile: async (data: { fullName: string; phone?: string }) => {
    const res = await apiClient.put<{ data: UserProfile }>("/users/profile", data) as unknown as { data: UserProfile };
    return res.data;
  },

  changePassword: async (data: any) => {
    const res = await apiClient.put("/users/change-password", data);
    return res;
  },
};
