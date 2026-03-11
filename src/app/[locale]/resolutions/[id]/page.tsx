"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResolutionStatusBadge } from "@/components/resolution-status-badge";
import { ResolutionPipeline } from "@/components/resolution-pipeline";
import { localizedField } from "@/lib/locale-fields";
import Link from "next/link";

type ResolutionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "RECOMMENDED"
  | "NOT_RECOMMENDED"
  | "UT_REVIEW"
  | "APPROVED"
  | "NOT_ADVANCED";

interface ResolutionDetail {
  id: string;
  displayNumber: string | null;
  title_en: string | null;
  title_es: string | null;
  text_en: string | null;
  text_es: string | null;
  rationale_en: string | null;
  rationale_es: string | null;
  status: ResolutionStatus;
  hasFinancialImplications: boolean;
  financeReferralNote: string | null;
  recommendationText: string | null;
  utDecisionText: string | null;
  finalExplanation: string | null;
  submittedAt: string | null;
  recommendedAt: string | null;
  utDecidedAt: string | null;
  createdAt: string;
  petitioner: { id: string; name: string; email: string; church: string | null };
  committee: { id: string; name: string; abbreviation: string } | null;
  conference: { id: string; name: string; year: number };
}

interface Committee {
  id: string;
  name: string;
  abbreviation: string;
}

