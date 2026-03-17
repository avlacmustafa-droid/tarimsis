export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          city: string | null;
          district: string | null;
          plan_type: "free" | "monthly" | "yearly";
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          city?: string | null;
          district?: string | null;
          plan_type?: "free" | "monthly" | "yearly";
          avatar_url?: string | null;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          city?: string | null;
          district?: string | null;
          plan_type?: "free" | "monthly" | "yearly";
          avatar_url?: string | null;
          is_admin?: boolean;
        };
        Relationships: [];
      };
      fields: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          location_name: string | null;
          area_sqm: number | null;
          coordinates: number[][][] | null;
          current_crop: string | null;
          soil_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          location_name?: string | null;
          area_sqm?: number | null;
          coordinates?: number[][][] | null;
          current_crop?: string | null;
          soil_type?: string | null;
        };
        Update: {
          user_id?: string;
          name?: string;
          location_name?: string | null;
          area_sqm?: number | null;
          coordinates?: number[][][] | null;
          current_crop?: string | null;
          soil_type?: string | null;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          field_id: string | null;
          type: "income" | "expense";
          category: string;
          amount: number;
          description: string | null;
          transaction_date: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          field_id?: string | null;
          type: "income" | "expense";
          category: string;
          amount: number;
          description?: string | null;
          transaction_date: string;
        };
        Update: {
          user_id?: string;
          field_id?: string | null;
          type?: "income" | "expense";
          category?: string;
          amount?: number;
          description?: string | null;
          transaction_date?: string;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          id: string;
          user_id: string;
          field_id: string | null;
          type: string;
          title: string;
          description: string | null;
          event_date: string;
          reminder_enabled: boolean;
          reminder_date: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          field_id?: string | null;
          type: string;
          title: string;
          description?: string | null;
          event_date: string;
          reminder_enabled?: boolean;
          reminder_date?: string | null;
        };
        Update: {
          user_id?: string;
          field_id?: string | null;
          type?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          reminder_enabled?: boolean;
          reminder_date?: string | null;
        };
        Relationships: [];
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
        };
        Update: {
          user_id?: string;
          title?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: "user" | "assistant";
          content: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          session_id: string;
          role: "user" | "assistant";
          content: string;
          image_url?: string | null;
        };
        Update: {
          session_id?: string;
          role?: "user" | "assistant";
          content?: string;
          image_url?: string | null;
        };
        Relationships: [];
      };
      crop_history: {
        Row: {
          id: string;
          field_id: string;
          user_id: string;
          crop_name: string;
          start_date: string;
          end_date: string | null;
          yield_amount: number | null;
          yield_unit: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          field_id: string;
          user_id: string;
          crop_name: string;
          start_date: string;
          end_date?: string | null;
          yield_amount?: number | null;
          yield_unit?: string | null;
          notes?: string | null;
        };
        Update: {
          field_id?: string;
          user_id?: string;
          crop_name?: string;
          start_date?: string;
          end_date?: string | null;
          yield_amount?: number | null;
          yield_unit?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      forum_topics: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          category: string;
          is_solved: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          content: string;
          category?: string;
          is_solved?: boolean;
        };
        Update: {
          user_id?: string;
          title?: string;
          content?: string;
          category?: string;
          is_solved?: boolean;
          view_count?: number;
        };
        Relationships: [];
      };
      forum_replies: {
        Row: {
          id: string;
          topic_id: string;
          user_id: string;
          content: string;
          is_solution: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          topic_id: string;
          user_id: string;
          content: string;
          is_solution?: boolean;
        };
        Update: {
          topic_id?: string;
          user_id?: string;
          content?: string;
          is_solution?: boolean;
        };
        Relationships: [];
      };
      forum_reply_likes: {
        Row: {
          id: string;
          reply_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          reply_id: string;
          user_id: string;
        };
        Update: {
          reply_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          title: string;
          message: string;
          link?: string | null;
          is_read?: boolean;
        };
        Update: {
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          link?: string | null;
          is_read?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      plan_type: "free" | "monthly" | "yearly";
      transaction_type: "income" | "expense";
      chat_role: "user" | "assistant";
    };
    CompositeTypes: Record<string, never>;
  };
};
