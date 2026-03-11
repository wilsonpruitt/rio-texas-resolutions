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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { approve, notes } = body;

  if (typeof approve !== "boolean") {
    return NextResponse.json({ error: "approve (boolean) is required" }, { status: 400 });
  }

  const updated = await prisma.resolution.update({
    where: { id },
    data: {
      status: approve ? "APPROVED" : "NOT_ADVANCED",
      utDecisionText: notes ?? null,
      utDecidedAt: new Date(),
      ...(!approve && { finalExplanation: notes ?? null }),
    },
  });

  return NextResponse.json(updated);
}
