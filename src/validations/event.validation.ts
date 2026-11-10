
import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Event title must be at least 5 characters.")
    .max(100, "Event title cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(2000, "Description cannot exceed 2000 characters."),

  category: z.enum([
    "Cleanup",
    "Plantation",
    "Donation",
    "Awareness",
    "Education",
    "Other",
  ]),

  image: z
    .string()
    .trim()
    .url("Please provide a valid image URL."),

  location: z
    .string()
    .trim()
    .min(3, "Location must be at least 3 characters.")
    .max(150, "Location cannot exceed 150 characters."),

  eventDate: z.coerce
    .date()
    .refine(
      (date) => date.getTime() > Date.now(),
      "Event date must be in the future."
    ),
});

// Create Event type
export type CreateEventInput = z.infer<typeof eventSchema>;

// Update Event validation
export const updateEventSchema = eventSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required to update an event."
  );

// Update Event type
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
