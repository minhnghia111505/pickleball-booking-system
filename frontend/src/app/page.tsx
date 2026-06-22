import Link from "next/link";
import { MainContainer } from "@/components/layout/main-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/10 py-20 sm:py-32">
        <MainContainer className="relative z-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Sân chơi Pickleball <br className="hidden sm:block" />
            <span className="text-primary">Đẳng cấp & Chuyên nghiệp</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Hệ thống đặt sân Pickleball nhanh chóng, tiện lợi. Trải nghiệm mặt sân chuẩn quốc tế, không gian thoáng đãng và dịch vụ trọn gói.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href={ROUTES.COURTS}>Đặt sân ngay</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
              <Link href="/about">Tìm hiểu thêm</Link>
            </Button>
          </div>
        </MainContainer>
        
        {/* Background decorative elements */}
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-green-300 opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </section>

      {/* Intro Features */}
      <section className="py-24">
        <MainContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tại sao chọn chúng tôi?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Chúng tôi cam kết mang lại trải nghiệm tuyệt vời nhất cho mỗi trận đấu của bạn.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {[
                {
                  name: 'Sân đạt chuẩn',
                  description: '100% mặt sân đạt tiêu chuẩn, có độ bám tốt, kích thước chính xác cho cả đánh đơn và đôi.',
                },
                {
                  name: 'Đặt sân siêu tốc',
                  description: 'Chỉ với 3 bước đơn giản, bạn có thể xem lịch trống và giữ sân ngay lập tức trên hệ thống.',
                },
                {
                  name: 'Dịch vụ đi kèm',
                  description: 'Cung cấp đầy đủ các dịch vụ từ cho thuê vợt, bóng đến nước uống giải khát.',
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col rounded-2xl bg-muted/40 p-8 shadow-sm ring-1 ring-border/50">
                  <dt className="text-xl font-semibold leading-7 text-foreground">
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </MainContainer>
      </section>
    </div>
  );
}
