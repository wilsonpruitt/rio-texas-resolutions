import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireMinRole } from "@/lib/auth-helpers";
import type { UserRole, MemberType, Locale } from "@/generated/prisma/client";

export async function GET() {
  const { error, status } = await requireMinRole("ADMIN");
  if (error) return NextResponse.json({ error }, { status });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      church: true,
      memberType: true,
      preferredLocale: true,
      createdAt: true,
      _count: { select: { resolutions: true } },
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { error, status } = await requireMinRole("ADMIN");
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { email, name, password, role, church, memberType, preferredLocale } = body as {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    church?: string;
    memberType?: MemberType;
    preferredLocale?: Locale;
  };

  if (!email || !name || !password || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role,
      church: church || null,
      memberType: memberType || null,
      preferredLocale: preferredLocale || "EN",
    },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json(user, { status: 201 });
}
