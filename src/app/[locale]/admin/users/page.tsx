"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  church: string | null;
  memberType: string | null;
  preferredLocale: string;
  createdAt: string;
  _count: { resolutions: number };
}

const ROLES = ["PETITIONER", "COMMITTEE_CHAIR", "SECRETARY", "ADMIN"] as const;
const MEMBER_TYPES = ["LAY", "CLERGY"] as const;
const LOCALES = ["EN", "ES"] as const;

const ROLE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ADMIN: "default",
  SECRETARY: "secondary",
  COMMITTEE_CHAIR: "outline",
  PETITIONER: "outline",
};

function UserForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
  t,
}: {
  initial?: Partial<User>;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [role, setRole] = useState(initial?.role || "PETITIONER");
  const [church, setChurch] = useState(initial?.church || "");
  const [memberType, setMemberType] = useState(initial?.memberType || "");
  const [preferredLocale, setPreferredLocale] = useState(initial?.preferredLocale || "EN");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data: Record<string, string> = { name, email, role, church, memberType, preferredLocale };
      if (password) data.password = password;
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("name")}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>{t("email")}</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>{t("role")}</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>{t(`role_${r}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("church")}</Label>
          <Input value={church} onChange={(e) => setChurch(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("memberType")}</Label>
          <Select value={memberType || "none"} onValueChange={(v) => setMemberType(v === "none" ? "" : v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">—</SelectItem>
              {MEMBER_TYPES.map((mt) => (
                <SelectItem key={mt} value={mt}>{t(`member_${mt}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("locale")}</Label>
          <Select value={preferredLocale} onValueChange={setPreferredLocale}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LOCALES.map((l) => (
                <SelectItem key={l} value={l}>{l === "EN" ? "English" : "Español"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>{initial ? t("newPassword") : t("password")}</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!initial}
          placeholder={initial ? t("leaveBlank") : ""}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>{t("cancel")}</Button>
        <Button type="submit" disabled={loading}>
          {loading ? t("saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default function AdminUsersPage() {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const role = (session?.user as { role?: string })?.role;

  useEffect(() => {
    if (session && role !== "ADMIN") {
      router.push(`/${locale}/dashboard`);
    }
  }, [session, role, router, locale]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: Record<string, string>) {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || t("createError"));
      return;
    }
    toast.success(t("userCreated"));
    setCreateOpen(false);
    fetchUsers();
  }

  async function handleUpdate(data: Record<string, string>) {
    if (!editUser) return;
    const res = await fetch(`/api/admin/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || t("updateError"));
      return;
    }
    toast.success(t("userUpdated"));
    setEditUser(null);
    fetchUsers();
  }

  async function handleDelete(user: User) {
    if (!confirm(t("confirmDelete", { name: user.name }))) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || t("deleteError"));
      return;
    }
    toast.success(t("userDeleted"));
    fetchUsers();
  }

  if (role !== "ADMIN") return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>{t("createUser")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("createUser")}</DialogTitle>
            </DialogHeader>
            <UserForm
              onSubmit={handleCreate}
              onCancel={() => setCreateOpen(false)}
              submitLabel={t("createUser")}
              t={t}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("allUsers", { count: users.length })}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("role")}</TableHead>
                    <TableHead>{t("church")}</TableHead>
                    <TableHead className="text-center">{t("resolutions")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={ROLE_VARIANT[user.role] || "outline"}>
                          {t(`role_${user.role}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.church || "—"}</TableCell>
                      <TableCell className="text-center">{user._count.resolutions}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditUser(user)}
                          >
                            {t("edit")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(user)}
                          >
                            {t("delete")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("editUser")}</DialogTitle>
          </DialogHeader>
          {editUser && (
            <UserForm
              initial={editUser}
              onSubmit={handleUpdate}
              onCancel={() => setEditUser(null)}
              submitLabel={t("saveChanges")}
              t={t}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
