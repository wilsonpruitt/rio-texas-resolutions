import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = user.role as UserRole;

  let resolutions;

  if (role === "PETITIONER") {
    resolutions = await prisma.resolution.findMany({
      where: { petitionerId: user.id },
      include: { committee: true, conference: true },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "COMMITTEE_CHAIR") {
    // Find committees where this user is chair
    const memberships = await prisma.committeeMembership.findMany({
      where: { userId: user.id, isChair: true },
      select: { committeeId: true },
    });
    const committeeIds = memberships.map((m) => m.committeeId);

    resolutions = await prisma.resolution.findMany({
      where: { committeeId: { in: committeeIds } },
      include: { committee: true, conference: true, petitioner: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // SECRETARY or ADMIN — return all
    resolutions = await prisma.resolution.findMany({
      include: { committee: true, conference: true, petitioner: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(resolutions);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title_en, title_es, text_en, text_es, rationale_en, rationale_es, conferenceId } = body;

  let conference;
  if (conferenceId) {
    conference = await prisma.conference.findUnique({ where: { id: conferenceId } });
  } else {
    conference = await prisma.conference.findFirst({ where: { isActive: true } });
  }
  if (!conference) {
    return NextResponse.json({ error: "No active conference found" }, { status: 404 });
  }

  const resolution = await prisma.resolution.create({
    data: {
      title_en: title_en ?? null,
      title_es: title_es ?? null,
      text_en: text_en ?? null,
      text_es: text_es ?? null,
      rationale_en: rationale_en ?? null,
      rationale_es: rationale_es ?? null,
      conferenceId: conference.id,
      petitionerId: user.id,
      status: "DRAFT",
    },
  });

  return NextResponse.json(resolution, { status: 201 });
}
