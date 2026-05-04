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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          body: string | null
          created_at: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string | null
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          created_at?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string | null
          created_at?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          admin_notes: string | null
          companions: number | null
          concierge_id: string | null
          created_at: string | null
          doctor_id: string | null
          hospital_id: string | null
          id: string
          medical_summary: string | null
          package_id: string | null
          patient_id: string | null
          status: string | null
          total_amount: number | null
          travel_flexible: boolean | null
          travel_month: string | null
          treatment_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          companions?: number | null
          concierge_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          medical_summary?: string | null
          package_id?: string | null
          patient_id?: string | null
          status?: string | null
          total_amount?: number | null
          travel_flexible?: boolean | null
          travel_month?: string | null
          treatment_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          companions?: number | null
          concierge_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          medical_summary?: string | null
          package_id?: string | null
          patient_id?: string | null
          status?: string | null
          total_amount?: number | null
          travel_flexible?: boolean | null
          travel_month?: string | null
          treatment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_concierge_id_fkey"
            columns: ["concierge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          bio: string | null
          created_at: string | null
          degree: string | null
          experience_yrs: number | null
          hospital_id: string | null
          id: string
          is_verified: boolean | null
          languages: string[] | null
          name: string | null
          photo_url: string | null
          specialty: string | null
          success_rate: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          degree?: string | null
          experience_yrs?: number | null
          hospital_id?: string | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          name?: string | null
          photo_url?: string | null
          specialty?: string | null
          success_rate?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          degree?: string | null
          experience_yrs?: number | null
          hospital_id?: string | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          name?: string | null
          photo_url?: string | null
          specialty?: string | null
          success_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          booking_id: string | null
          file_name: string | null
          file_path: string | null
          file_size_kb: number | null
          file_type: string | null
          id: string
          patient_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          booking_id?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size_kb?: number | null
          file_type?: string | null
          id?: string
          patient_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          booking_id?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size_kb?: number | null
          file_type?: string | null
          id?: string
          patient_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          accreditations: string[] | null
          address: string | null
          admin_id: string | null
          city: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          name: string
          partner_status: string | null
          rating: number | null
          review_count: number | null
          specialties: string[] | null
          state: string | null
        }
        Insert: {
          accreditations?: string[] | null
          address?: string | null
          admin_id?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          partner_status?: string | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          state?: string | null
        }
        Update: {
          accreditations?: string[] | null
          address?: string | null
          admin_id?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          partner_status?: string | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospitals_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          booking_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_urgent: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          booking_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_urgent?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          booking_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_urgent?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          duration_days: number | null
          hospital_id: string | null
          hotel_included: boolean | null
          hotel_tier: number | null
          id: string
          is_available: boolean | null
          price_inr: number | null
          title: string | null
          transfer: boolean | null
          translator: boolean | null
          treatment_id: string | null
          visa_assistance: boolean | null
        }
        Insert: {
          created_at?: string | null
          duration_days?: number | null
          hospital_id?: string | null
          hotel_included?: boolean | null
          hotel_tier?: number | null
          id?: string
          is_available?: boolean | null
          price_inr?: number | null
          title?: string | null
          transfer?: boolean | null
          translator?: boolean | null
          treatment_id?: string | null
          visa_assistance?: boolean | null
        }
        Update: {
          created_at?: string | null
          duration_days?: number | null
          hospital_id?: string | null
          hotel_included?: boolean | null
          hotel_tier?: number | null
          id?: string
          is_available?: boolean | null
          price_inr?: number | null
          title?: string | null
          transfer?: boolean | null
          translator?: boolean | null
          treatment_id?: string | null
          visa_assistance?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_inr: number | null
          amount_usd: number | null
          booking_id: string | null
          created_at: string | null
          demo_last4: string | null
          id: string
          status: string | null
        }
        Insert: {
          amount_inr?: number | null
          amount_usd?: number | null
          booking_id?: string | null
          created_at?: string | null
          demo_last4?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          amount_inr?: number | null
          amount_usd?: number | null
          booking_id?: string | null
          created_at?: string | null
          demo_last4?: string | null
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          emergency_name: string | null
          emergency_phone: string | null
          full_name: string | null
          gender: string | null
          id: string
          language_pref: string | null
          nationality: string | null
          passport_expiry: string | null
          passport_no: string | null
          phone: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          language_pref?: string | null
          nationality?: string | null
          passport_expiry?: string | null
          passport_no?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          language_pref?: string | null
          nationality?: string | null
          passport_expiry?: string | null
          passport_no?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string | null
          booking_id: string | null
          comment: string | null
          created_at: string | null
          doctor_id: string | null
          hospital_id: string | null
          id: string
          is_published: boolean | null
          patient_id: string | null
          patient_name: string | null
          rating: number | null
          treatment_name: string | null
        }
        Insert: {
          body?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          is_published?: boolean | null
          patient_id?: string | null
          patient_name?: string | null
          rating?: number | null
          treatment_name?: string | null
        }
        Update: {
          body?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          is_published?: boolean | null
          patient_id?: string | null
          patient_name?: string | null
          rating?: number | null
          treatment_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          admin_reply: string | null
          booking_id: string | null
          created_at: string | null
          id: string
          issue: string | null
          patient_id: string | null
          status: string | null
        }
        Insert: {
          admin_reply?: string | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          issue?: string | null
          patient_id?: string | null
          status?: string | null
        }
        Update: {
          admin_reply?: string | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          issue?: string | null
          patient_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          avg_cost_max: number | null
          avg_cost_min: number | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string | null
          recovery_days: number | null
          slug: string | null
          success_rate: number | null
        }
        Insert: {
          avg_cost_max?: number | null
          avg_cost_min?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          recovery_days?: number | null
          slug?: string | null
          success_rate?: number | null
        }
        Update: {
          avg_cost_max?: number | null
          avg_cost_min?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          recovery_days?: number | null
          slug?: string | null
          success_rate?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
