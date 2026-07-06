"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { useAuthStore, type User } from "@/stores/auth.store";
import { useFavoritesStore } from "@/stores/favorites.store";
import { Button } from "@/components/ui/button";
import { getRoleHomePath, ROUTES } from "@/constants/routes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const syncFavorites = useFavoritesStore((state) => state.syncFavorites);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post("/auth/login", data) as any;
      const token = res.data.token;
      const user: User = {
        id: res.data.id,
        email: res.data.email,
        fullName: res.data.fullName,
        role: res.data.role,
      };
      
      setAuth(token, user);
      await syncFavorites();
      toast.success("Đăng nhập thành công!");
      router.push(getRoleHomePath(user.role));
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Tính năng đăng nhập bằng Google đang được phát triển.");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left Panel - Premium Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 z-0" />
        <div className="relative z-20 flex flex-col justify-end p-12 text-white h-full pb-24">
          <h1 className="text-4xl font-bold mb-4 leading-tight">Kết nối đam mê,<br/>Nâng tầm sức khỏe.</h1>
          <p className="text-lg text-slate-300 max-w-md">
            Hệ thống đặt sân Pickleball thông minh và tiện lợi nhất. Tham gia ngay hôm nay để trải nghiệm dịch vụ đẳng cấp.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Đăng nhập</h2>
            <p className="text-muted-foreground mt-2">
              Nhập email và mật khẩu để truy cập tài khoản của bạn
            </p>
          </div>

          <div className="space-y-6">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-12 text-base font-medium flex items-center justify-center gap-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Tiếp tục với Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground font-medium">
                  Hoặc đăng nhập bằng Email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-11 h-12 text-base"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-11 h-12 text-base"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base font-medium mt-2 shadow-md transition-all hover:shadow-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground pt-4">
            Chưa có tài khoản?{" "}
            <Link href={ROUTES.REGISTER} className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
