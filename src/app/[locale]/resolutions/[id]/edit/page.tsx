"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResolutionData {
  id: string;
  title_en: string | null;
  title_es: string | null;
  text_en: string | null;
  text_es: string | null;
  rationale_en: string | null;
  rationale_es: string | null;
  status: string;
  petitioner: { id: string };
}

export default function EditResolutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();

  const [resolution, setResolution] = useState<ResolutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const userId = (session?.user as { id?: string })?.id;

  useEffect(() => {
    fetch(`/api/resolutions/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        // Only allow editing DRAFT resolutions by the petitioner
        if (data.status !== "DRAFT") {
          toast.error("Can only edit draft resolutions");
          router.push(`/${locale}/resolutions/${id}`);
          return;
        }
        setResolution(data);
      })
      .catch(() => router.push(`/${locale}/resolutions`))
      .finally(() => setLoading(false));
  }, [id, locale, router]);

  // Check ownership after session loads
  useEffect(() => {
    if (resolution && userId && resolution.petitioner.id !== userId) {
      toast.error("You can only edit your own resolutions");
      router.push(`/${locale}/resolutions/${id}`);
    }
  }, [resolution, userId, locale, id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);

    const body = {
      title_en: form.get("title_en") as string,
      title_es: form.get("title_es") as string,
      text_en: form.get("text_en") as string,
      text_es: form.get("text_es") as string,
      rationale_en: form.get("rationale_en") as string,
      rationale_es: form.get("rationale_es") as string,
    };

    try {
      const res = await fetch(`/api/resolutions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
        return;
      }

      toast.success(t("resolution.draftSaved"));
      router.push(`/${locale}/resolutions/${id}`);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">{t("common.loading")}</p>;
  }
  if (!resolution) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("resolution.editDraft")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">{t("resolution.writeInEnglish")}</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("resolution.title")} (EN)
                </label>
                <Input
                  name="title_en"
                  defaultValue={resolution.title_en || ""}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("resolution.text")} (EN)
                </label>
                <Textarea
                  name="text_en"
                  rows={6}
                  defaultValue={resolution.text_en || ""}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("resolution.rationale")} (EN)
                </label>
                <Textarea
                  name="rationale_en"
                  rows={4}
                  defaultValue={resolution.rationale_en || ""}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">{t("resolution.writeInSpanish")}</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("resolution.title")} (ES)
                </label>
                <Input
                  name="title_es"
                  defaultValue={resolution.title_es || ""}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("resolution.text")} (ES)
                </label>
                <Textarea
                  name="text_es"
                  rows={6}
                  defaultValue={resolution.text_es || ""}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("resolution.rationale")} (ES)
                </label>
                <Textarea
                  name="rationale_es"
                  rows={4}
                  defaultValue={resolution.rationale_es || ""}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${locale}/resolutions/${id}`)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "..." : t("common.save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
