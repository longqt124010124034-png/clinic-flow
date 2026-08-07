import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/page-state";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/hooks/use-session";
import { APP_ROLES, ROLE_LABELS, type AppRole } from "@/lib/permissions";

export const Route = createFileRoute("/_authenticated/system/users")({
  head: () => ({
    meta: [
      { title: "Tài khoản người dùng — Việt Smile Clinic Suite" },
      { name: "description", content: "Quản lý vai trò của người dùng trong phòng khám." },
    ],
  }),
  component: SystemUsersPage,
});

type UserRow = {
  id: string;
  full_name: string;
  email: string | null;
  is_active: boolean;
  role: AppRole | null;
};

function SystemUsersPage() {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["system-users"],
    queryFn: async () => {
      const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] =
        await Promise.all([
          supabase
            .from("user_profiles")
            .select("id, full_name, email, is_active")
            .order("full_name"),
          supabase.from("user_roles").select("user_id, role"),
        ]);

      if (profilesError) throw profilesError;
      if (rolesError) throw rolesError;

      const roleByUser = new Map((roles || []).map((r) => [r.user_id, r.role as AppRole]));

      return (profiles || []).map((p) => ({
        id: p.id,
        full_name: p.full_name || "—",
        email: p.email,
        is_active: p.is_active,
        role: roleByUser.get(p.id) ?? null,
      })) as UserRow[];
    },
  });

  const setRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.rpc("admin_set_user_role", {
        target_user_id: userId,
        new_role: role,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã cập nhật vai trò");
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (usersQuery.isLoading) return <LoadingState rows={5} />;
  if (usersQuery.isError) return <ErrorState description={(usersQuery.error as Error).message} />;

  const users = usersQuery.data || [];

  return (
    <div>
      <PageHeader
        title="Tài khoản người dùng"
        description="Xem danh sách người dùng trong phòng khám và gán vai trò cho từng người."
      />

      {users.length === 0 ? (
        <EmptyState title="Chưa có người dùng" />
      ) : (
        <div className="surface-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Vai trò</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isSelf = user.id === session?.user.id;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.email || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {user.is_active ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role ?? ""}
                        disabled={isSelf || setRoleMutation.isPending}
                        onValueChange={(value) =>
                          setRoleMutation.mutate({ userId: user.id, role: value as AppRole })
                        }
                      >
                        <SelectTrigger className="w-44">
                          <ShieldCheck className="mr-2 size-4 text-muted-foreground" />
                          <SelectValue placeholder="Chưa gán vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          {APP_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {ROLE_LABELS[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isSelf && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Không thể tự đổi vai trò của chính mình
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
