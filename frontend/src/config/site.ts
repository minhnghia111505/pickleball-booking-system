import { env } from "@/config/env";

export const siteConfig = {
  name: env.appName,
  description: "Hệ thống quản lý và đặt sân Pickleball",
  links: {
    apiDocs: `${env.apiUrl.replace(/\/api$/, "")}/api/swagger-ui.html`,
  },
} as const;
