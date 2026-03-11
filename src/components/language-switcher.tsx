"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === "en" ? "es" : "en";
  const label = locale === "en" ? "Español" : "English";

  function switchLocale() {
    // Replace the locale segment in the pathname
    const segments = pathname.split("/");
    segments[1] = otherLocale;
    router.push(segments.join("/"));
  }

  return (
    <Button variant="ghost" size="sm" onClick={switchLocale}>
      {label}
    </Button>
  );
}
