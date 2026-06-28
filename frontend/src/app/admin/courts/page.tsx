"use client";
import { courtService } from "@/services/court.service";
import { Court } from "@/types/court.type";
import { useEffect, useState } from "react";
import { Search, Activity, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminCourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    courtService.getCourts({ size: 200 }).then((d) => setCourts(d.content)).catch(() => toast.error("Lỗi tải sân")).finally(() => setIsLoading(false));
  }, []);

  const filtered = courts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Tất cả Sân</h1>
      <div className="bg-slate-800/50 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input type="text" placeholder="Tìm sân..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        {isLoading ? <div className="flex justify-center py-16"><div className="h-7 w-7 border-4 border-primary border-r-transparent rounded-full animate-spin" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/30 text-xs uppercase text-slate-500 border-b border-white/5">
                <tr>{["Tên sân", "Giá/giờ", "Trạng thái"].map(h => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-5 py-3 font-medium text-white">{c.name}</td>
                    <td className="px-5 py-3 text-primary font-semibold">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(c.pricePerHour)}</td>
                    <td className="px-5 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${c.status === "ACTIVE" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
