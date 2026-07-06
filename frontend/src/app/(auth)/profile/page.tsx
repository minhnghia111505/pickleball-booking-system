"use client";

import { useEffect, useState } from "react";
import { MainContainer } from "@/components/layout/main-container";
import { useAuthStore } from "@/stores/auth.store";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Key, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        phoneNumber: user.phone || "",
      });
      // Fetch fresh data from backend
      userService.getProfile().then((data) => {
        setProfileData({
          fullName: data.fullName || "",
          phoneNumber: data.phone || "",
        });
        updateUser({
          ...user,
          fullName: data.fullName,
          phone: data.phone,
        });
      }).catch(console.error);
    }
  }, [user?.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const updated = await userService.updateProfile({
        fullName: profileData.fullName,
        phone: profileData.phoneNumber,
      });
      toast.success("Cập nhật thông tin thành công");
      // Update local store
      updateUser({
        ...user!,
        fullName: updated.fullName,
        phone: updated.phone,
      });
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      setIsSubmitting(true);
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error?.message || "Đổi mật khẩu thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <MainContainer className="py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">Quản lý thông tin và bảo mật tài khoản của bạn</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "profile" 
                ? "bg-primary text-primary-foreground font-medium" 
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <User className="h-5 w-5" /> Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "password" 
                ? "bg-primary text-primary-foreground font-medium" 
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Key className="h-5 w-5" /> Đổi mật khẩu
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Cập nhật tên hiển thị và số điện thoại liên lạc.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="bg-slate-50 text-slate-500" />
                    <p className="text-xs text-slate-500">Email dùng để đăng nhập và không thể thay đổi.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input 
                      id="fullName" 
                      value={profileData.fullName} 
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input 
                      id="phone" 
                      value={profileData.phoneNumber} 
                      onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})} 
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" /> Lưu thay đổi
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "password" && (
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>Đảm bảo tài khoản của bạn được bảo mật với mật khẩu mạnh.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      value={passwordData.currentPassword} 
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={passwordData.newPassword} 
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={passwordData.confirmPassword} 
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                      required 
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" /> Cập nhật mật khẩu
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainContainer>
  );
}
