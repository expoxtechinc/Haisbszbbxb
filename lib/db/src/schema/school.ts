import { pgTable, text, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

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

export const applicationsTable = pgTable("applications", {
  id: text("id").primaryKey(),
  // Student
  studentName: text("student_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull().default(""),
  gender: text("gender").notNull().default(""),
  nationality: text("nationality").notNull().default(""),
  // Parent/Guardian
  parentName: text("parent_name").notNull(),
  relationship: text("relationship").notNull().default("Parent"),
  parentPhone: text("parent_phone").notNull(),
  parentEmail: text("parent_email").notNull().default(""),
  parentAddress: text("parent_address").notNull().default(""),
  // Academic
  gradeApplying: text("grade_applying").notNull(),
  academicYear: text("academic_year").notNull().default(""),
  previousSchool: text("previous_school").notNull().default(""),
  hasSpecialNeeds: boolean("has_special_needs").notNull().default(false),
  specialNeedsDetails: text("special_needs_details").notNull().default(""),
  additionalNotes: text("additional_notes").notNull().default(""),
  // Documents stored as JSONB {key: {name, type, dataUrl, size}}
  documents: jsonb("documents").notNull().default({}),
  // Admin
  status: text("status").notNull().default("pending"), // pending | reviewing | accepted | rejected
  adminNotes: text("admin_notes"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SchoolDataRow = typeof schoolDataTable.$inferSelect;
export type ContactSubmissionRow = typeof contactSubmissionsTable.$inferSelect;
export type ApplicationRow = typeof applicationsTable.$inferSelect;
