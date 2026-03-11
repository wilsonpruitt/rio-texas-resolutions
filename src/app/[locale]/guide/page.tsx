"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

const richComponents = {
  strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
  code: (chunks: ReactNode) => (
    <code className="rounded bg-muted px-1.5 py-0.5">{chunks}</code>
  ),
};

export default function GuidePage() {
  const locale = useLocale();
  const t = useTranslations("guide");
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {/* ── Overview ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("overviewTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            {t.rich("overviewBody", richComponents)}
          </p>
          <div className="rounded-lg border bg-muted/50 p-4 font-mono text-xs">
            {t("overviewPipeline")}
          </div>
          <p>
            {t("overviewFinancial")}
          </p>
        </CardContent>
      </Card>

      {/* ── Test Accounts ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("testAccountsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {t.rich("testAccountsPassword", richComponents)}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">{t("tableEmail")}</th>
                  <th className="pb-2 font-medium">{t("tableName")}</th>
                  <th className="pb-2 font-medium">{t("tableRole")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 font-mono text-xs">delegate@riotexas.org</td>
                  <td className="py-2">Sarah Johnson</td>
                  <td className="py-2">{t("rolePetitioner")}</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">delegado@riotexas.org</td>
                  <td className="py-2">Roberto Díaz</td>
                  <td className="py-2">{t("rolePetitionerES")}</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">chair-csr@riotexas.org</td>
                  <td className="py-2">Rev. Ana Martínez</td>
                  <td className="py-2">{t("roleChairCSR")}</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">chair-bot@riotexas.org</td>
                  <td className="py-2">Rev. David Kim</td>
                  <td className="py-2">{t("roleChairBOT")}</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">secretary@riotexas.org</td>
                  <td className="py-2">María García</td>
                  <td className="py-2">{t("roleSecretary")}</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">assistant@riotexas.org</td>
                  <td className="py-2">Carlos Mendoza</td>
                  <td className="py-2">{t("roleAdmin")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Test Resolutions ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("testResolutionsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("testResolutionsDesc")}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0001</span>
              <span className="w-28 shrink-0 rounded bg-blue-100 px-2 py-0.5 text-center text-xs text-blue-800">{t("statusSubmitted")}</span>
              <span>{t("res1")}</span>
              <span className="ml-auto text-xs text-amber-600">{t("flagged")}</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0002</span>
              <span className="w-28 shrink-0 rounded bg-yellow-100 px-2 py-0.5 text-center text-xs text-yellow-800">{t("statusUnderReview")}</span>
              <span>{t("res2")}</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0003</span>
              <span className="w-28 shrink-0 rounded bg-green-100 px-2 py-0.5 text-center text-xs text-green-800">{t("statusRecommended")}</span>
              <span>{t("res3")}</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0004</span>
              <span className="w-28 shrink-0 rounded bg-red-100 px-2 py-0.5 text-center text-xs text-red-800">{t("statusNotRecommended")}</span>
              <span>{t("res4")}</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0005</span>
              <span className="w-28 shrink-0 rounded bg-emerald-200 px-2 py-0.5 text-center text-xs text-emerald-900">{t("statusApproved")}</span>
              <span>{t("res5")}</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0006</span>
              <span className="w-28 shrink-0 rounded bg-red-200 px-2 py-0.5 text-center text-xs text-red-900">{t("statusNotAdvanced")}</span>
              <span>{t("res6")}</span>
              <span className="ml-auto text-xs text-amber-600">{t("flagged")}</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">{t("noNumber")}</span>
              <span className="w-28 shrink-0 rounded bg-gray-100 px-2 py-0.5 text-center text-xs text-gray-800">{t("statusDraft")}</span>
              <span>{t("res7")}</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0007</span>
              <span className="w-28 shrink-0 rounded bg-yellow-100 px-2 py-0.5 text-center text-xs text-yellow-800">{t("statusUnderReview")}</span>
              <span>{t("res8")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Walkthrough: Petitioner ── */}
      <Card id="petitioner">
        <CardHeader>
          <CardTitle>{t("walkthroughPetitioner")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            {t.rich("petitionerLogin", richComponents)}
          </p>

          <div className="space-y-3">
            <h4 className="font-semibold">{t("petitionerStep1Title")}</h4>
            <p>
              {t.rich("petitionerStep1", richComponents)}
            </p>

            <h4 className="font-semibold">{t("petitionerStep2Title")}</h4>
            <p>
              {t.rich("petitionerStep2", richComponents)}
            </p>
            <p className="rounded border-l-2 border-amber-400 bg-amber-50 p-3 text-amber-800">
              {t("petitionerFinancialWarning")}
            </p>

            <h4 className="font-semibold">{t("petitionerStep3Title")}</h4>
            <p>
              {t.rich("petitionerStep3", richComponents)}
            </p>

            <h4 className="font-semibold">{t("petitionerTryTitle")}</h4>
            <p>
              {t.rich("petitionerTry", richComponents)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Walkthrough: Committee Chair ── */}
      <Card id="committee-chair">
        <CardHeader>
          <CardTitle>{t("walkthroughChair")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            {t.rich("chairLogin", richComponents)}
          </p>

          <div className="space-y-3">
            <h4 className="font-semibold">{t("chairStep1Title")}</h4>
            <p>
              {t.rich("chairStep1", richComponents)}
            </p>

            <h4 className="font-semibold">{t("chairStep2Title")}</h4>
            <p>
              {t("chairStep2")}
            </p>

            <h4 className="font-semibold">{t("chairStep3Title")}</h4>
            <p>
              {t.rich("chairStep3", richComponents)}
            </p>
            <p>
              {t("chairStep3Follow")}
            </p>

            <h4 className="font-semibold">{t("chairTryTitle")}</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>
                {t.rich("chairTry1", richComponents)}
              </li>
              <li>
                {t.rich("chairTry2", richComponents)}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* ── Walkthrough: Conference Secretary ── */}
      <Card id="secretary">
        <CardHeader>
          <CardTitle>{t("walkthroughSecretary")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            {t.rich("secretaryLogin", richComponents)}
          </p>

          <div className="space-y-3">
            <h4 className="font-semibold">{t("secretaryStep1Title")}</h4>
            <p>
              {t.rich("secretaryStep1", richComponents)}
            </p>

            <h4 className="font-semibold">{t("secretaryStep2Title")}</h4>
            <p>
              {t.rich("secretaryStep2", richComponents)}
            </p>
            <p className="rounded border-l-2 border-amber-400 bg-amber-50 p-3 text-amber-800">
              {t.rich("secretaryFinancialWarning", richComponents)}
            </p>

            <h4 className="font-semibold">{t("secretaryStep3Title")}</h4>
            <p>
              {t.rich("secretaryStep3", richComponents)}
            </p>

            <h4 className="font-semibold">{t("secretaryStep4Title")}</h4>
            <p>
              {t.rich("secretaryStep4", richComponents)}
            </p>

            <h4 className="font-semibold">{t("secretaryTryTitle")}</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>
                {t.rich("secretaryTry1", richComponents)}
              </li>
              <li>
                {t.rich("secretaryTry2", richComponents)}
              </li>
              <li>
                {t.rich("secretaryTry3", richComponents)}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* ── Walkthrough: Admin ── */}
      <Card id="admin">
        <CardHeader>
          <CardTitle>{t("walkthroughAdmin")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            {t.rich("adminLogin", richComponents)}
          </p>

          <div className="space-y-3">
            <h4 className="font-semibold">{t("adminFullAccessTitle")}</h4>
            <p>
              {t("adminFullAccess")}
            </p>

            <h4 className="font-semibold">{t("adminWhatYouSeeTitle")}</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>{t("adminSee1")}</li>
              <li>{t("adminSee2")}</li>
              <li>{t("adminSee3")}</li>
              <li>{t("adminSee4")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* ── Status Reference ── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("statusReferenceTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">{t("refDraft")}</span>
              <span className="text-muted-foreground">{t("refDraftDesc")}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">{t("refSubmitted")}</span>
              <span className="text-muted-foreground">{t("refSubmittedDesc")}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">{t("refUnderReview")}</span>
              <span className="text-muted-foreground">{t("refUnderReviewDesc")}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">{t("refRecommended")}</span>
              <span className="text-muted-foreground">{t("refRecommendedDesc")}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">{t("refNotRecommended")}</span>
              <span className="text-muted-foreground">{t("refNotRecommendedDesc")}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">{t("refApproved")}</span>
              <span className="text-muted-foreground">{t("refApprovedDesc")}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">{t("refNotAdvanced")}</span>
              <span className="text-muted-foreground">{t("refNotAdvancedDesc")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pb-8">
        <Link href={`/${locale}/login`}>
          <Button size="lg">{t("signInToGetStarted")}</Button>
        </Link>
      </div>
    </div>
  );
}
