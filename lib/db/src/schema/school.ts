import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const schoolDataTable = pgTable("school_data", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contactSubmissionsTable = pgTable("contact_submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SchoolDataRow = typeof schoolDataTable.$inferSelect;
export type ContactSubmissionRow = typeof contactSubmissionsTable.$inferSelect;
