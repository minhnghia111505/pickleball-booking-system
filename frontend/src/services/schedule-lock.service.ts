import { apiClient } from "@/lib/axios";

export interface ScheduleLockEntity {
  id: number;
  courtId: number;
  courtName: string;
  lockDate: string;
  startTime: string;
  endTime: string;
  lockType: "MAINTENANCE";
  reason: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const scheduleLockService = {
  getManagerLocks: async (courtId: number, page = 0, size = 100) => {
    const res = await apiClient.get<{ data: PageResponse<ScheduleLockEntity> }>(`/manager/schedules/courts/${courtId}/locks`, {
      params: { page, size },
    }) as unknown as { data: PageResponse<ScheduleLockEntity> };
    return res.data;
  },

  createLock: async (data: { courtId: number; lockDate: string; startTime: string; endTime: string; reason: string }) => {
    const res = await apiClient.post<{ data: ScheduleLockEntity }>("/manager/schedules/locks", data) as unknown as { data: ScheduleLockEntity };
    return res.data;
  },

  deleteLock: async (lockId: number) => {
    await apiClient.delete(`/manager/schedules/locks/${lockId}`);
  },
};
