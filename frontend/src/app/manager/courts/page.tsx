"use client";

import { useEffect, useState } from "react";
import { courtService } from "@/services/court.service";
import { Court } from "@/types/court.type";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ManagerCourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Court>>({
    name: "",
    pricePerHour: 0,
    status: "ACTIVE",
  });

  const fetchCourts = async () => {
    try {
      setIsLoading(true);
      const data = await courtService.getCourts({ page: 0, size: 100 });
      setCourts(data.content);
    } catch (error) {
      toast.error("Không thể tải danh sách sân");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", pricePerHour: 0, status: "ACTIVE" });
    setIsModalOpen(true);
  };

  const openEditModal = (court: Court) => {
    setIsEditMode(true);
    setFormData({ ...court });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa sân này?")) return;
    try {
      await courtService.deleteCourt(id);
      toast.success("Xóa sân thành công");
      fetchCourts();
    } catch {
      toast.error("Không thể xóa sân");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && formData.id) {
        await courtService.updateCourt(formData.id, formData);
        toast.success("Cập nhật thành công");
      } else {
        await courtService.createCourt(formData);
        toast.success("Thêm mới thành công");
      }
      setIsModalOpen(false);
      fetchCourts();
    } catch {
      toast.error(isEditMode ? "Lỗi khi cập nhật" : "Lỗi khi thêm mới");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Quản lý Sân</h2>
          <p className="text-sm text-slate-500">Danh sách các sân thuộc cơ sở của bạn</p>
        </div>
        <Button className="font-semibold shadow-md" onClick={openAddModal}>
          <Plus className="w-5 h-5 mr-2" /> Thêm sân mới
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tên sân..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-950 dark:border-slate-700"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          </div>
        ) : courts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>Chưa có sân nào được tạo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tên Sân</th>
                  <th className="px-6 py-4 font-semibold">Giá / Giờ</th>
                  <th className="px-6 py-4 font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {courts.map((court) => (
                  <tr key={court.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {court.name}
                    </td>
                    <td className="px-6 py-4">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(court.pricePerHour)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        court.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {court.status === 'ACTIVE' ? 'Hoạt động' : 'Bảo trì'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(court)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(court.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2">
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
            <h2 className="text-xl font-bold mb-4">{isEditMode ? "Cập nhật sân" : "Thêm sân mới"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên sân</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" placeholder="VD: Sân Master 1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giá mỗi giờ (VNĐ)</label>
                <input required type="number" min={0} value={formData.pricePerHour} onChange={e => setFormData({ ...formData, pricePerHour: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" />
              </div>
              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as "ACTIVE" | "MAINTENANCE" | "INACTIVE" })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                  {isEditMode ? "Lưu" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
