"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const t = useTranslations("public");
  const locale = useLocale();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center gap-12 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("hero")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          {t("heroSubtitle")}
        </p>
      </div>

      <div className="flex gap-4">
        {session?.user ? (
          <>
            <Link href={`/${locale}/dashboard`}>
              <Button size="lg">Go to Dashboard</Button>
            </Link>
            <Link href={`/${locale}/submit`}>
              <Button size="lg" variant="outline">Submit a Resolution</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href={`/${locale}/submit`}>
              <Button size="lg">Submit a Resolution</Button>
            </Link>
            <Link href={`/${locale}/login`}>
              <Button size="lg" variant="outline">{t("signInToSubmit")}</Button>
            </Link>
          </>
        )}
      </div>

      <div className="mt-8 w-full max-w-3xl">
        <h2 className="mb-8 text-center text-2xl font-semibold">
          {t("howItWorks")}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {(["step1", "step2", "step3", "step4"] as const).map(
            (step, index) => (
              <div
                key={step}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mb-2 font-semibold">{t(step)}</h3>
                <p className="text-sm text-muted-foreground">
                  {t(`${step}Desc`)}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
