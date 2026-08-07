import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  Filter,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  User,
  X,
} from "lucide-react";

import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/page-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/_authenticated/appointments/calendar")({
  head: () => ({
    meta: [
      { title: "Lịch hẹn — Việt Smile Clinic Suite" },
      {
        name: "description",
        content: "Xem lịch hẹn toàn phòng khám, quản lý và xác nhận hẹn.",
      },
      {
        property: "og:title",
        content: "Lịch hẹn — Việt Smile Clinic Suite",
      },
    ],
  }),
  component: AppointmentsCalendarPage,
});

type Appointment = {
  id: string;
  appointment_date: string;
  start_time: string;
  patient_name: string;
  patient_phone: string;
  service_name: string;
  status: "scheduled" | "confirmed" | "cancelled" | "no_show" | "completed";
  notes: string | null;
  reminder_sent: boolean;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  scheduled: {
    label: "Đã đặt",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  cancelled: {
    label: "Hủy",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  no_show: {
    label: "Không đến",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  completed: {
    label: "Hoàn tất",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
  },
};

function AppointmentsCalendarPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] ?? "",
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const appointments = useQuery({
    queryKey: ["appointments-calendar", selectedDate, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("appointments")
        .select(
          "id, appointment_date, start_time, patient:patients(full_name, phone), services(name), status, notes, reminder_sent",
        )
        .eq("appointment_date", selectedDate)
        .order("start_time", { ascending: true });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (
        data?.map((item: any) => ({
          ...item,
          patient_name: item.patient?.full_name || "—",
          patient_phone: item.patient?.phone || "—",
          service_name: item.services?.name || "—",
        })) || []
      );
    },
  });

  const stats = useQuery({
    queryKey: ["appointments-stats", selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("status", { count: "exact" })
        .eq("appointment_date", selectedDate);

      if (error) throw error;

      const records = (data as Array<{ status: string }>) || [];
      const counts = {
        scheduled: records.filter((r) => r.status === "scheduled").length,
        confirmed: records.filter((r) => r.status === "confirmed").length,
        completed: records.filter((r) => r.status === "completed").length,
      };

      return {
        total: records.length,
        ...counts,
      };
    },
  });

  const filtered = (appointments.data ?? []).filter((record) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      record.patient_name.toLowerCase().includes(term) ||
      record.patient_phone.includes(term)
    );
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <div>
      <PageHeader
        title="Lịch hẹn"
        description="Xem tất cả lịch hẹn trong ngày, xác nhận và quản lý trạng thái."
        actions={
          <Button>
            <Plus className="mr-2 size-4" />
            Tạo hẹn mới
          </Button>
        }
      />

      {/* Stats */}
      {stats.isLoading ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="surface-card h-20 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : stats.data ? (
        <section className="mb-6 grid gap-4 sm:grid-cols-4">
          <StatCard
            icon={<Calendar className="size-5" />}
            label="Tổng hẹn"
            value={stats.data.total}
          />
          <StatCard
            icon={<Clock className="size-5 text-blue-600" />}
            label="Chưa xác nhận"
            value={stats.data.scheduled}
          />
          <StatCard
            icon={<Check className="size-5 text-green-600" />}
            label="Đã xác nhận"
            value={stats.data.confirmed}
            color="green"
          />
          <StatCard
            icon={<MessageSquare className="size-5 text-slate-600" />}
            label="Hoàn tất"
            value={stats.data.completed}
            color="slate"
          />
        </section>
      ) : null}

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">Chọn ngày</label>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">Tìm kiếm</label>
          <div className="relative">
            <Input
              placeholder="Tìm theo tên hoặc số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">Lọc trạng thái</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả trạng thái</SelectItem>
              <SelectItem value="scheduled">Chưa xác nhận</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="completed">Hoàn tất</SelectItem>
              <SelectItem value="cancelled">Hủy</SelectItem>
              <SelectItem value="no_show">Không đến</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Appointments List */}
      {appointments.isLoading ? (
        <LoadingState rows={6} />
      ) : appointments.isError ? (
        <ErrorState description={(appointments.error as Error).message} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Không có lịch hẹn"
          description="Không có lịch hẹn cho ngày này."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((appointment) => (
            <Card
              key={appointment.id}
              className="surface-card border-l-4 border-l-blue-500 p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{appointment.patient_name}</p>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="size-3.5" />
                          {appointment.patient_phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {formatTime(appointment.start_time)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.service_name}</p>
                    <Badge
                      className={`mt-1 ${STATUS_CONFIG[appointment.status]?.bgColor} ${STATUS_CONFIG[appointment.status]?.color}`}
                    >
                      {STATUS_CONFIG[appointment.status]?.label}
                    </Badge>
                  </div>

                  {appointment.status === "scheduled" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Check className="size-3.5" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {appointment.notes && (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Ghi chú:</span> {appointment.notes}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: "blue" | "green" | "slate";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    slate: "bg-slate-50 text-slate-600",
  };

  return (
    <Card className="surface-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
