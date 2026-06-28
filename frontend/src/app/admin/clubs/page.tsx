"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { Search, Building2, CheckCircle, XCircle } from "lucide-react";

interface ClubItem {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status: string;
}

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get("/clubs") as any;
        setClubs(res.data ?? []);
      } catch {
        toast.error("Không thể tải danh sách câu lạc bộ. API /clubs chưa được tạo.");
        setClubs([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Câu lạc bộ</h1>
          <p className="text-slate-400 text-sm mt-1">Tất cả cơ sở thể thao trên nền tảng</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc địa chỉ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <span className="text-sm text-slate-400">{filtered.length} câu lạc bộ</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><div className="h-7 w-7 border-4 border-primary border-r-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Building2 className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Không tìm thấy câu lạc bộ nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {filtered.map((club) => (
              <div key={club.id} className="bg-slate-900/40 border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{club.name}</p>
                      <p className="text-xs text-slate-400">{club.address}</p>
                    </div>
                  </div>
                  {club.status === "ACTIVE" ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-900/20 px-2.5 py-1 rounded-full">
                      <CheckCircle className="h-3 w-3" /> Hoạt động
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-900/20 px-2.5 py-1 rounded-full">
                      <XCircle className="h-3 w-3" /> Đã khóa
                    </span>
                  )}
                </div>
                <div className="flex gap-4 text-xs text-slate-500 mt-2">
                  {club.phone && <span>📞 {club.phone}</span>}
                  {club.email && <span>✉️ {club.email}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
