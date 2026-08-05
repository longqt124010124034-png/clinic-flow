import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ErrorState, PermissionDenied } from "@/components/page-state";
import { useAuthSession, useClinicProfile, useSessionProfile } from "@/hooks/use-session";
import { hasAnyRole, routeRoles } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );
}

function AuthenticatedLayout() {
  const { session, ready } = useAuthSession();
  const profileQuery = useSessionProfile(session?.user.id);
  const clinicQuery = useClinicProfile(profileQuery.data?.organizationId);
  const pathname = useRouterState({ select: (router) => router.location.pathname });

  if (!ready || profileQuery.isLoading) return <FullPageLoader />;

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-lg">
          <ErrorState
            title="Không tải được hồ sơ người dùng"
            description={
              profileQuery.error instanceof Error
                ? profileQuery.error.message
                : "Vui lòng tải lại trang hoặc đăng nhập lại."
            }
          />
        </div>
      </div>
    );
  }

  const profile = profileQuery.data;
  const allowed = routeRoles(pathname);
  const permitted = allowed === null || hasAnyRole(profile.roles, allowed);

  return (
    <AppShell
      profile={profile}
      clinicName={clinicQuery.data?.short_name ?? clinicQuery.data?.name ?? "Phòng khám"}
      logoUrl={clinicQuery.data?.logo_url ?? null}
    >
      {permitted ? <Outlet /> : <PermissionDenied />}
    </AppShell>
  );
}
