import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMinRole } from "@/lib/auth-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, status, user } = await requireMinRole("SECRETARY");
  if (error) {
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;

  const resolution = await prisma.resolution.findUnique({ where: { id } });
  if (!resolution) {
    return NextResponse.json({ error: "Resolution not found" }, { status: 404 });
  }

  const body = await request.json();
  const { committeeId, hasFinancialImplications, dismissFinancialFlag } = body;

  // Dismiss financial flag (no committee assignment needed)
  if (dismissFinancialFlag) {
    const updated = await prisma.resolution.update({
      where: { id },
      data: {
        hasFinancialImplications: false,
        financeReferralNote: null,
      },
    });
    return NextResponse.json(updated);
  }

  // Manually flag for finance review (no committee assignment needed)
  if (hasFinancialImplications && !committeeId) {
    const ft = await prisma.committee.findUnique({ where: { abbreviation: "FT" } });
    const financeNote = ft
      ? `Manually flagged — referred to ${ft.name} (${ft.abbreviation}) for financial review.`
      : "Manually flagged for Finance committee review.";

    const updated = await prisma.resolution.update({
      where: { id },
      data: {
        hasFinancialImplications: true,
        financeReferralNote: financeNote,
      },
    });
    return NextResponse.json(updated);
  }

  // Assign to committee
  if (!committeeId) {
    return NextResponse.json({ error: "committeeId is required" }, { status: 400 });
  }

  const committee = await prisma.committee.findUnique({ where: { id: committeeId } });
  if (!committee) {
    return NextResponse.json({ error: "Committee not found" }, { status: 404 });
  }

  const updated = await prisma.resolution.update({
    where: { id },
    data: {
      committeeId,
      status: "UNDER_REVIEW",
    },
  });

  return NextResponse.json(updated);
}
