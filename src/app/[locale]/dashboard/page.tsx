"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResolutionStatusBadge } from "@/components/resolution-status-badge";
import { localizedField } from "@/lib/locale-fields";

type ResolutionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "RECOMMENDED"
  | "NOT_RECOMMENDED"
  | "UT_REVIEW"
  | "APPROVED"
  | "NOT_ADVANCED";

interface Resolution {
  id: string;
  displayNumber: string | null;
  title_en: string | null;
  title_es: string | null;
  status: ResolutionStatus;
  createdAt: string;
  petitioner?: { id: string; name: string; email: string };
  committee?: { id: string; name: string; abbreviation: string } | null;
}

const STATUS_ORDER: ResolutionStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "RECOMMENDED",
  "NOT_RECOMMENDED",
  "UT_REVIEW",
  "APPROVED",
  "NOT_ADVANCED",
  "DRAFT",
];

export default function DashboardPage() {
  const locale = useLocale();
  const t = useTranslations();
  const { data: session } = useSession();
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loading, setLoading] = useState(true);

  const role = (session?.user as { role?: string })?.role;

  useEffect(() => {
    fetch("/api/resolutions")
      .then((r) => r.json())
      .then((data) => setResolutions(Array.isArray(data) ? data : data.resolutions || []))
      .finally(() => setLoading(false));
  }, []);

  const statusCount = (s: ResolutionStatus) =>
    resolutions.filter((r) => r.status === s).length;

  function ResolutionRow({ res }: { res: Resolution }) {
    return (
      <Link
        href={`/${locale}/resolutions/${res.id}`}
        className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">
              {res.displayNumber || t("status.DRAFT")}
            </span>
            <span className="font-medium">
              {localizedField(res, "title", locale)}
            </span>
          </div>
          {res.petitioner && (
            <span className="text-sm text-muted-foreground">
              {res.petitioner.name}
            </span>
          )}
        </div>
        <ResolutionStatusBadge status={res.status as never} />
      </Link>
    );
  }

  if (loading) {
    return <p className="text-muted-foreground">{t("common.loading")}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t("dashboard.welcome", { name: session?.user?.name || "" })}
        </h1>
        <Link href={`/${locale}/resolutions/new`}>
          <Button>{t("resolution.createNew")}</Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.total")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{resolutions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.draft")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCount("DRAFT")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.inProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {statusCount("SUBMITTED") +
                statusCount("UNDER_REVIEW") +
                statusCount("RECOMMENDED") +
                statusCount("NOT_RECOMMENDED") +
                statusCount("UT_REVIEW")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.completed")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {statusCount("APPROVED") + statusCount("NOT_ADVANCED")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-based content */}
      {role === "PETITIONER" && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            {t("dashboard.yourResolutions")}
          </h2>
          {resolutions.length === 0 ? (
            <p className="text-muted-foreground">{t("resolution.noResolutions")}</p>
          ) : (
            <div className="space-y-2">
              {resolutions.map((res) => (
                <ResolutionRow key={res.id} res={res} />
              ))}
            </div>
          )}
        </div>
      )}

      {role === "COMMITTEE_CHAIR" && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            {t("dashboard.pendingReview")}
          </h2>
          {(() => {
            const pending = resolutions.filter((r) => r.status === "UNDER_REVIEW");
            return pending.length === 0 ? (
              <p className="text-muted-foreground">{t("common.noResults")}</p>
            ) : (
              <div className="space-y-2">
                {pending.map((res) => (
                  <ResolutionRow key={res.id} res={res} />
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {(role === "SECRETARY" || role === "ADMIN") && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            {t("dashboard.pipeline")}
          </h2>
          {resolutions.length === 0 ? (
            <p className="text-muted-foreground">{t("common.noResults")}</p>
          ) : (
            <div className="space-y-6">
              {STATUS_ORDER.filter((s) => statusCount(s) > 0).map((status) => (
                <div key={status}>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    {t(`status.${status}`)} ({statusCount(status)})
                  </h3>
                  <div className="space-y-2">
                    {resolutions
                      .filter((r) => r.status === status)
                      .map((res) => (
                        <ResolutionRow key={res.id} res={res} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
