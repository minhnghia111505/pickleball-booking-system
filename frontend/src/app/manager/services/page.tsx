"use client";

import { useEffect, useState } from "react";
import { clubServiceService, ClubServiceEntity } from "@/services/club-service.service";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function ManagerServicesPage() {
  const [services, setServices] = useState<ClubServiceEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<ClubServiceEntity>>({
    name: "",
    type: "WATER",
    price: 0,
    imageUrl: "",
    status: "ACTIVE",
  });

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await clubServiceService.getManagerServices(0, 100);
      setServices(data.content);
    } catch {
      toast.error("Không thể tải dịch vụ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", type: "WATER", price: 0, imageUrl: "", status: "ACTIVE" });
    setIsModalOpen(true);
  };

  const openEditModal = (svc: ClubServiceEntity) => {
    setIsEditMode(true);
    setFormData({ ...svc, icon: svc.imageUrl }); // Map imageUrl to icon for the request if needed
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      await clubServiceService.deleteService(id);
      toast.success("Xóa thành công");
      fetchServices();
    } catch {
      toast.error("Không thể xóa");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // mapping icon field for backend request
      const payload = { ...formData, icon: formData.imageUrl };
      if (isEditMode && formData.id) {
        await clubServiceService.updateService(formData.id, payload);
        toast.success("Cập nhật thành công");
      } else {
        await clubServiceService.createService(payload);
        toast.success("Thêm mới thành công");
      }
      setIsModalOpen(false);
      fetchServices();
    } catch {
      toast.error(isEditMode ? "Lỗi khi cập nhật" : "Lỗi khi thêm mới");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dịch vụ đi kèm</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý nước uống, thuê vợt...</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm dịch vụ
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><div className="h-7 w-7 border-4 border-primary border-r-transparent rounded-full animate-spin" /></div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center text-slate-500">Chưa có dịch vụ nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-xs uppercase text-slate-500 border-b dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tên dịch vụ</th>
                  <th className="px-6 py-4 font-semibold">Loại</th>
                  <th className="px-6 py-4 font-semibold">Đơn giá</th>
                  <th className="px-6 py-4 font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{svc.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{svc.type === 'WATER' ? 'Nước uống' : svc.type === 'RENTAL_EQUIPMENT' ? 'Thuê đồ' : 'Khác'}</td>
                    <td className="px-6 py-4 text-primary font-semibold">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(svc.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        svc.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {svc.status === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(svc)} className="text-blue-500 hover:text-blue-700 p-2">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(svc.id)} className="text-red-500 hover:text-red-700 p-2">
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
            <h2 className="text-xl font-bold mb-4">{isEditMode ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên dịch vụ</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" placeholder="VD: Nước khoáng Lavie" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Loại</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                    <option value="WATER">Nước uống</option>
                    <option value="RENTAL_EQUIPMENT">Thuê đồ</option>
                    <option value="SNACK">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Đơn giá (VNĐ)</label>
                  <input required type="number" min={0} value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link Ảnh (Icon)</label>
                <input type="text" value={formData.imageUrl || ""} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" placeholder="https://..." />
              </div>
              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Tạm ngưng</option>
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
