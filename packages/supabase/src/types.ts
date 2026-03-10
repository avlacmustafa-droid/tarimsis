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
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["fields"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["calendar_events"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["chat_sessions"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
      };
    };
  };
};
