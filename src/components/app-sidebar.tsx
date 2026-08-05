import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { visibleNavGroups, type AppRole } from "@/lib/permissions";

type AppSidebarProps = {
  roles: AppRole[];
  clinicName: string;
  logoUrl: string | null;
};

export function AppSidebar({ roles, clinicName, logoUrl }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const groups = visibleNavGroups(roles);

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-1 py-2">
          <div className="brand-gradient flex size-9 shrink-0 items-center justify-center rounded-xl">
            {logoUrl ? (
              <img src={logoUrl} alt={clinicName} className="size-9 rounded-xl object-cover" />
            ) : (
              <Sparkles className="size-4 text-primary-foreground" />
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{clinicName}</p>
              <p className="truncate text-xs text-muted-foreground">Quản lý phòng khám</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={isActive(item.to)} tooltip={item.title}>
                      <Link to={item.to} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
