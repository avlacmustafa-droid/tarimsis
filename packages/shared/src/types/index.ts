export type PlanType = "free" | "monthly" | "yearly";

export type TransactionType = "income" | "expense";

export type CalendarEventType =
  | "planting"
  | "spraying"
  | "fertilizing"
  | "irrigation"
  | "harvest"
  | "plowing"
  | "other";

export type ChatRole = "user" | "assistant";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  city: string | null;
  district: string | null;
  plan_type: PlanType;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Field {
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
}

export interface Transaction {
  id: string;
  user_id: string;
  field_id: string | null;
  type: TransactionType;
  category: string;
  amount: number;
  description: string | null;
  transaction_date: string;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  field_id: string | null;
  type: CalendarEventType;
  title: string;
  description: string | null;
  event_date: string;
  reminder_enabled: boolean;
  reminder_date: string | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: ChatRole;
  content: string;
  image_url: string | null;
  created_at: string;
}
