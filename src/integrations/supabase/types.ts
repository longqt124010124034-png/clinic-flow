export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string
          group_key: string
          id: string
          organization_id: string
          setting_key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          group_key: string
          id?: string
          organization_id: string
          setting_key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          group_key?: string
          id?: string
          organization_id?: string
          setting_key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_adjustments: {
        Row: {
          adjusted_value: string | null
          adjustment_type: string
          approved_by: string | null
          attendance_id: string | null
          created_at: string
          deleted_at: string | null
          employee_id: string
          id: string
          organization_id: string
          reason: string
          requested_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          adjusted_value?: string | null
          adjustment_type: string
          approved_by?: string | null
          attendance_id?: string | null
          created_at?: string
          deleted_at?: string | null
          employee_id: string
          id?: string
          organization_id: string
          reason: string
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          adjusted_value?: string | null
          adjustment_type?: string
          approved_by?: string | null
          attendance_id?: string | null
          created_at?: string
          deleted_at?: string | null
          employee_id?: string
          id?: string
          organization_id?: string
          reason?: string
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_adjustments_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "attendance_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_adjustments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_adjustments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          approval_notes: string | null
          attendance_status: string
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          deleted_at: string | null
          device_check_in_time: string | null
          device_check_out_time: string | null
          early_leave_minutes: number | null
          employee_id: string
          id: string
          is_approved: boolean
          late_minutes: number | null
          organization_id: string
          overtime_minutes: number | null
          paid_break_minutes: number | null
          shift_id: string | null
          unpaid_break_minutes: number | null
          updated_at: string
          work_date: string
          worked_minutes: number | null
        }
        Insert: {
          approval_notes?: string | null
          attendance_status?: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          deleted_at?: string | null
          device_check_in_time?: string | null
          device_check_out_time?: string | null
          early_leave_minutes?: number | null
          employee_id: string
          id?: string
          is_approved?: boolean
          late_minutes?: number | null
          organization_id: string
          overtime_minutes?: number | null
          paid_break_minutes?: number | null
          shift_id?: string | null
          unpaid_break_minutes?: number | null
          updated_at?: string
          work_date: string
          worked_minutes?: number | null
        }
        Update: {
          approval_notes?: string | null
          attendance_status?: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          deleted_at?: string | null
          device_check_in_time?: string | null
          device_check_out_time?: string | null
          early_leave_minutes?: number | null
          employee_id?: string
          id?: string
          is_approved?: boolean
          late_minutes?: number | null
          organization_id?: string
          overtime_minutes?: number | null
          paid_break_minutes?: number | null
          shift_id?: string | null
          unpaid_break_minutes?: number | null
          updated_at?: string
          work_date?: string
          worked_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_summary: {
        Row: {
          absent_days: number
          computed_at: string
          early_leave_count: number
          employee_id: string
          holiday_days: number
          id: string
          late_count: number
          leave_days: number
          month: number
          organization_id: string
          present_days: number
          sick_days: number
          total_overtime_minutes: number
          total_worked_minutes: number
          total_working_days: number
          updated_at: string
          year: number
        }
        Insert: {
          absent_days?: number
          computed_at?: string
          early_leave_count?: number
          employee_id: string
          holiday_days?: number
          id?: string
          late_count?: number
          leave_days?: number
          month: number
          organization_id: string
          present_days?: number
          sick_days?: number
          total_overtime_minutes?: number
          total_worked_minutes?: number
          total_working_days?: number
          updated_at?: string
          year: number
        }
        Update: {
          absent_days?: number
          computed_at?: string
          early_leave_count?: number
          employee_id?: string
          holiday_days?: number
          id?: string
          late_count?: number
          leave_days?: number
          month?: number
          organization_id?: string
          present_days?: number
          sick_days?: number
          total_overtime_minutes?: number
          total_worked_minutes?: number
          total_working_days?: number
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "attendance_summary_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_summary_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_name: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          organization_id: string
          previous_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          organization_id: string
          previous_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          organization_id?: string
          previous_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_profiles: {
        Row: {
          address: string | null
          appointment_phone: string | null
          attendance_policy: string | null
          city: string | null
          cover_url: string | null
          created_at: string
          date_format: string
          description: string | null
          district: string | null
          email: string | null
          facebook: string | null
          favicon_url: string | null
          footer_info: string | null
          grace_period_minutes: number
          hotline: string | null
          id: string
          language: string
          legal_name: string | null
          logo_url: string | null
          lunch_break: string | null
          manager_name: string | null
          maps_url: string | null
          name: string
          organization_id: string
          overtime_policy: string | null
          phone: string | null
          reminder_policy: string | null
          representative_name: string | null
          short_name: string | null
          tax_code: string | null
          time_format: string
          timezone: string
          updated_at: string
          ward: string | null
          website: string | null
          weekly_days_off: string | null
          working_hours: string | null
          zalo: string | null
        }
        Insert: {
          address?: string | null
          appointment_phone?: string | null
          attendance_policy?: string | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          date_format?: string
          description?: string | null
          district?: string | null
          email?: string | null
          facebook?: string | null
          favicon_url?: string | null
          footer_info?: string | null
          grace_period_minutes?: number
          hotline?: string | null
          id?: string
          language?: string
          legal_name?: string | null
          logo_url?: string | null
          lunch_break?: string | null
          manager_name?: string | null
          maps_url?: string | null
          name: string
          organization_id: string
          overtime_policy?: string | null
          phone?: string | null
          reminder_policy?: string | null
          representative_name?: string | null
          short_name?: string | null
          tax_code?: string | null
          time_format?: string
          timezone?: string
          updated_at?: string
          ward?: string | null
          website?: string | null
          weekly_days_off?: string | null
          working_hours?: string | null
          zalo?: string | null
        }
        Update: {
          address?: string | null
          appointment_phone?: string | null
          attendance_policy?: string | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          date_format?: string
          description?: string | null
          district?: string | null
          email?: string | null
          facebook?: string | null
          favicon_url?: string | null
          footer_info?: string | null
          grace_period_minutes?: number
          hotline?: string | null
          id?: string
          language?: string
          legal_name?: string | null
          logo_url?: string | null
          lunch_break?: string | null
          manager_name?: string | null
          maps_url?: string | null
          name?: string
          organization_id?: string
          overtime_policy?: string | null
          phone?: string | null
          reminder_policy?: string | null
          representative_name?: string | null
          short_name?: string | null
          tax_code?: string | null
          time_format?: string
          timezone?: string
          updated_at?: string
          ward?: string | null
          website?: string | null
          weekly_days_off?: string | null
          working_hours?: string | null
          zalo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinic_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      device_configs: {
        Row: {
          auto_sync_enabled: boolean
          connection_method: string
          created_at: string
          device_ip_address: string | null
          device_password_encrypted: string | null
          device_port: number | null
          device_type: string
          device_username: string | null
          id: string
          is_connected: boolean
          last_sync_time: string | null
          last_test_time: string | null
          organization_id: string
          sync_interval_minutes: number
          test_result: string | null
          updated_at: string
        }
        Insert: {
          auto_sync_enabled?: boolean
          connection_method?: string
          created_at?: string
          device_ip_address?: string | null
          device_password_encrypted?: string | null
          device_port?: number | null
          device_type?: string
          device_username?: string | null
          id?: string
          is_connected?: boolean
          last_sync_time?: string | null
          last_test_time?: string | null
          organization_id: string
          sync_interval_minutes?: number
          test_result?: string | null
          updated_at?: string
        }
        Update: {
          auto_sync_enabled?: boolean
          connection_method?: string
          created_at?: string
          device_ip_address?: string | null
          device_password_encrypted?: string | null
          device_port?: number | null
          device_type?: string
          device_username?: string | null
          id?: string
          is_connected?: boolean
          last_sync_time?: string | null
          last_test_time?: string | null
          organization_id?: string
          sync_interval_minutes?: number
          test_result?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_configs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      device_sync_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_seconds: number | null
          error_message: string | null
          id: string
          organization_id: string
          records_failed: number
          records_found: number
          records_imported: number
          records_skipped: number
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          organization_id: string
          records_failed?: number
          records_found?: number
          records_imported?: number
          records_skipped?: number
          started_at?: string
          status: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          organization_id?: string
          records_failed?: number
          records_found?: number
          records_imported?: number
          records_skipped?: number
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_sync_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      device_sync_mappings: {
        Row: {
          created_at: string
          device_user_id: string
          employee_id: string | null
          id: string
          is_active: boolean
          last_sync_time: string | null
          organization_id: string
          sync_error: string | null
          sync_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_user_id: string
          employee_id?: string | null
          id?: string
          is_active?: boolean
          last_sync_time?: string | null
          organization_id: string
          sync_error?: string | null
          sync_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_user_id?: string
          employee_id?: string | null
          id?: string
          is_active?: boolean
          last_sync_time?: string | null
          organization_id?: string
          sync_error?: string | null
          sync_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_sync_mappings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_sync_mappings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          appointment_display_name: string | null
          avatar_url: string | null
          can_receive_appointments: boolean
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string
          date_of_birth: string | null
          default_shift_id: string | null
          deleted_at: string | null
          department_id: string | null
          device_user_id: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employee_code: string
          employment_status: Database["public"]["Enums"]["employment_status"]
          employment_type: Database["public"]["Enums"]["employment_type"]
          full_name: string
          gender: string | null
          id: string
          internal_notes: string | null
          license_expiry_date: string | null
          license_issue_date: string | null
          license_number: string | null
          manager_id: string | null
          organization_id: string
          phone: string | null
          position_id: string | null
          preferred_name: string | null
          probation_end_date: string | null
          professional_title: string | null
          qualifications: string | null
          specialization: string | null
          start_date: string | null
          treatment_room: string | null
          updated_at: string
          user_id: string | null
          work_location: string | null
          years_of_experience: number | null
        }
        Insert: {
          address?: string | null
          appointment_display_name?: string | null
          avatar_url?: string | null
          can_receive_appointments?: boolean
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          default_shift_id?: string | null
          deleted_at?: string | null
          department_id?: string | null
          device_user_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employee_code: string
          employment_status?: Database["public"]["Enums"]["employment_status"]
          employment_type?: Database["public"]["Enums"]["employment_type"]
          full_name: string
          gender?: string | null
          id?: string
          internal_notes?: string | null
          license_expiry_date?: string | null
          license_issue_date?: string | null
          license_number?: string | null
          manager_id?: string | null
          organization_id: string
          phone?: string | null
          position_id?: string | null
          preferred_name?: string | null
          probation_end_date?: string | null
          professional_title?: string | null
          qualifications?: string | null
          specialization?: string | null
          start_date?: string | null
          treatment_room?: string | null
          updated_at?: string
          user_id?: string | null
          work_location?: string | null
          years_of_experience?: number | null
        }
        Update: {
          address?: string | null
          appointment_display_name?: string | null
          avatar_url?: string | null
          can_receive_appointments?: boolean
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          default_shift_id?: string | null
          deleted_at?: string | null
          department_id?: string | null
          device_user_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employee_code?: string
          employment_status?: Database["public"]["Enums"]["employment_status"]
          employment_type?: Database["public"]["Enums"]["employment_type"]
          full_name?: string
          gender?: string | null
          id?: string
          internal_notes?: string | null
          license_expiry_date?: string | null
          license_issue_date?: string | null
          license_number?: string | null
          manager_id?: string | null
          organization_id?: string
          phone?: string | null
          position_id?: string | null
          preferred_name?: string | null
          probation_end_date?: string | null
          professional_title?: string | null
          qualifications?: string | null
          specialization?: string | null
          start_date?: string | null
          treatment_room?: string | null
          updated_at?: string
          user_id?: string | null
          work_location?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_default_shift_id_fkey"
            columns: ["default_shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          can_receive_appointments: boolean
          created_at: string
          deleted_at: string | null
          department_id: string | null
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          can_receive_appointments?: boolean
          created_at?: string
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          can_receive_appointments?: boolean
          created_at?: string
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          break_end: string | null
          break_start: string | null
          code: string
          created_at: string
          crosses_midnight: boolean
          deleted_at: string | null
          early_checkin_window_minutes: number
          early_leave_threshold_minutes: number
          end_time: string
          grace_period_minutes: number
          id: string
          is_active: boolean
          late_threshold_minutes: number
          min_overtime_minutes: number
          name: string
          notes: string | null
          organization_id: string
          overtime_threshold_minutes: number
          paid_break: boolean
          start_time: string
          updated_at: string
          working_days: number[]
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          code: string
          created_at?: string
          crosses_midnight?: boolean
          deleted_at?: string | null
          early_checkin_window_minutes?: number
          early_leave_threshold_minutes?: number
          end_time: string
          grace_period_minutes?: number
          id?: string
          is_active?: boolean
          late_threshold_minutes?: number
          min_overtime_minutes?: number
          name: string
          notes?: string | null
          organization_id: string
          overtime_threshold_minutes?: number
          paid_break?: boolean
          start_time: string
          updated_at?: string
          working_days?: number[]
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          code?: string
          created_at?: string
          crosses_midnight?: boolean
          deleted_at?: string | null
          early_checkin_window_minutes?: number
          early_leave_threshold_minutes?: number
          end_time?: string
          grace_period_minutes?: number
          id?: string
          is_active?: boolean
          late_threshold_minutes?: number
          min_overtime_minutes?: number
          name?: string
          notes?: string | null
          organization_id?: string
          overtime_threshold_minutes?: number
          paid_break?: boolean
          start_time?: string
          updated_at?: string
          working_days?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "shifts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          organization_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          is_active?: boolean
          organization_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          organization_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_org_id: { Args: never; Returns: string }
      ensure_user_profile: {
        Args: never
        Returns: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          organization_id: string
          phone: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "user_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff_manager: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "administrator" | "manager" | "receptionist" | "employee"
      employment_status:
        | "probation"
        | "active"
        | "on_leave"
        | "suspended"
        | "terminated"
      employment_type: "full_time" | "part_time" | "contract" | "intern"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["administrator", "manager", "receptionist", "employee"],
      employment_status: [
        "probation",
        "active",
        "on_leave",
        "suspended",
        "terminated",
      ],
      employment_type: ["full_time", "part_time", "contract", "intern"],
    },
  },
} as const
