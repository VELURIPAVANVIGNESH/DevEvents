import mongoose, {
  type HydratedDocument,
  type Model,
  Schema,
  type Types,
} from "mongoose";

import { Event } from "./event.model";

export interface BookingFields {
  eventId: Types.ObjectId;
  email: string;
}

export type BookingDocument = HydratedDocument<BookingFields> & {
  createdAt: Date;
  updatedAt: Date;
};

const isValidEmail = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  const email = value.trim();
  // Pragmatic validation (RFC-complete regex is overkill); enforce a@b.cc structure.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const bookingSchema = new Schema<BookingFields>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true, // fast lookups by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: isValidEmail,
        message: "Invalid email",
      },
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

bookingSchema.pre("save", async function (this: BookingDocument) {
  // Enforce referential integrity at write-time.
  const exists = await Event.exists({ _id: this.eventId });
  if (!exists) throw new Error("Referenced event does not exist");

  if (!isValidEmail(this.email)) throw new Error("Invalid email");
});

export const Booking: Model<BookingFields> =
  (mongoose.models.Booking as Model<BookingFields> | undefined) ||
  mongoose.model<BookingFields>("Booking", bookingSchema);
