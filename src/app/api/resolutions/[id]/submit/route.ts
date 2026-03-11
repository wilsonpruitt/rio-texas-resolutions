import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { detectFinancialImplications } from "@/lib/financial-detect";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resolution = await prisma.resolution.findUnique({
    where: { id },
    include: { conference: true },
  });

  if (!resolution) {
    return NextResponse.json({ error: "Resolution not found" }, { status: 404 });
  }

  if (resolution.petitionerId !== user.id) {
    return NextResponse.json({ error: "Only the petitioner can submit this resolution" }, { status: 403 });
  }

  if (resolution.status !== "DRAFT") {
    return NextResponse.json({ error: "Can only submit resolutions in DRAFT status" }, { status: 400 });
  }

  // Must have at least one title and one text
  if (!resolution.title_en && !resolution.title_es) {
    return NextResponse.json({ error: "At least title_en or title_es is required" }, { status: 400 });
  }
  if (!resolution.text_en && !resolution.text_es) {
    return NextResponse.json({ error: "At least text_en or text_es is required" }, { status: 400 });
  }

  // Generate display number: RT-{year}-{0001}
  const year = resolution.conference.year;
  const prefix = `RT-${year}-`;

  const lastResolution = await prisma.resolution.findFirst({
    where: {
      displayNumber: { startsWith: prefix },
    },
    orderBy: { displayNumber: "desc" },
    select: { displayNumber: true },
  });

  let nextNumber = 1;
  if (lastResolution?.displayNumber) {
    const lastNum = parseInt(lastResolution.displayNumber.replace(prefix, ""), 10);
    if (!isNaN(lastNum)) {
      nextNumber = lastNum + 1;
    }
  }

  const displayNumber = `${prefix}${String(nextNumber).padStart(4, "0")}`;

  // Run financial detection on resolution text
  const detection = detectFinancialImplications(resolution.text_en, resolution.text_es);

  let financeReferralNote: string | null = null;
  if (detection.detected) {
    const matchList = detection.matches.map((m) => `"${m}"`).join(", ");

    // Look up the finance standing rule for citation
    const standingRule = await prisma.standingRule.findUnique({
      where: { number: "SR-14" },
    });

    if (standingRule) {
      financeReferralNote = `Auto-detected financial language: ${matchList}. Per ${standingRule.number} — ${standingRule.title_en}, this resolution requires Finance & Administration (FT) committee review.`;
    } else {
      financeReferralNote = `Auto-detected financial language: ${matchList}. This resolution may require Finance & Administration committee review.`;
    }
  }

  const updated = await prisma.resolution.update({
    where: { id },
    data: {
      status: "SUBMITTED",
      displayNumber,
      submittedAt: new Date(),
      ...(detection.detected && {
        hasFinancialImplications: true,
        financeReferralNote,
      }),
    },
  });

  return NextResponse.json(updated);
}
