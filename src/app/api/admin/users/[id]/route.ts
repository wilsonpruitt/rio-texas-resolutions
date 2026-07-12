import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireMinRole } from "@/lib/auth-helpers";
import type { UserRole, MemberType, Locale } from "@/generated/prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, status } = await requireMinRole("ADMIN");
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;
  const body = await req.json();
  const { name, email, role, church, memberType, preferredLocale, password } = body as {
    name?: string;
    email?: string;
    role?: UserRole;
    church?: string;
    memberType?: MemberType;
    preferredLocale?: Locale;
    password?: string;
  };

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (role !== undefined) data.role = role;
  if (church !== undefined) data.church = church || null;
  if (memberType !== undefined) data.memberType = memberType || null;
  if (preferredLocale !== undefined) data.preferredLocale = preferredLocale;
  if (password) data.passwordHash = await hash(password, 10);

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, status, user } = await requireMinRole("ADMIN");
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;

  // Prevent self-deletion
  if (user!.id === id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
