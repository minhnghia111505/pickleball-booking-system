"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { Search, Shield, User, Activity } from "lucide-react";

interface UserItem {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  status: string;
}

const roleLabels: Record<string, { label: string; className: string }> = {
  ROLE_USER: { label: "Khách hàng", className: "bg-blue-100 text-blue-700" },
  ROLE_STAFF: { label: "Nhân viên", className: "bg-purple-100 text-purple-700" },
  ROLE_MANAGER: { label: "Chủ sân", className: "bg-amber-100 text-amber-700" },
  ROLE_SUPER_ADMIN: { label: "Super Admin", className: "bg-red-100 text-red-700" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get("/users/all") as any;
        setUsers(res.data ?? []);
      } catch {
        toast.error("Không thể tải danh sách người dùng. API /users/all chưa được tạo.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Quản lý Người dùng</h1>
        <p className="text-slate-400 text-sm mt-1">Tất cả tài khoản trên hệ thống</p>
      </div>

      <div className="bg-slate-800/50 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <span className="text-sm text-slate-400">{filtered.length} người dùng</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><div className="h-7 w-7 border-4 border-primary border-r-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <User className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Không tìm thấy người dùng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/30 text-xs uppercase text-slate-500 border-b border-white/5">
                <tr>
                  {["ID", "Họ tên", "Email", "Điện thoại", "Vai trò", "Trạng thái"].map((h) => (
                    <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const role = roleLabels[u.role] ?? { label: u.role, className: "bg-slate-100 text-slate-600" };
                  return (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 font-mono text-slate-500 text-xs">#{u.id}</td>
                      <td className="px-5 py-3 font-medium text-white">{u.fullName}</td>
                      <td className="px-5 py-3 text-slate-400">{u.email}</td>
                      <td className="px-5 py-3 text-slate-400">{u.phone ?? "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${role.className}`}>{role.label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.status === "ACTIVE" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"}`}>
                          {u.status === "ACTIVE" ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
