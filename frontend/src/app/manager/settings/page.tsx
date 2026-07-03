"use client";

import { useEffect, useState } from "react";
import { clubSettingsService, ClubSettingsEntity } from "@/services/club-settings.service";
import { toast } from "sonner";
import { Save, Building2, MapPin, Phone, Mail, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManagerSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    logoUrl: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await clubSettingsService.getSettings();
      setFormData({
        name: data.name || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        description: data.description || "",
        logoUrl: data.logoUrl || "",
      });
    } catch {
      toast.error("Không thể tải thông tin cơ sở");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await clubSettingsService.updateSettings({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        description: formData.description,
        logoUrl: formData.logoUrl,
      });
      toast.success("Cập nhật thông tin thành công");
    } catch {
      toast.error("Không thể cập nhật thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="h-8 w-8 border-4 border-primary border-r-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cài đặt Cơ sở</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý thông tin chung và hình ảnh của Club</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Logo / Ảnh đại diện
              </h3>
              <p className="text-sm text-slate-500">
                Hình ảnh này sẽ được hiển thị công khai trên ứng dụng đặt sân để khách hàng nhận diện.
              </p>
              <div className="mt-4">
                <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs">Chưa có logo</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Đường dẫn ảnh (URL)</label>
                <input 
                  type="url" 
                  value={formData.logoUrl} 
                  onChange={e => setFormData({ ...formData, logoUrl: e.target.value })} 
                  className="w-full px-4 py-2 text-sm border rounded-xl dark:bg-slate-800 dark:border-slate-700" 
                  placeholder="https://example.com/logo.jpg" 
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                Thông tin chung
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" /> Tên cơ sở (Club) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={formData.address} 
                    onChange={e => setFormData({ ...formData, address: e.target.value })} 
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" /> Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                      className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" /> Email liên hệ
                    </label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" /> Giới thiệu / Mô tả ngắn
                  </label>
                  <textarea 
                    rows={4} 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" 
                    placeholder="Viết một đoạn ngắn giới thiệu về cơ sở của bạn..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button type="submit" disabled={isSaving} className="font-semibold shadow-md px-8 py-2.5 h-auto text-base">
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin" />
                  Đang lưu...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5" /> Lưu thay đổi
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
