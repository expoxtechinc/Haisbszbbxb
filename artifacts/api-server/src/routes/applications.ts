import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

router.post("/applications", async (req, res) => {
  const {
    studentName, dateOfBirth, gender, nationality,
    parentName, relationship, parentPhone, parentEmail, parentAddress,
    gradeApplying, academicYear, previousSchool,
    hasSpecialNeeds, specialNeedsDetails, additionalNotes,
    documents,
  } = req.body as Record<string, unknown>;

  if (!studentName || !parentName || !parentPhone || !gradeApplying) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  try {
    await db.insert(applicationsTable).values({
      id,
      studentName: String(studentName),
      dateOfBirth: dateOfBirth ? String(dateOfBirth) : "",
      gender: gender ? String(gender) : "",
      nationality: nationality ? String(nationality) : "",
      parentName: String(parentName),
      relationship: relationship ? String(relationship) : "Parent",
      parentPhone: String(parentPhone),
      parentEmail: parentEmail ? String(parentEmail) : "",
      parentAddress: parentAddress ? String(parentAddress) : "",
      gradeApplying: String(gradeApplying),
      academicYear: academicYear ? String(academicYear) : "",
      previousSchool: previousSchool ? String(previousSchool) : "",
      hasSpecialNeeds: hasSpecialNeeds === "Yes",
      specialNeedsDetails: specialNeedsDetails ? String(specialNeedsDetails) : "",
      additionalNotes: additionalNotes ? String(additionalNotes) : "",
      documents: (documents as object) ?? {},
      status: "pending",
    });
    res.json({ ok: true, id });
  } catch (err) {
    req.log.error({ err }, "Failed to save application");
    res.status(500).json({ error: "Failed to save application" });
  }
});

router.get("/applications", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(applicationsTable).orderBy(desc(applicationsTable.submittedAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch applications");
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.put("/applications/:id/status", requireAdmin, async (req, res) => {
  const id = String(req.params["id"]);
  const { status, notes } = req.body as { status?: string; notes?: string };
  const valid = ["pending", "reviewing", "accepted", "rejected"];
  if (!status || !valid.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${valid.join(", ")}` });
    return;
  }
  try {
    await db.update(applicationsTable)
      .set({ status, adminNotes: notes ?? undefined, updatedAt: new Date() })
      .where(eq(applicationsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to update application status");
    res.status(500).json({ error: "Failed to update application" });
  }
});

router.delete("/applications/:id", requireAdmin, async (req, res) => {
  const id = String(req.params["id"]);
  try {
    await db.delete(applicationsTable).where(eq(applicationsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete application");
    res.status(500).json({ error: "Failed to delete application" });
  }
});

export default router;
