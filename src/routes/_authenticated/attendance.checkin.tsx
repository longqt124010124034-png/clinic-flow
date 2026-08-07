import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import {
  Fingerprint,
  Smartphone,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Camera,
  Loader,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-state";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/attendance/checkin")({
  head: () => ({
    meta: [
      { title: "Chấm công thực tế - Việt Smile Clinic Suite" },
      {
        name: "description",
        content: "Thực hiện chấm công bằng vân tay, khuôn mặt hoặc thủ công.",
      },
    ],
  }),
  component: AttendanceCheckInPage,
});

type BiometricMethod = "fingerprint" | "face" | "manual";

type CheckInRecord = {
  id: string;
  employee_id: string;
  timestamp: string;
  method: BiometricMethod;
  device_id: string | null;
  latitude: number | null;
  longitude: number | null;
  checked_by_user_id: string | null;
  employee: {
    full_name: string;
    employee_code: string;
    avatar_url: string | null;
  };
};

function AttendanceCheckInPage() {
  const [activeMethod, setActiveMethod] = useState<BiometricMethod>("fingerprint");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const queryClient = useQueryClient();

  // Get current user's employee record
  const { data: myEmployee } = useQuery({
    queryKey: ["current-employee"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.email) return null;

      const { data } = await supabase
        .from("employees")
        .select("id, full_name, employee_code, avatar_url, organization_id, department:departments(name)")
        .eq("email", userData.user.email)
        .single();

      return data;
    },
  });

  // Get today's check-ins for current employee
  const { data: todayCheckIns } = useQuery({
    queryKey: ["today-checkins", myEmployee?.id],
    queryFn: async () => {
      if (!myEmployee?.id) return null;

      const today = new Date().toISOString().split("T")[0] ?? "";
      const { data } = await supabase
        .from("attendance_records")
        .select(
          "id, check_in_time, check_out_time, attendance_status, worked_minutes"
        )
        .eq("employee_id", myEmployee.id)
        .eq("work_date", today)
        .maybeSingle();

      return data;
    },
    enabled: !!myEmployee?.id,
    refetchInterval: 5000, // Real-time refresh every 5 seconds
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      if (!myEmployee?.id) throw new Error("Không tìm thấy hồ sơ nhân viên");

      const today = new Date().toISOString().split("T")[0] ?? "";
      const now = new Date();

      // Check if already checked in today
      const { data: existingRecord } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("employee_id", myEmployee.id)
        .eq("work_date", today)
        .maybeSingle();

      if (existingRecord?.check_in_time && !existingRecord?.check_out_time) {
        throw new Error("Đã chấm công vào hôm nay");
      }

      // Get geolocation if available
      let latitude: number | null = null;
      let longitude: number | null = null;

      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
            });
          });
          latitude = (position as GeolocationPosition).coords.latitude;
          longitude = (position as GeolocationPosition).coords.longitude;
        } catch (err) {
          console.log("[v0] Geolocation not available:", err);
        }
      }

      // Create or update attendance record
      if (existingRecord) {
        const { error } = await supabase
          .from("attendance_records")
          .update({
            check_out_time: now.toISOString(),
            attendance_status: "present",
            updated_at: now.toISOString(),
          })
          .eq("id", existingRecord.id);

        if (error) throw error;

        return { type: "checkout", message: "Chấm công ra thành công!" };
      } else {
        const { error } = await supabase.from("attendance_records").insert([
          {
            employee_id: myEmployee.id,
            organization_id: myEmployee.organization_id,
            work_date: today,
            check_in_time: now.toISOString(),
            attendance_status: "present",
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          },
        ]);

        if (error) throw error;

        return { type: "checkin", message: "Chấm công vào thành công!" };
      }
    },
    onSuccess: (result) => {
      setScanResult({ success: true, message: result.message });
      queryClient.invalidateQueries({ queryKey: ["today-checkins"] });
      setTimeout(() => setScanResult(null), 3000);
    },
    onError: (error) => {
      setScanResult({
        success: false,
        message: (error as Error).message || "Lỗi chấm công",
      });
    },
  });

  const handleFingerprintScan = async () => {
    setIsScanning(true);
    try {
      // Simulate fingerprint scan - in production, integrate with actual biometric devices
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() > 0.1) {
        // 90% success rate for demo
        await checkInMutation.mutateAsync();
      } else {
        setScanResult({ success: false, message: "Vân tay không khớp, vui lòng thử lại" });
      }
    } catch (err) {
      console.log("[v0] Fingerprint scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFaceScan = async () => {
    setIsScanning(true);
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Simulate face detection - in production, integrate with ML Kit or similar
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Stop the stream
        stream.getTracks().forEach((track) => track.stop());

        if (Math.random() > 0.15) {
          // 85% success rate for demo
          await checkInMutation.mutateAsync();
        } else {
          setScanResult({ success: false, message: "Không nhận diện được khuôn mặt" });
        }
      }
    } catch (err) {
      setScanResult({
        success: false,
        message: "Không thể truy cập camera: " + (err as Error).message,
      });
      console.log("[v0] Face scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Chấm công thực tế"
        description="Sử dụng vân tay, khuôn mặt hoặc chấm công thủ công để ghi nhận có mặt."
      />

      {/* Current Status Card */}
      {myEmployee && (
        <Card className="surface-card mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {myEmployee.avatar_url ? (
                <img
                  src={myEmployee.avatar_url}
                  alt={myEmployee.full_name}
                  className="size-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="size-8 text-primary" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{myEmployee.full_name}</h3>
                <p className="text-sm text-muted-foreground">{myEmployee.employee_code}</p>
                {myEmployee.department && (
                  <p className="text-sm text-muted-foreground">{myEmployee.department.name}</p>
                )}
              </div>
            </div>

            {todayCheckIns && (
              <div className="text-right">
                {todayCheckIns.check_in_time && todayCheckIns.check_out_time ? (
                  <div>
                    <Badge className="mb-2 bg-green-100 text-green-800">Đã hoàn thành</Badge>
                    <p className="text-sm text-muted-foreground">
                      Vào: {new Date(todayCheckIns.check_in_time).toLocaleTimeString("vi-VN")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ra: {new Date(todayCheckIns.check_out_time).toLocaleTimeString("vi-VN")}
                    </p>
                  </div>
                ) : todayCheckIns.check_in_time ? (
                  <div>
                    <Badge className="mb-2 bg-blue-100 text-blue-800">Đã vào</Badge>
                    <p className="text-sm text-muted-foreground">
                      Vào: {new Date(todayCheckIns.check_in_time).toLocaleTimeString("vi-VN")}
                    </p>
                  </div>
                ) : (
                  <Badge className="mb-2 bg-yellow-100 text-yellow-800">Chưa chấm công</Badge>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Scan Result */}
      {scanResult && (
        <Card
          className={`surface-card mb-6 p-4 border-l-4 ${
            scanResult.success
              ? "border-l-green-500 bg-green-50"
              : "border-l-red-500 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {scanResult.success ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : (
              <AlertCircle className="size-5 text-red-600" />
            )}
            <div>
              <p className={scanResult.success ? "text-green-800" : "text-red-800"}>
                {scanResult.message}
              </p>
              {scanResult.success && (
                <p className="text-xs text-green-700">
                  Lúc: {new Date().toLocaleTimeString("vi-VN")}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Method Selector */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {/* Fingerprint Method */}
        <Card
          className={`surface-card cursor-pointer p-6 transition-all ${
            activeMethod === "fingerprint"
              ? "border-2 border-primary bg-primary/5"
              : "border border-border hover:border-primary/50"
          }`}
          onClick={() => setActiveMethod("fingerprint")}
        >
          <div className="mb-4 flex size-14 items-center justify-center rounded-lg bg-blue-100">
            <Fingerprint className="size-7 text-blue-600" />
          </div>
          <h3 className="font-semibold">Vân tay</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Quét vân tay trên máy chấm công
          </p>

          {activeMethod === "fingerprint" && (
            <Button
              onClick={() => handleFingerprintScan()}
              disabled={isScanning || checkInMutation.isPending}
              className="mt-4 w-full"
            >
              {isScanning || checkInMutation.isPending ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  Đang quét...
                </>
              ) : (
                <>
                  <Fingerprint className="mr-2 size-4" />
                  Quét vân tay
                </>
              )}
            </Button>
          )}
        </Card>

        {/* Face Recognition Method */}
        <Card
          className={`surface-card cursor-pointer p-6 transition-all ${
            activeMethod === "face"
              ? "border-2 border-primary bg-primary/5"
              : "border border-border hover:border-primary/50"
          }`}
          onClick={() => setActiveMethod("face")}
        >
          <div className="mb-4 flex size-14 items-center justify-center rounded-lg bg-purple-100">
            <Camera className="size-7 text-purple-600" />
          </div>
          <h3 className="font-semibold">Khuôn mặt</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Nhận diện khuôn mặt qua camera
          </p>

          {activeMethod === "face" && (
            <>
              <video
                ref={videoRef}
                autoPlay
                className="mt-4 w-full rounded-lg bg-black"
                style={{ maxHeight: "200px" }}
              />
              <Button
                onClick={() => handleFaceScan()}
                disabled={isScanning || checkInMutation.isPending}
                className="mt-4 w-full"
              >
                {isScanning || checkInMutation.isPending ? (
                  <>
                    <Loader className="mr-2 size-4 animate-spin" />
                    Đang quét...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 size-4" />
                    Quét khuôn mặt
                  </>
                )}
              </Button>
            </>
          )}
        </Card>

        {/* Manual Method */}
        <Card
          className={`surface-card cursor-pointer p-6 transition-all ${
            activeMethod === "manual"
              ? "border-2 border-primary bg-primary/5"
              : "border border-border hover:border-primary/50"
          }`}
          onClick={() => setActiveMethod("manual")}
        >
          <div className="mb-4 flex size-14 items-center justify-center rounded-lg bg-green-100">
            <Smartphone className="size-7 text-green-600" />
          </div>
          <h3 className="font-semibold">Chấm công thủ công</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Nhấn nút để chấm công ngay
          </p>

          {activeMethod === "manual" && (
            <Button
              onClick={() => checkInMutation.mutateAsync()}
              disabled={isScanning || checkInMutation.isPending}
              className="mt-4 w-full"
            >
              {checkInMutation.isPending ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 size-4" />
                  Chấm công ngay
                </>
              )}
            </Button>
          )}
        </Card>
      </div>

      {/* Safety Warning */}
      <Card className="surface-card border-l-4 border-l-yellow-500 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          <strong>Lưu ý bảo mật:</strong> Chỉ sử dụng hệ thống chấm công của bạn để ghi nhận sự có mặt của chính mình. Cố gắng chấm công cho người khác bằng bất kỳ phương pháp nào sẽ bị ghi lại và có thể dẫn đến kỷ luật.
        </p>
      </Card>
    </div>
  );
}
