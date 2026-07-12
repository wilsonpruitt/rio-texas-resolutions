"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";

export function Nav() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const { data: session } = useSession();

  const user = session?.user;
  const isAuth = !!user;
  const isAdmin = (user as { role?: string } | undefined)?.role === "ADMIN";

  return (
    <header className="border-b bg-background">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="text-lg font-semibold">
          {t("home")}
        </Link>

        <div className="flex items-center gap-4">
          {isAuth && (
            <>
              <Link
                href={`/${locale}/dashboard`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t("dashboard")}
              </Link>
              <Link
                href={`/${locale}/resolutions`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t("resolutions")}
              </Link>
              {isAdmin && (
                <Link
                  href={`/${locale}/admin/users`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("users")}
                </Link>
              )}
            </>
          )}

          <Link
            href={`/${locale}/guide`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("guide")}
          </Link>

          <LanguageSwitcher />

          {isAuth ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
              >
                {t("signOut")}
              </Button>
            </div>
          ) : (
            <Link href={`/${locale}/login`}>
              <Button variant="ghost" size="sm">
                {t("signIn")}
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
