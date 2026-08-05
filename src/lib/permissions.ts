import type {
  LucideIcon,
} from "lucide-react";
import {
  Activity,
  BadgeCheck,
  Building2,
  CalendarDays,
  CalendarRange,
  ClipboardList,
  Clock,
  FileSpreadsheet,
  Fingerprint,
  Gauge,
  HeartPulse,
  History,
  LayoutDashboard,
  ListChecks,
  Radar,
  Settings,
  ShieldCheck,
  Stethoscope,
  Timer,
  UserCog,
  Users,
  UsersRound,
} from "lucide-react";

export const APP_ROLES = ["administrator", "manager", "receptionist", "employee"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_LABELS: Record<AppRole, string> = {
  administrator: "Quản trị viên",
  manager: "Quản lý phòng khám",
  receptionist: "Lễ tân",
  employee: "Nhân viên",
};

export type NavItem = {
  title: string;
  to: string;
  icon: LucideIcon;
  roles: AppRole[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

const ALL: AppRole[] = ["administrator", "manager", "receptionist", "employee"];
const STAFF: AppRole[] = ["administrator", "manager"];
const FRONT_DESK: AppRole[] = ["administrator", "manager", "receptionist"];
const ADMIN: AppRole[] = ["administrator"];

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      { title: "Bảng điều khiển", to: "/dashboard", icon: LayoutDashboard, roles: ALL },
    ],
  },
  {
    label: "Lịch hẹn",
    items: [
      { title: "Lịch hẹn", to: "/appointments/calendar", icon: CalendarDays, roles: FRONT_DESK },
      { title: "Danh sách hẹn", to: "/appointments", icon: ListChecks, roles: FRONT_DESK },
      { title: "Đặt hẹn khám", to: "/appointments/booking", icon: HeartPulse, roles: FRONT_DESK },
      { title: "Bệnh nhân", to: "/patients", icon: UsersRound, roles: FRONT_DESK },
    ],
  },
  {
    label: "Nhân sự",
    items: [
      { title: "Nhân viên", to: "/employees", icon: Users, roles: STAFF },
      { title: "Hồ sơ nhân viên", to: "/staff/profiles", icon: UserCog, roles: STAFF },
      { title: "Phòng ban", to: "/departments", icon: Building2, roles: STAFF },
      { title: "Chức danh", to: "/positions", icon: BadgeCheck, roles: STAFF },
      { title: "Ca làm việc", to: "/shifts", icon: Clock, roles: STAFF },
    ],
  },
  {
    label: "Chấm công",
    items: [
      { title: "Chấm công theo ngày", to: "/attendance/daily", icon: CalendarRange, roles: STAFF },
      { title: "Bảng công tháng", to: "/attendance/monthly", icon: FileSpreadsheet, roles: STAFF },
      { title: "Dữ liệu máy chấm công", to: "/attendance/logs", icon: Fingerprint, roles: STAFF },
      { title: "Điều chỉnh công", to: "/attendance/adjustments", icon: ClipboardList, roles: STAFF },
      { title: "Tăng ca", to: "/attendance/overtime", icon: Timer, roles: STAFF },
    ],
  },
  {
    label: "Báo cáo",
    items: [
      { title: "Báo cáo chấm công", to: "/reports/attendance", icon: Gauge, roles: STAFF },
      { title: "Báo cáo lịch hẹn", to: "/reports/appointments", icon: Activity, roles: FRONT_DESK },
      { title: "Xuất báo cáo", to: "/reports/export", icon: FileSpreadsheet, roles: STAFF },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { title: "Máy chấm công", to: "/system/devices", icon: Stethoscope, roles: ADMIN },
      { title: "Trạng thái đồng bộ", to: "/system/sync", icon: Radar, roles: ADMIN },
      { title: "Hồ sơ phòng khám", to: "/system/clinic-profile", icon: Building2, roles: STAFF },
      { title: "Tài khoản người dùng", to: "/system/users", icon: UserCog, roles: ADMIN },
      { title: "Cài đặt hệ thống", to: "/system/settings", icon: Settings, roles: ADMIN },
      { title: "Nhật ký hoạt động", to: "/system/audit-logs", icon: History, roles: STAFF },
    ],
  },
];

export const ROLE_ICON = ShieldCheck;

export function hasAnyRole(roles: AppRole[], allowed: AppRole[]) {
  return roles.some((role) => allowed.includes(role));
}

/** Highest-privilege role first, used for display. */
export function primaryRole(roles: AppRole[]): AppRole {
  return APP_ROLES.find((role) => roles.includes(role)) ?? "employee";
}

export function visibleNavGroups(roles: AppRole[]): NavGroup[] {
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasAnyRole(roles, item.roles)),
  })).filter((group) => group.items.length > 0);
}

export function routeRoles(pathname: string): AppRole[] | null {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname === item.to || pathname.startsWith(`${item.to}/`)) return item.roles;
    }
  }
  return null;
}
