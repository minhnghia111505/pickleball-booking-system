"use client";

import { useEffect, useState } from "react";
import { staffService, StaffEntity } from "@/services/staff.service";
import { toast } from "sonner";
import { Plus, Edit, Lock, Unlock, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManagerStaffPage() {
  const [staffs, setStaffs] = useState<StaffEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<{
    id?: number;
    email: string;
    fullName: string;
    phone: string;
    status: string;
  }>({
    email: "",
    fullName: "",
    phone: "",
    status: "ACTIVE",
  });

  const fetchStaffs = async () => {
    try {
      setIsLoading(true);
      const data = await staffService.getManagerStaffs(0, 100);
      setStaffs(data.content);
    } catch {
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ email: "", fullName: "", phone: "", status: "ACTIVE" });
    setIsModalOpen(true);
  };

  const openEditModal = (staff: StaffEntity) => {
    setIsEditMode(true);
    setFormData({ ...staff });
    setIsModalOpen(true);
  };

  const toggleStatus = async (staff: StaffEntity) => {
    const newStatus = staff.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try {
      await staffService.updateStaff(staff.id, { 
        fullName: staff.fullName, 
        phone: staff.phone, 
        status: newStatus 
      });
      toast.success(newStatus === "ACTIVE" ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản");
      fetchStaffs();
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && formData.id) {
        await staffService.updateStaff(formData.id, {
          fullName: formData.fullName,
          phone: formData.phone,
          status: formData.status,
        });
        toast.success("Cập nhật thành công");
      } else {
        await staffService.createStaff({
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
        });
        toast.success("Thêm nhân viên thành công. Mật khẩu mặc định là 123456");
      }
      setIsModalOpen(false);
      fetchStaffs();
    } catch {
      toast.error(isEditMode ? "Lỗi khi cập nhật" : "Lỗi khi thêm mới (Email có thể đã tồn tại)");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý Nhân viên</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý tài khoản nhân viên (Staff) của cơ sở</p>
        </div>
        <Button onClick={openAddModal} className="font-semibold shadow-md">
          <Plus className="w-5 h-5 mr-2" /> Thêm nhân viên
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 border-4 border-primary border-r-transparent rounded-full animate-spin" />
          </div>
        ) : staffs.length === 0 ? (
          <div className="py-12 text-center text-slate-500">Chưa có nhân viên nào</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {staffs.map((staff) => (
              <div key={staff.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-shadow bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                      {staff.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{staff.fullName}</h3>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        staff.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {staff.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(staff)} className="text-slate-400 hover:text-blue-500 p-1 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleStatus(staff)} className={`p-1 transition-colors ${staff.status === "ACTIVE" ? "text-slate-400 hover:text-red-500" : "text-slate-400 hover:text-emerald-500"}`}>
                      {staff.status === "ACTIVE" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{staff.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Tham gia: {new Date(staff.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4">{isEditMode ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}</h2>
            {!isEditMode && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100">
                Mật khẩu đăng nhập mặc định cho nhân viên mới là <strong>123456</strong>.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Email đăng nhập</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" placeholder="staff@example.com" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Họ và Tên</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" placeholder="0987654321" />
              </div>
              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="BLOCKED">Đã khóa</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                  {isEditMode ? "Lưu thay đổi" : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
