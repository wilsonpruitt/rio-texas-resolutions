import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { UserRole } from "@/generated/prisma/client";

const ROLE_HIERARCHY: UserRole[] = [
  "PETITIONER",
  "COMMITTEE_CHAIR",
  "SECRETARY",
  "ADMIN",
];

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export function hasMinRole(userRole: UserRole, minRole: UserRole): boolean {
  return ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(minRole);
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export async function requireMinRole(minRole: UserRole) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized", status: 401 as const, user: null };
  }
  if (!hasMinRole(user.role as UserRole, minRole)) {
    return { error: "Forbidden", status: 403 as const, user: null };
  }
  return { error: null, status: 200 as const, user };
}
