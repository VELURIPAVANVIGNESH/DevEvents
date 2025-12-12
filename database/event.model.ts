import mongoose, {
  type HydratedDocument,
  type Model,
  Schema,
} from "mongoose";

export type EventMode = "online" | "offline" | "hybrid" | (string & {});

export interface EventFields {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // stored as ISO string
  time: string; // stored as HH:mm (24h)
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

export type EventDocument = HydratedDocument<EventFields> & {
  createdAt: Date;
  updatedAt: Date;
};

const requireNonEmptyString = (value: unknown): boolean =>
  typeof value === "string" && value.trim().length > 0;

const requireNonEmptyStringArray = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((v) => typeof v === "string" && v.trim().length > 0);

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    // Replace non-alphanumeric blocks with a single dash.
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const normalizeISODate = (value: string): string => {
  // Accept any JS-date-parsable string, but store consistently as ISO.
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
  return d.toISOString();
};

const normalizeTimeTo24hHHmm = (value: string): string => {
  const raw = value.trim().toLowerCase();

  // Supports: "HH:mm" / "H:mm" (24h)
  const m24 = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (m24) {
    const hh = m24[1].padStart(2, "0");
    const mm = m24[2];
    return `${hh}:${mm}`;
  }

  // Supports: "h:mm am" / "hh:mm pm" (12h)
  const m12 = raw.match(/^(\d{1,2}):([0-5]\d)\s*(am|pm)$/);
  if (m12) {
    let hh = Number(m12[1]);
    const mm = m12[2];
    const meridiem = m12[3];

    if (hh < 1 || hh > 12) throw new Error("Invalid time");
    if (meridiem === "am") hh = hh % 12;
    if (meridiem === "pm") hh = (hh % 12) + 12;

    return `${String(hh).padStart(2, "0")}:${mm}`;
  }

  throw new Error("Invalid time");
};

const eventSchema = new Schema<EventFields>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Title is required",
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Description is required",
      },
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Overview is required",
      },
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Image is required",
      },
    },
    venue: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Venue is required",
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Location is required",
      },
    },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Date is required",
      },
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Time is required",
      },
    },
    mode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Mode is required",
      },
    },
    audience: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Audience is required",
      },
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: requireNonEmptyStringArray,
        message: "Agenda must be a non-empty array of strings",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: requireNonEmptyString,
        message: "Organizer is required",
      },
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: requireNonEmptyStringArray,
        message: "Tags must be a non-empty array of strings",
      },
    },
  },
  {
    timestamps: true, // auto-manage createdAt/updatedAt
    strict: "throw", // fail on unknown fields to keep data clean
  }
);

// Ensure uniqueness at the database level as well.
eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("save", function (this: EventDocument) {
  // Promise/throw style hook keeps typings clean and avoids callback mismatches.

  // Regenerate slug only if title changes.
  if (this.isModified("title")) {
    const title = this.title.trim();
    if (!title) throw new Error("Title is required");
    this.slug = slugify(title);
  }

  // Normalize date/time on every save so updates remain consistent.
  this.date = normalizeISODate(this.date);
  this.time = normalizeTimeTo24hHHmm(this.time);

  // Defensive checks for required fields (beyond schema-level required).
  const requiredStrings: Array<[keyof EventFields, string]> = [
    ["title", this.title],
    ["description", this.description],
    ["overview", this.overview],
    ["image", this.image],
    ["venue", this.venue],
    ["location", this.location],
    ["date", this.date],
    ["time", this.time],
    ["mode", this.mode],
    ["audience", this.audience],
    ["organizer", this.organizer],
  ];

  for (const [field, value] of requiredStrings) {
    if (!requireNonEmptyString(value)) {
      throw new Error(`${String(field)} is required`);
    }
  }

  if (!requireNonEmptyStringArray(this.agenda)) {
    throw new Error("Agenda must be a non-empty array of strings");
  }
  if (!requireNonEmptyStringArray(this.tags)) {
    throw new Error("Tags must be a non-empty array of strings");
  }
});

export const Event: Model<EventFields> =
  (mongoose.models.Event as Model<EventFields> | undefined) ||
  mongoose.model<EventFields>("Event", eventSchema);