export default function ResolutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();

  const [resolution, setResolution] = useState<ResolutionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // For assign action
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState("");

  // For recommend / ut-decision actions
  const [notes, setNotes] = useState("");

  const role = (session?.user as { role?: string })?.role;
  const userId = (session?.user as { id?: string })?.id;

  useEffect(() => {
    fetch(`/api/resolutions/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => setResolution(data))
      .catch(() => router.push(`/${locale}/resolutions`))
      .finally(() => setLoading(false));
  }, [id, locale, router]);

  // Load committees for SECRETARY/ADMIN when resolution is SUBMITTED
  useEffect(() => {
    if (
      resolution?.status === "SUBMITTED" &&
      (role === "SECRETARY" || role === "ADMIN")
    ) {
      fetch("/api/committees")
        .then((r) => r.json())
        .then((data) => setCommittees(data));
    }
  }, [resolution?.status, role]);

  async function handleSubmit() {
    if (!confirm(t("resolution.confirmSubmit"))) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/resolutions/${id}/submit`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setResolution((prev) => (prev ? { ...prev, ...data } : prev));
        toast.success(t("resolution.submitted"));
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAssign() {
    if (!selectedCommittee) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/resolutions/${id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ committeeId: selectedCommittee }),
      });
      if (res.ok) {
        const data = await res.json();
        setResolution((prev) => (prev ? { ...prev, ...data } : prev));
        toast.success(t("resolution.assigned"));
        // Re-fetch to get the committee relation populated
        const refetch = await fetch(`/api/resolutions/${id}`);
        if (refetch.ok) setResolution(await refetch.json());
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDismissFinancialFlag() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/resolutions/${id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dismissFinancialFlag: true }),
      });
      if (res.ok) {
        const refetch = await fetch(`/api/resolutions/${id}`);
        if (refetch.ok) setResolution(await refetch.json());
        toast.success(t("resolution.financialDismissed"));
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleFlagForFinance() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/resolutions/${id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hasFinancialImplications: true }),
      });
      if (res.ok) {
        const refetch = await fetch(`/api/resolutions/${id}`);
        if (refetch.ok) setResolution(await refetch.json());
        toast.success(t("resolution.financialFlagAdded"));
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRecommend(recommend: boolean) {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/resolutions/${id}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommend, notes: notes || undefined }),
      });
      if (res.ok) {
        const data = await res.json();
        setResolution((prev) => (prev ? { ...prev, ...data } : prev));
        toast.success(t("resolution.recommendationRecorded"));
        setNotes("");
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUTDecision(approve: boolean) {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/resolutions/${id}/ut-decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve, notes: notes || undefined }),
      });
      if (res.ok) {
        const data = await res.json();
        setResolution((prev) => (prev ? { ...prev, ...data } : prev));
        toast.success(
          approve ? t("resolution.approved") : t("resolution.terminated")
        );
        setNotes("");
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">{t("common.loading")}</p>;
  }
  if (!resolution) return null;

  const title = localizedField(resolution, "title", locale);
  const text = localizedField(resolution, "text", locale);
  const rationale = localizedField(resolution, "rationale", locale);
  const isPetitioner = userId === resolution.petitioner.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {resolution.displayNumber && (
            <span className="font-mono text-sm text-muted-foreground">
              {resolution.displayNumber}
            </span>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="mt-2">
            <ResolutionStatusBadge status={resolution.status as never} />
          </div>
        </div>
        <div className="flex gap-2">
          {isPetitioner && resolution.status === "DRAFT" && (
            <>
              <Link href={`/${locale}/resolutions/${id}/edit`}>
                <Button variant="outline">{t("common.edit")}</Button>
              </Link>
              <Button onClick={handleSubmit} disabled={actionLoading}>
                {t("resolution.submitResolution")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Pipeline tracker */}
      <Card>
        <CardContent className="pt-6 pb-4">
          <ResolutionPipeline
            status={resolution.status}
            submittedAt={resolution.submittedAt}
            recommendedAt={resolution.recommendedAt}
            utDecidedAt={resolution.utDecidedAt}
          />
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">
                {t("resolution.petitioner")}
              </dt>
              <dd>{resolution.petitioner.name}</dd>
            </div>
            {resolution.petitioner.church && (
              <div>
                <dt className="font-medium text-muted-foreground">
                  {t("resolution.church")}
                </dt>
                <dd>{resolution.petitioner.church}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-muted-foreground">
                {t("resolution.committee")}
              </dt>
              <dd>
                {resolution.committee
                  ? resolution.committee.name
                  : t("resolution.notAssigned")}
              </dd>
            </div>
            {resolution.hasFinancialImplications && (
              <div className="col-span-2">
                <dt className="font-medium text-muted-foreground">
                  {t("resolution.financialImplications")}
                </dt>
                <dd className="text-amber-700">
                  {resolution.financeReferralNote || t("resolution.financialFlagged")}
                </dd>
              </div>
            )}
            {resolution.submittedAt && (
              <div>
                <dt className="font-medium text-muted-foreground">
                  {t("resolution.submittedOn")}
                </dt>
                <dd>
                  {new Date(resolution.submittedAt).toLocaleDateString(locale)}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Resolution text */}
      {text && (
        <Card>
          <CardHeader>
            <CardTitle>{t("resolution.text")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{text}</p>
          </CardContent>
        </Card>
      )}

      {/* Rationale */}
      {rationale && (
        <Card>
          <CardHeader>
            <CardTitle>{t("resolution.rationale")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{rationale}</p>
          </CardContent>
        </Card>
      )}

      {/* Bilingual display: show the other language if both exist */}
      {resolution.title_en && resolution.title_es && (
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "en" ? t("resolution.writeInSpanish") : t("resolution.writeInEnglish")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                {t("resolution.title")}
              </h4>
              <p>{locale === "en" ? resolution.title_es : resolution.title_en}</p>
            </div>
            {(locale === "en" ? resolution.text_es : resolution.text_en) && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                  {t("resolution.text")}
                </h4>
                <p className="whitespace-pre-wrap">
                  {locale === "en" ? resolution.text_es : resolution.text_en}
                </p>
              </div>
            )}
            {(locale === "en" ? resolution.rationale_es : resolution.rationale_en) && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                  {t("resolution.rationale")}
                </h4>
                <p className="whitespace-pre-wrap">
                  {locale === "en" ? resolution.rationale_es : resolution.rationale_en}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendation text */}
      {resolution.recommendationText && (
        <Card>
          <CardHeader>
            <CardTitle>{t("resolution.recommendation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{resolution.recommendationText}</p>
            {resolution.recommendedAt && (
              <p className="mt-2 text-sm text-muted-foreground">
                {new Date(resolution.recommendedAt).toLocaleDateString(locale)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* UT decision text */}
      {resolution.utDecisionText && (
        <Card>
          <CardHeader>
            <CardTitle>{t("resolution.utDecision")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{resolution.utDecisionText}</p>
            {resolution.utDecidedAt && (
              <p className="mt-2 text-sm text-muted-foreground">
                {new Date(resolution.utDecidedAt).toLocaleDateString(locale)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Final explanation (reason for not advancing) */}
      {resolution.finalExplanation && (
        <Card>
          <CardHeader>
            <CardTitle>{t("resolution.explanation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{resolution.finalExplanation}</p>
          </CardContent>
        </Card>
      )}

      {/* ─── Action sections ─── */}

      {/* Financial implications banner */}
      {resolution.hasFinancialImplications &&
        !["APPROVED", "NOT_ADVANCED"].includes(resolution.status) &&
        (role === "SECRETARY" || role === "ADMIN") && (
          <Card className="border-amber-400 bg-amber-50">
            <CardContent className="flex items-start gap-3 pt-6">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-amber-800">
                  {t("resolution.financialAutoDetected")}
                </p>
                <p className="text-sm text-amber-700">
                  {resolution.financeReferralNote || t("resolution.financialFlagged")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismissFinancialFlag}
                  disabled={actionLoading}
                  className="border-amber-400 text-amber-800 hover:bg-amber-100"
                >
                  {t("resolution.dismissFlag")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      {/* SECRETARY/ADMIN + SUBMITTED: Assign to committee */}
      {(role === "SECRETARY" || role === "ADMIN") &&
        resolution.status === "SUBMITTED" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("resolution.assignCommittee")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedCommittee}
                onValueChange={(val) => setSelectedCommittee(val ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("resolution.assignCommittee")} />
                </SelectTrigger>
                <SelectContent>
                  {committees.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center justify-between">
                <Button
                  onClick={handleAssign}
                  disabled={!selectedCommittee || actionLoading}
                >
                  {t("resolution.assignCommittee")}
                </Button>
                {!resolution.hasFinancialImplications && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFlagForFinance}
                    disabled={actionLoading}
                    className="text-amber-700 hover:text-amber-800"
                  >
                    {t("resolution.flagForFinance")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* COMMITTEE_CHAIR + UNDER_REVIEW: Recommend / Do Not Recommend */}
      {role === "COMMITTEE_CHAIR" && resolution.status === "UNDER_REVIEW" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("resolution.recordRecommendation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t("resolution.recommendationNotes")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleRecommend(true)}
                disabled={actionLoading}
              >
                {t("resolution.recommend")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRecommend(false)}
                disabled={actionLoading}
              >
                {t("resolution.doNotRecommend")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECRETARY/ADMIN + RECOMMENDED: Approve / Do Not Advance */}
      {(role === "SECRETARY" || role === "ADMIN") &&
        resolution.status === "RECOMMENDED" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("resolution.utDecision")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t("resolution.utNotes")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUTDecision(true)}
                  disabled={actionLoading}
                >
                  {t("resolution.approveForJournal")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleUTDecision(false)}
                  disabled={actionLoading}
                >
                  {t("resolution.terminateResolution")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      {/* SECRETARY/ADMIN + NOT_RECOMMENDED: Do Not Advance */}
      {(role === "SECRETARY" || role === "ADMIN") &&
        resolution.status === "NOT_RECOMMENDED" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("resolution.terminateResolution")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t("resolution.terminationReason")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <Button
                variant="destructive"
                onClick={() => handleUTDecision(false)}
                disabled={actionLoading}
              >
                {t("resolution.terminateResolution")}
              </Button>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
