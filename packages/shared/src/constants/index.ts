export const PLAN_LIMITS = {
  free: {
    maxFields: 1,
    maxAiQuestionsPerDay: 5,
    maxPhotoAnalysis: 1,
    maxWarehouses: 1,
    canWriteForum: false,
    canTrackWorkers: false,
  },
  monthly: {
    maxFields: Infinity,
    maxAiQuestionsPerDay: Infinity,
    maxPhotoAnalysis: Infinity,
    maxWarehouses: Infinity,
    canWriteForum: true,
    canTrackWorkers: true,
  },
  yearly: {
    maxFields: Infinity,
    maxAiQuestionsPerDay: Infinity,
    maxPhotoAnalysis: Infinity,
    maxWarehouses: Infinity,
    canWriteForum: true,
    canTrackWorkers: true,
  },
} as const;

export const TRANSACTION_CATEGORIES = {
  income: ["hasat", "satış", "destek", "diğer"],
  expense: ["tohum", "gübre", "ilaç", "işçilik", "yakıt", "ekipman", "kira", "diğer"],
} as const;

export const CALENDAR_EVENT_LABELS: Record<string, string> = {
  planting: "Ekim",
  spraying: "İlaçlama",
  fertilizing: "Gübreleme",
  irrigation: "Sulama",
  harvest: "Hasat",
  plowing: "Sürüm",
  other: "Diğer",
};

export const FORUM_CATEGORIES: Record<string, string> = {
  general: "Genel",
  disease: "Hastalık & Zararlı",
  fertilizing: "Gübreleme",
  irrigation: "Sulama",
  planting: "Ekim & Hasat",
  equipment: "Ekipman",
  market: "Pazar & Satış",
  other: "Diğer",
};
