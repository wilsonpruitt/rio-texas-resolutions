import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET(
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
    include: {
      committee: true,
      conference: true,
      petitioner: { select: { id: true, name: true, email: true, church: true } },
    },
  });

  if (!resolution) {
    return NextResponse.json({ error: "Resolution not found" }, { status: 404 });
  }

  return NextResponse.json(resolution);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resolution = await prisma.resolution.findUnique({ where: { id } });
  if (!resolution) {
    return NextResponse.json({ error: "Resolution not found" }, { status: 404 });
  }

  if (resolution.petitionerId !== user.id) {
    return NextResponse.json({ error: "Only the petitioner can update this resolution" }, { status: 403 });
  }

  if (resolution.status !== "DRAFT") {
    return NextResponse.json({ error: "Can only update resolutions in DRAFT status" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { title_en, title_es, text_en, text_es, rationale_en, rationale_es } = body;

  const updated = await prisma.resolution.update({
    where: { id },
    data: {
      ...(title_en !== undefined && { title_en }),
      ...(title_es !== undefined && { title_es }),
      ...(text_en !== undefined && { text_en }),
      ...(text_es !== undefined && { text_es }),
      ...(rationale_en !== undefined && { rationale_en }),
      ...(rationale_es !== undefined && { rationale_es }),
    },
  });

  return NextResponse.json(updated);
}
