"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { ResolutionStatus } from "@/generated/prisma/client";

const STATUS_COLORS: Record<ResolutionStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
  RECOMMENDED: "bg-green-100 text-green-800",
  NOT_RECOMMENDED: "bg-red-100 text-red-800",
  UT_REVIEW: "bg-purple-100 text-purple-800",
  APPROVED: "bg-emerald-200 text-emerald-900",
  NOT_ADVANCED: "bg-red-200 text-red-900",
};

export function ResolutionStatusBadge({ status }: { status: ResolutionStatus }) {
  const t = useTranslations("status");
  return (
    <Badge className={STATUS_COLORS[status]} variant="secondary">
      {t(status)}
    </Badge>
  );
}
