"use client";

import { useEffect, useState } from "react";
import { scheduleLockService, ScheduleLockEntity } from "@/services/schedule-lock.service";
import { courtService } from "@/services/court.service";
import { Court } from "@/types/court.type";
import { toast } from "sonner";
import { Plus, Trash2, CalendarX2, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManagerSchedulePage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourtId, setSelectedCourtId] = useState<number | "">("");
  const [locks, setLocks] = useState<ScheduleLockEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    lockDate: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  useEffect(() => {
    fetchCourts();
  }, []);

  useEffect(() => {
    if (selectedCourtId !== "") {
      fetchLocks(selectedCourtId);
    } else {
      setLocks([]);
    }
  }, [selectedCourtId]);

  const fetchCourts = async () => {
    try {
      const data = await courtService.getCourts({ page: 0, size: 100 });
      setCourts(data.content);
      if (data.content.length > 0) {
        setSelectedCourtId(data.content[0].id);
      }
    } catch {
      toast.error("Không thể tải danh sách sân");
    }
  };

  const fetchLocks = async (courtId: number) => {
    try {
      setIsLoading(true);
      const data = await scheduleLockService.getManagerLocks(courtId, 0, 100);
      setLocks(data.content);
    } catch {
      toast.error("Không thể tải danh sách lịch khóa");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    if (!selectedCourtId) {
      toast.error("Vui lòng chọn sân trước khi thêm khóa");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    setFormData({ lockDate: today, startTime: "08:00", endTime: "10:00", reason: "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn mở khóa khoảng thời gian này?")) return;
    try {
      await scheduleLockService.deleteLock(id);
      toast.success("Đã mở khóa thành công");
      fetchLocks(Number(selectedCourtId));
    } catch {
      toast.error("Không thể mở khóa");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await scheduleLockService.createLock({
        courtId: Number(selectedCourtId),
        ...formData
      });
      toast.success("Khóa sân thành công");
      setIsModalOpen(false);
      fetchLocks(Number(selectedCourtId));
    } catch {
      toast.error("Không thể khóa sân. Có thể đã có lịch đặt trong thời gian này.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lịch Bận / Khóa Sân</h1>
          <p className="text-sm text-slate-500 mt-1">Khóa sân bảo trì hoặc tổ chức giải đấu, sự kiện</p>
        </div>
        <div className="flex gap-4 items-center">
          <select 
            value={selectedCourtId} 
            onChange={(e) => setSelectedCourtId(Number(e.target.value))}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="" disabled>Chọn sân...</option>
            {courts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Button onClick={openAddModal} className="font-semibold shadow-md">
            <Plus className="w-5 h-5 mr-2" /> Khóa giờ mới
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 border-4 border-primary border-r-transparent rounded-full animate-spin" />
          </div>
        ) : locks.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <CalendarX2 className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Sân này hiện không có lịch khóa nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Sân</th>
                  <th className="px-6 py-4 font-semibold">Ngày khóa</th>
                  <th className="px-6 py-4 font-semibold">Thời gian</th>
                  <th className="px-6 py-4 font-semibold">Lý do</th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {locks.map((lock) => (
                  <tr key={lock.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {lock.courtName}
                    </td>
                    <td className="px-6 py-4 text-primary font-medium">
                      {new Date(lock.lockDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md w-fit font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {lock.startTime.slice(0,5)} - {lock.endTime.slice(0,5)}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate">
                      {lock.reason || <span className="text-slate-400 italic">Không có lý do</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(lock.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4">Khóa khoảng thời gian</h2>
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-xl text-sm border border-amber-100 flex items-start gap-2">
              <CalendarX2 className="w-4 h-4 mt-0.5 shrink-0" />
              <p>Hệ thống sẽ từ chối thêm mới lịch khóa nếu khung giờ này đã có đơn đặt sân từ trước. Khách hàng cũng sẽ không thể đặt vào giờ này.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ngày khóa</label>
                <input required type="date" value={formData.lockDate} onChange={e => setFormData({ ...formData, lockDate: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giờ bắt đầu</label>
                  <input required type="time" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giờ kết thúc</label>
                  <input required type="time" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lý do (Tùy chọn)</label>
                <textarea rows={3} value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" placeholder="Bảo trì đèn, tổ chức giải đấu nội bộ..." />
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Xác nhận Khóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
