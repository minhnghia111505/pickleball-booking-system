import { MainContainer } from "@/components/layout/main-container";
import { env } from "@/config/env";

export default function HomePage() {
  return (
    <MainContainer className="py-12 sm:py-16 lg:py-20">
      <section className="mx-auto max-w-2xl text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Pickleball Booking
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frontend scaffold sẵn sàng
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Cấu trúc Next.js App Router, TailwindCSS, Axios, React Query và
          Zustand đã được thiết lập. Business UI sẽ được bổ sung trong các
          module tiếp theo.
        </p>
        <dl className="mt-8 grid gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-foreground">API</dt>
            <dd className="mt-1 break-all text-muted-foreground">{env.apiUrl}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Stack</dt>
            <dd className="mt-1 text-muted-foreground">
              Next.js · Tailwind · Axios · TanStack Query · Zustand
            </dd>
          </div>
        </dl>
      </section>
    </MainContainer>
  );
}
