import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  Fingerprint,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Việt Smile Clinic Suite — Quản lý nha khoa" },
      {
        name: "description",
        content:
          "Phần mềm nội bộ cho phòng khám nha khoa: chấm công, hồ sơ nhân sự, lịch hẹn và nhắc lịch khách hàng.",
      },
      { property: "og:title", content: "Việt Smile Clinic Suite — Quản lý nha khoa" },
      {
        property: "og:description",
        content:
          "Chấm công tự động, hồ sơ nhân viên chi tiết, lịch hẹn và nhắc lịch cho phòng khám nha khoa.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Fingerprint,
    title: "Chấm công tự động",
    text: "Đồng bộ dữ liệu máy chấm công, tính công, đi trễ, về sớm và tăng ca.",
  },
  {
    icon: Users,
    title: "Hồ sơ nhân sự",
    text: "Thông tin cá nhân, hợp đồng, chứng chỉ hành nghề và ca làm việc.",
  },
  {
    icon: CalendarCheck,
    title: "Lịch hẹn khách hàng",
    text: "Đặt lịch, xác nhận, nhắc lịch và theo dõi trạng thái từng cuộc hẹn.",
  },
  {
    icon: FileSpreadsheet,
    title: "Báo cáo & Excel",
    text: "Bảng công tháng, báo cáo tăng ca và xuất Excel theo mẫu phòng khám.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="brand-gradient flex size-10 items-center justify-center rounded-xl">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Việt Smile Clinic Suite</p>
            <p className="text-xs text-muted-foreground">Hệ thống quản lý phòng khám nha khoa</p>
          </div>
        </div>
        <Button asChild>
          <Link to="/auth">Đăng nhập</Link>
        </Button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="surface-card overflow-hidden px-8 py-14 md:px-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="size-3.5" /> Dành cho nội bộ phòng khám
          </p>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Quản lý chấm công, nhân sự và lịch hẹn nha khoa trong một nơi duy nhất
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Hệ thống được thiết kế cho phòng khám nha khoa quy mô nhỏ: dễ dùng cho lễ tân, đủ chặt
            chẽ cho quản lý và an toàn cho dữ liệu khách hàng.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth">Bắt đầu sử dụng</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth" search={{ mode: "signup" }}>
                Tạo tài khoản quản trị
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="surface-card p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <feature.icon className="size-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold">{feature.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{feature.text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
