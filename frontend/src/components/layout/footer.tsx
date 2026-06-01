import { siteConfig } from "@/config/site";
import { MainContainer } from "@/components/layout/main-container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <MainContainer>
        <div className="flex flex-col gap-2 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm">{siteConfig.description}</p>
        </div>
      </MainContainer>
    </footer>
  );
}
