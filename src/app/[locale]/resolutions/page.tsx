"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function ResolutionsPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resolutions")
      .then((r) => r.json())
      .then((data) => setResolutions(Array.isArray(data) ? data : data.resolutions || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? resolutions.filter((r) => {
        const q = search.toLowerCase();
        return (
          r.displayNumber?.toLowerCase().includes(q) ||
          r.title_en?.toLowerCase().includes(q) ||
          r.title_es?.toLowerCase().includes(q) ||
          r.petitioner?.name.toLowerCase().includes(q) ||
          r.committee?.name.toLowerCase().includes(q)
        );
      })
    : resolutions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("resolution.allResolutions")}</h1>
        <Link href={`/${locale}/resolutions/new`}>
          <Button>{t("resolution.createNew")}</Button>
        </Link>
      </div>

      <Input
        placeholder={t("common.search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {loading ? (
        <p className="text-muted-foreground">{t("common.loading")}</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">{t("common.noResults")}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((res) => (
            <Link
              key={res.id}
              href={`/${locale}/resolutions/${res.id}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">
                    {res.displayNumber || t("status.DRAFT")}
                  </span>
                  <span className="font-medium">
                    {localizedField(res, "title", locale)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  {res.petitioner && <span>{res.petitioner.name}</span>}
                  {res.committee && <span>{res.committee.name}</span>}
                </div>
              </div>
              <ResolutionStatusBadge status={res.status as never} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
