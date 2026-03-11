"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Step = "intro" | "account" | "draft" | "review";

export default function SubmitPage() {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const [step, setStep] = useState<Step>(session?.user ? "draft" : "intro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Account fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [church, setChurch] = useState("");
  const [password, setPassword] = useState("");

  // Resolution fields
  const [titleEn, setTitleEn] = useState("");
  const [titleEs, setTitleEs] = useState("");
  const [textEn, setTextEn] = useState("");
  const [textEs, setTextEs] = useState("");
  const [rationaleEn, setRationaleEn] = useState("");
  const [rationaleEs, setRationaleEs] = useState("");

  async function handleRegister() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, church, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    // Auto sign in
    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInRes?.error) {
      setError("Account created but sign-in failed. Please sign in manually.");
      setLoading(false);
      return;
    }

    await updateSession();
    setStep("draft");
    setLoading(false);
  }

  async function handleSignIn() {
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(t("auth.invalidCredentials"));
      setLoading(false);
      return;
    }

    await updateSession();
    setStep("draft");
    setLoading(false);
  }

  async function handleSaveDraft() {
    if (!titleEn && !titleEs) {
      setError(t("submit.needTitle"));
      return;
    }
    if (!textEn && !textEs) {
      setError(t("submit.needText"));
      return;
    }
    setStep("review");
  }

  async function handleSubmitResolution() {
    setLoading(true);
    setError("");

    // Create draft
    const createRes = await fetch("/api/resolutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title_en: titleEn || null,
        title_es: titleEs || null,
        text_en: textEn || null,
        text_es: textEs || null,
        rationale_en: rationaleEn || null,
        rationale_es: rationaleEs || null,
      }),
    });

    if (!createRes.ok) {
      const data = await createRes.json();
      setError(data.error || "Failed to create resolution");
      setLoading(false);
      return;
    }

    const resolution = await createRes.json();

    // Submit it
    const submitRes = await fetch(`/api/resolutions/${resolution.id}/submit`, {
      method: "POST",
    });

    if (!submitRes.ok) {
      // Created as draft but failed to submit — go to detail page
      toast.error("Saved as draft but could not submit. You can submit from the detail page.");
      router.push(`/${locale}/resolutions/${resolution.id}`);
      setLoading(false);
      return;
    }

    toast.success(t("submit.submitted"));
    router.push(`/${locale}/resolutions/${resolution.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      {/* ── Step indicators ── */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {(["intro", "account", "draft", "review"] as const).map((s, i) => {
          const labels = [
            t("submit.stepIntro"),
            t("submit.stepAccount"),
            t("submit.stepWrite"),
            t("submit.stepReview"),
          ];
          const stepOrder = { intro: 0, account: 1, draft: 2, review: 3 };
          const current = stepOrder[step];
          const isActive = i <= current;
          const isCurrent = i === current;

          // Skip account step indicator if already logged in
          if (s === "account" && session?.user) return null;

          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && !(s === "account" && session?.user) && (
                <div className={`h-px w-6 ${isActive ? "bg-primary" : "bg-muted-foreground/20"}`} />
              )}
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="rounded border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
          {error}
        </p>
      )}

      {/* ── Intro ── */}
      {step === "intro" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("submit.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>{t("submit.introText")}</p>

            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="mb-2 font-semibold">{t("submit.processTitle")}</h4>
              <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
                <li>{t("submit.processStep1")}</li>
                <li>{t("submit.processStep2")}</li>
                <li>{t("submit.processStep3")}</li>
                <li>{t("submit.processStep4")}</li>
              </ol>
            </div>

            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
              <h4 className="mb-1 font-semibold text-amber-800">{t("submit.beforeYouStart")}</h4>
              <p className="text-amber-700">{t("submit.beforeYouStartText")}</p>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="mb-2 font-semibold">{t("submit.whatYouNeed")}</h4>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>{t("submit.need1")}</li>
                <li>{t("submit.need2")}</li>
                <li>{t("submit.need3")}</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              {session?.user ? (
                <Button onClick={() => setStep("draft")}>{t("submit.continue")}</Button>
              ) : (
                <Button onClick={() => setStep("account")}>{t("submit.continue")}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Account (register or sign in) ── */}
      {step === "account" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("submit.createAccount")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("submit.accountExplanation")}</p>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name">{t("submit.name")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">{t("submit.email")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="church">{t("submit.church")}</Label>
                <Input id="church" value={church} onChange={(e) => setChurch(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">{t("submit.password")}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep("intro")}>{t("common.back")}</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSignIn} disabled={loading || !email || !password}>
                  {t("submit.existingAccount")}
                </Button>
                <Button onClick={handleRegister} disabled={loading || !name || !email || !church || !password}>
                  {loading ? "..." : t("submit.createAndContinue")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Draft ── */}
      {step === "draft" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("submit.writeResolution")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">{t("submit.writeExplanation")}</p>

            {/* English fields */}
            <div className="space-y-3 rounded-lg border p-4">
              <h4 className="text-sm font-semibold text-muted-foreground">{t("submit.sectionEnglish")}</h4>
              <div className="space-y-1">
                <Label htmlFor="title_en">{t("resolution.title")}</Label>
                <Input
                  id="title_en"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Resolution on..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="text_en">{t("resolution.text")}</Label>
                <Textarea
                  id="text_en"
                  value={textEn}
                  onChange={(e) => setTextEn(e.target.value)}
                  rows={10}
                  placeholder="WHEREAS, ... THEREFORE BE IT RESOLVED, ..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="rationale_en">{t("resolution.rationale")}</Label>
                <Textarea
                  id="rationale_en"
                  value={rationaleEn}
                  onChange={(e) => setRationaleEn(e.target.value)}
                  rows={3}
                  placeholder="Why this resolution matters..."
                />
              </div>
            </div>

            {/* Spanish fields */}
            <div className="space-y-3 rounded-lg border p-4">
              <h4 className="text-sm font-semibold text-muted-foreground">{t("submit.sectionSpanish")}</h4>
              <div className="space-y-1">
                <Label htmlFor="title_es">{t("resolution.title")}</Label>
                <Input
                  id="title_es"
                  value={titleEs}
                  onChange={(e) => setTitleEs(e.target.value)}
                  placeholder="Resolución sobre..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="text_es">{t("resolution.text")}</Label>
                <Textarea
                  id="text_es"
                  value={textEs}
                  onChange={(e) => setTextEs(e.target.value)}
                  rows={10}
                  placeholder="POR CUANTO, ... POR LO TANTO, SE RESUELVE, ..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="rationale_es">{t("resolution.rationale")}</Label>
                <Textarea
                  id="rationale_es"
                  value={rationaleEs}
                  onChange={(e) => setRationaleEs(e.target.value)}
                  rows={3}
                  placeholder="Por qué esta resolución es importante..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(session?.user ? "intro" : "account")}>
                {t("common.back")}
              </Button>
              <Button onClick={handleSaveDraft}>{t("submit.reviewAndSubmit")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Review & Submit ── */}
      {step === "review" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("submit.reviewTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">{t("submit.reviewExplanation")}</p>

              {titleEn && (
                <div>
                  <h4 className="font-semibold text-muted-foreground">{t("submit.reviewTitleEn")}</h4>
                  <p className="mt-1">{titleEn}</p>
                </div>
              )}
              {titleEs && (
                <div>
                  <h4 className="font-semibold text-muted-foreground">{t("submit.reviewTitleEs")}</h4>
                  <p className="mt-1">{titleEs}</p>
                </div>
              )}
              {textEn && (
                <div>
                  <h4 className="font-semibold text-muted-foreground">{t("submit.reviewTextEn")}</h4>
                  <p className="mt-1 whitespace-pre-wrap">{textEn}</p>
                </div>
              )}
              {textEs && (
                <div>
                  <h4 className="font-semibold text-muted-foreground">{t("submit.reviewTextEs")}</h4>
                  <p className="mt-1 whitespace-pre-wrap">{textEs}</p>
                </div>
              )}
              {rationaleEn && (
                <div>
                  <h4 className="font-semibold text-muted-foreground">{t("submit.reviewRationaleEn")}</h4>
                  <p className="mt-1 whitespace-pre-wrap">{rationaleEn}</p>
                </div>
              )}
              {rationaleEs && (
                <div>
                  <h4 className="font-semibold text-muted-foreground">{t("submit.reviewRationaleEs")}</h4>
                  <p className="mt-1 whitespace-pre-wrap">{rationaleEs}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep("draft")}>{t("submit.editDraft")}</Button>
            <Button onClick={handleSubmitResolution} disabled={loading}>
              {loading ? "..." : t("submit.submitNow")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
