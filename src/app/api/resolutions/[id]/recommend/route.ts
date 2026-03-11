import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/client";
import { getCurrentUser, hasMinRole } from "@/lib/auth-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = user.role as UserRole;
  const { id } = await params;

  const resolution = await prisma.resolution.findUnique({ where: { id } });
  if (!resolution) {
    return NextResponse.json({ error: "Resolution not found" }, { status: 404 });
  }

  // SECRETARY/ADMIN can always recommend; COMMITTEE_CHAIR must be chair of assigned committee
  if (role === "COMMITTEE_CHAIR") {
    if (!resolution.committeeId) {
      return NextResponse.json({ error: "Resolution has no assigned committee" }, { status: 400 });
    }
    const membership = await prisma.committeeMembership.findFirst({
      where: {
        userId: user.id,
        committeeId: resolution.committeeId,
        isChair: true,
      },
    });
    if (!membership) {
      return NextResponse.json({ error: "You are not the chair of this resolution's committee" }, { status: 403 });
    }
  } else if (!hasMinRole(role, "SECRETARY")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { recommend, notes } = body;

  if (typeof recommend !== "boolean") {
    return NextResponse.json({ error: "recommend (boolean) is required" }, { status: 400 });
  }

  const updated = await prisma.resolution.update({
    where: { id },
    data: {
      status: recommend ? "RECOMMENDED" : "NOT_RECOMMENDED",
      recommendationText: notes ?? null,
      recommendedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
