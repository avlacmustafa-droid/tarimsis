import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  phone: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

export const fieldSchema = z.object({
  name: z.string().min(1, "Arazi adı gerekli"),
  location_name: z.string().optional(),
  current_crop: z.string().optional(),
  soil_type: z.string().optional(),
  coordinates: z.array(z.array(z.array(z.number()))).optional(),
});

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Kategori gerekli"),
  amount: z.number().positive("Tutar pozitif olmalı"),
  description: z.string().optional(),
  field_id: z.string().uuid().optional(),
  transaction_date: z.string(),
});

export const calendarEventSchema = z.object({
  type: z.enum([
    "planting",
    "spraying",
    "fertilizing",
    "irrigation",
    "harvest",
    "plowing",
    "other",
  ]),
  title: z.string().min(1, "Başlık gerekli"),
  description: z.string().optional(),
  field_id: z.string().uuid().optional(),
  event_date: z.string(),
  reminder_enabled: z.boolean().default(false),
  reminder_date: z.string().optional(),
});
