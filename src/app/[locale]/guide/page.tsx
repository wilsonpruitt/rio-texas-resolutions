"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GuidePage() {
  const locale = useLocale();
  const t = useTranslations();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">System Guide</h1>
        <p className="mt-2 text-muted-foreground">
          How to use the Río Texas Resolution Tracking System
        </p>
      </div>

      {/* ── Overview ── */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            This system tracks resolutions from initial submission through committee
            review and Uniting Table action, to either inclusion in the{" "}
            <strong>pre-conference journal</strong> or{" "}
            <strong>not advancing with explanation</strong>.
          </p>
          <div className="rounded-lg border bg-muted/50 p-4 font-mono text-xs">
            DRAFT → SUBMITTED → UNDER REVIEW → RECOMMENDED / NOT RECOMMENDED → APPROVED or NOT ADVANCED
          </div>
          <p>
            Resolutions with financial implications are automatically detected and
            flagged for Finance & Administration review per Standing Rule SR-14.
          </p>
        </CardContent>
      </Card>

      {/* ── Test Accounts ── */}
      <Card>
        <CardHeader>
          <CardTitle>Test Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            All accounts use password: <code className="rounded bg-muted px-1.5 py-0.5">password123</code>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 font-mono text-xs">delegate@riotexas.org</td>
                  <td className="py-2">Sarah Johnson</td>
                  <td className="py-2">Petitioner</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">delegado@riotexas.org</td>
                  <td className="py-2">Roberto Díaz</td>
                  <td className="py-2">Petitioner (ES)</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">chair-csr@riotexas.org</td>
                  <td className="py-2">Rev. Ana Martínez</td>
                  <td className="py-2">Chair — Church & Society</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">chair-bot@riotexas.org</td>
                  <td className="py-2">Rev. David Kim</td>
                  <td className="py-2">Chair — Board of Trustees</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">secretary@riotexas.org</td>
                  <td className="py-2">María García</td>
                  <td className="py-2">Conference Secretary</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">assistant@riotexas.org</td>
                  <td className="py-2">Carlos Mendoza</td>
                  <td className="py-2">Admin (Asst. to Bishop)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Test Resolutions ── */}
      <Card>
        <CardHeader>
          <CardTitle>Test Resolutions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Eight resolutions are loaded at various pipeline stages:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0001</span>
              <span className="w-28 shrink-0 rounded bg-blue-100 px-2 py-0.5 text-center text-xs text-blue-800">Submitted</span>
              <span>ICE / Sanctuary Ministries</span>
              <span className="ml-auto text-xs text-amber-600">$ flagged</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0002</span>
              <span className="w-28 shrink-0 rounded bg-yellow-100 px-2 py-0.5 text-center text-xs text-yellow-800">Under Review</span>
              <span>Climate / Creation Care → CSR</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0003</span>
              <span className="w-28 shrink-0 rounded bg-green-100 px-2 py-0.5 text-center text-xs text-green-800">Recommended</span>
              <span>Mental Health / Clergy Wellness → BOT</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0004</span>
              <span className="w-28 shrink-0 rounded bg-red-100 px-2 py-0.5 text-center text-xs text-red-800">Not Recommended</span>
              <span>Property Trust Clause → BOT</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0005</span>
              <span className="w-28 shrink-0 rounded bg-emerald-200 px-2 py-0.5 text-center text-xs text-emerald-900">Approved</span>
              <span>Bilingual Youth Ministry → TCVT</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0006</span>
              <span className="w-28 shrink-0 rounded bg-red-200 px-2 py-0.5 text-center text-xs text-red-900">Not Advanced</span>
              <span>Minimum Clergy Salary → FT</span>
              <span className="ml-auto text-xs text-amber-600">$ flagged</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">(no number)</span>
              <span className="w-28 shrink-0 rounded bg-gray-100 px-2 py-0.5 text-center text-xs text-gray-800">Draft</span>
              <span>Disaster Preparedness (Roberto)</span>
            </div>
            <div className="flex items-center gap-3 rounded border p-2">
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">RT-2026-0007</span>
              <span className="w-28 shrink-0 rounded bg-yellow-100 px-2 py-0.5 text-center text-xs text-yellow-800">Under Review</span>
              <span>Bilingual Pastor Formation → BOM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Walkthrough: Petitioner ── */}
      <Card id="petitioner">
        <CardHeader>
          <CardTitle>Walkthrough: Petitioner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            Login as <code className="rounded bg-muted px-1.5 py-0.5">delegate@riotexas.org</code> or{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">delegado@riotexas.org</code>
          </p>

          <div className="space-y-3">
            <h4 className="font-semibold">1. Create a resolution</h4>
            <p>
              Go to <strong>Resolutions → New Resolution</strong>. Fill in the title,
              full text, and rationale. You can write in English, Spanish, or both.
              Click <strong>Save as Draft</strong>.
            </p>

            <h4 className="font-semibold">2. Review and submit</h4>
            <p>
              From the resolution detail page, review your text. You can click{" "}
              <strong>Edit</strong> to make changes while it&apos;s still a draft. When ready,
              click <strong>Submit Resolution</strong>. A display number (RT-2026-XXXX)
              is automatically assigned.
            </p>
            <p className="rounded border-l-2 border-amber-400 bg-amber-50 p-3 text-amber-800">
              If your resolution mentions dollar amounts, budgets, or financial terms,
              it will be automatically flagged for Finance committee review per Standing
              Rule SR-14.
            </p>

            <h4 className="font-semibold">3. Track progress</h4>
            <p>
              Your <strong>Dashboard</strong> shows all your resolutions with their
              current status. Click any resolution to see the full detail, including
              committee recommendations and Uniting Table decisions as they happen.
            </p>

            <h4 className="font-semibold">Try it now</h4>
            <p>
              Roberto has a <strong>draft</strong> resolution on Disaster Preparedness
              that hasn&apos;t been submitted yet. Log in as{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">delegado@riotexas.org</code>{" "}
              to edit and submit it.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Walkthrough: Committee Chair ── */}
      <Card id="committee-chair">
        <CardHeader>
          <CardTitle>Walkthrough: Committee Chair</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            Login as <code className="rounded bg-muted px-1.5 py-0.5">chair-csr@riotexas.org</code> (Church & Society) or{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">chair-bot@riotexas.org</code> (Board of Trustees)
          </p>

          <div className="space-y-3">
            <h4 className="font-semibold">1. See your assignments</h4>
            <p>
              Your <strong>Dashboard</strong> shows resolutions assigned to your
              committee that are in <strong>Under Review</strong> status. These are
              the ones waiting for your recommendation.
            </p>

            <h4 className="font-semibold">2. Review the resolution</h4>
            <p>
              Click on a resolution to read the full text, rationale, and petitioner
              information. Both English and Spanish versions are displayed if available.
            </p>

            <h4 className="font-semibold">3. Record your recommendation</h4>
            <p>
              At the bottom of the resolution detail page, you&apos;ll see the{" "}
              <strong>Record Recommendation</strong> panel. Write your committee&apos;s
              notes, then click either <strong>Recommend</strong> or{" "}
              <strong>Do Not Recommend</strong>.
            </p>
            <p>
              Your recommendation and notes are recorded with a timestamp and become
              part of the resolution&apos;s permanent record.
            </p>

            <h4 className="font-semibold">Try it now</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>
                As <strong>chair-csr</strong>: RT-2026-0002 (Climate / Creation Care)
                is waiting for your recommendation.
              </li>
              <li>
                As <strong>chair-bot</strong>: RT-2026-0003 and RT-2026-0004 have
                already been reviewed — see what those recommendations look like.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* ── Walkthrough: Conference Secretary ── */}
      <Card id="secretary">
        <CardHeader>
          <CardTitle>Walkthrough: Conference Secretary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            Login as <code className="rounded bg-muted px-1.5 py-0.5">secretary@riotexas.org</code>
          </p>

          <div className="space-y-3">
            <h4 className="font-semibold">1. Pipeline overview</h4>
            <p>
              Your <strong>Dashboard</strong> shows all resolutions across all stages.
              The stats cards give you a quick count of drafts, in-progress, and
              completed resolutions. The <strong>Resolutions</strong> page shows the
              full list with search.
            </p>

            <h4 className="font-semibold">2. Assign to committee</h4>
            <p>
              Open any <strong>Submitted</strong> resolution. You&apos;ll see the{" "}
              <strong>Assign to Committee</strong> panel with a dropdown of all 11
              committees. Select the appropriate committee and click assign.
            </p>
            <p className="rounded border-l-2 border-amber-400 bg-amber-50 p-3 text-amber-800">
              <strong>Financial flag:</strong> If the system auto-detected financial
              language, you&apos;ll see an amber banner at the top citing Standing Rule
              SR-14 and the specific terms detected. You can <strong>Dismiss</strong>{" "}
              if it&apos;s a false positive, or note it when assigning to the appropriate
              committee. If the system missed financial language, use the{" "}
              <strong>Flag for Finance review</strong> link.
            </p>

            <h4 className="font-semibold">3. Uniting Table decisions</h4>
            <p>
              After a committee records its recommendation, you record the Uniting
              Table decision. Open the resolution and you&apos;ll see buttons to either{" "}
              <strong>Approve for Journal</strong> (includes it in the pre-conference
              journal) or <strong>Do Not Advance</strong> (with an explanation that goes
              back to the petitioner).
            </p>

            <h4 className="font-semibold">4. Handle non-recommendations</h4>
            <p>
              When a committee does <strong>not recommend</strong> a resolution, you
              can still record a Uniting Table decision — typically choosing not to
              advance, with the committee&apos;s reasoning included.
            </p>

            <h4 className="font-semibold">Try it now</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>RT-2026-0001</strong> (ICE / Sanctuary) is submitted with a
                financial flag — assign it to Church & Society (CSR).
              </li>
              <li>
                <strong>RT-2026-0003</strong> (Mental Health) is recommended — record
                a Uniting Table decision (approve or do not advance).
              </li>
              <li>
                <strong>RT-2026-0004</strong> (Property Trust Clause) was not
                recommended — choose not to advance it, with explanation.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* ── Walkthrough: Admin ── */}
      <Card id="admin">
        <CardHeader>
          <CardTitle>Walkthrough: Admin (Asst. to Bishop)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            Login as <code className="rounded bg-muted px-1.5 py-0.5">assistant@riotexas.org</code>
          </p>

          <div className="space-y-3">
            <h4 className="font-semibold">Full access</h4>
            <p>
              The Admin role has the same capabilities as the Conference Secretary —
              you can assign committees, record recommendations, and make Uniting
              Table decisions. This provides backup coverage and oversight.
            </p>

            <h4 className="font-semibold">What you see</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>All resolutions at every stage</li>
              <li>Financial flag banners and SR-14 citations</li>
              <li>All committee recommendations and UT decisions</li>
              <li>Explanations for resolutions not advanced</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* ── Status Reference ── */}
      <Card>
        <CardHeader>
          <CardTitle>Status Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">Draft</span>
              <span className="text-muted-foreground">Petitioner is still writing. Can be edited.</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">Submitted</span>
              <span className="text-muted-foreground">Submitted and awaiting committee assignment by Secretary.</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">Under Review</span>
              <span className="text-muted-foreground">Assigned to a committee. Chair will record recommendation.</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">Recommended</span>
              <span className="text-muted-foreground">Committee recommends adoption. Awaiting UT decision.</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">Not Recommended</span>
              <span className="text-muted-foreground">Committee does not recommend. Secretary records UT decision.</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">Approved</span>
              <span className="text-muted-foreground">Approved for inclusion in the pre-conference journal.</span>
            </div>
            <div className="flex gap-3">
              <span className="w-36 shrink-0 font-medium">Not Advanced</span>
              <span className="text-muted-foreground">Not advanced, with explanation. Not moving forward.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pb-8">
        <Link href={`/${locale}/login`}>
          <Button size="lg">Sign In to Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
