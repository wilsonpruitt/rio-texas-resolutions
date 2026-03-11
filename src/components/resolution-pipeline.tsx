"use client";

import { useTranslations } from "next-intl";
import { Check, X, Circle } from "lucide-react";

type ResolutionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "RECOMMENDED"
  | "NOT_RECOMMENDED"
  | "UT_REVIEW"
  | "APPROVED"
  | "NOT_ADVANCED";

interface PipelineStep {
  key: string;
  label: string;
  date?: string | null;
}

// Map each status to which step index is active and whether it's a "bad" path
function getStepState(status: ResolutionStatus) {
  // Normal path:       0:Draft → 1:Submitted → 2:Committee → 3:UT Review → 4:Journal
  // Not recommended:   stops at step 2 with rejection, then 3 can decline to advance
  // Not Advanced:      stops at step 3/4 with rejection
  switch (status) {
    case "DRAFT":
      return { activeIndex: 0, rejected: false };
    case "SUBMITTED":
      return { activeIndex: 1, rejected: false };
    case "UNDER_REVIEW":
      return { activeIndex: 2, rejected: false };
    case "RECOMMENDED":
      return { activeIndex: 2, rejected: false };
    case "NOT_RECOMMENDED":
      return { activeIndex: 2, rejected: true };
    case "UT_REVIEW":
      return { activeIndex: 3, rejected: false };
    case "APPROVED":
      return { activeIndex: 4, rejected: false };
    case "NOT_ADVANCED":
      return { activeIndex: 4, rejected: true };
    default:
      return { activeIndex: 0, rejected: false };
  }
}

export function ResolutionPipeline({
  status,
  submittedAt,
  recommendedAt,
  utDecidedAt,
}: {
  status: ResolutionStatus;
  submittedAt?: string | null;
  recommendedAt?: string | null;
  utDecidedAt?: string | null;
}) {
  const t = useTranslations("pipeline");

  const steps: PipelineStep[] = [
    { key: "draft", label: t("draft") },
    { key: "submitted", label: t("submitted"), date: submittedAt },
    { key: "committee", label: t("committee"), date: recommendedAt },
    { key: "unitingTable", label: t("unitingTable") },
    { key: "outcome", label: t("outcome"), date: utDecidedAt },
  ];

  const { activeIndex, rejected } = getStepState(status);

  // Determine the label for the outcome step
  let outcomeLabel = t("outcome");
  if (status === "APPROVED") outcomeLabel = t("approved");
  if (status === "NOT_ADVANCED") outcomeLabel = t("notAdvanced");
  steps[4].label = outcomeLabel;

  // Committee step label based on status
  if (status === "RECOMMENDED") steps[2].label = t("recommended");
  if (status === "NOT_RECOMMENDED") steps[2].label = t("notRecommended");

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-[500px] items-start">
        {steps.map((step, i) => {
          const isComplete = i < activeIndex;
          const isCurrent = i === activeIndex;
          const isFuture = i > activeIndex;
          const isRejectedStep = isCurrent && rejected;

          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              {/* Connector + circle row */}
              <div className="flex w-full items-center">
                {/* Left connector */}
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isComplete || isCurrent
                        ? isRejectedStep
                          ? "bg-red-400"
                          : "bg-primary"
                        : "bg-muted-foreground/20"
                    }`}
                  />
                )}
                {i === 0 && <div className="flex-1" />}

                {/* Circle */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isComplete
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? isRejectedStep
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 bg-background text-muted-foreground/40"
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : isRejectedStep ? (
                    <X className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Circle className="h-3 w-3 fill-current" />
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </div>

                {/* Right connector */}
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isComplete
                        ? "bg-primary"
                        : "bg-muted-foreground/20"
                    }`}
                  />
                )}
                {i === steps.length - 1 && <div className="flex-1" />}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-center text-xs font-medium ${
                  isComplete || isCurrent
                    ? isRejectedStep
                      ? "text-red-600"
                      : "text-foreground"
                    : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </span>

              {/* Date */}
              {step.date && (isComplete || isCurrent) && (
                <span className="mt-0.5 text-center text-[10px] text-muted-foreground">
                  {new Date(step.date).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
