"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewResolutionPage() {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const body = {
      title_en: form.get("title_en") as string || undefined,
      title_es: form.get("title_es") as string || undefined,
      text_en: form.get("text_en") as string || undefined,
      text_es: form.get("text_es") as string || undefined,
      rationale_en: form.get("rationale_en") as string || undefined,
      rationale_es: form.get("rationale_es") as string || undefined,
    };

    try {
      const res = await fetch("/api/resolutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to create resolution");
        return;
      }

      const data = await res.json();
      toast.success(t("resolution.draftSaved"));
      router.push(`/${locale}/resolutions/${data.id}`);
    } catch {
      toast.error("Failed to create resolution");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("resolution.createNew")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">{t("resolution.writeInEnglish")}</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("resolution.title")} (EN)</label>
                <Input name="title_en" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("resolution.text")} (EN)</label>
                <Textarea name="text_en" rows={6} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("resolution.rationale")} (EN)</label>
                <Textarea name="rationale_en" rows={4} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">{t("resolution.writeInSpanish")}</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("resolution.title")} (ES)</label>
                <Input name="title_es" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("resolution.text")} (ES)</label>
                <Textarea name="text_es" rows={6} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("resolution.rationale")} (ES)</label>
                <Textarea name="rationale_es" rows={4} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "..." : t("common.save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
