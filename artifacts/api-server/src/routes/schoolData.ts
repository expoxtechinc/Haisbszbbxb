import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { schoolDataTable, contactSubmissionsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

const ALLOWED_KEYS = [
  "schoolInfo",
  "activities",
  "news",
  "gallery",
  "staff",
  "testimonials",
  "achievements",
  "heroSlides",
];

router.get("/data", async (req, res) => {
  try {
    const rows = await db.select().from(schoolDataTable);
    const result: Record<string, unknown> = {};
    for (const row of rows) {
      result[row.key] = row.value;
    }
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch school data");
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/data/:key", async (req, res) => {
  const key = String(req.params["key"]);
  if (!ALLOWED_KEYS.includes(key)) {
    res.status(404).json({ error: "Unknown key" });
    return;
  }
  try {
    const rows = await db.select().from(schoolDataTable).where(eq(schoolDataTable.key, key));
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ key, value: rows[0]!.value });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch school data key");
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.put("/data/:key", requireAdmin, async (req, res) => {
  const key = String(req.params["key"]);
  if (!ALLOWED_KEYS.includes(key)) {
    res.status(400).json({ error: "Unknown key" });
    return;
  }
  const { value } = req.body as { value: unknown };
  if (value === undefined) {
    res.status(400).json({ error: "value is required" });
    return;
  }
  try {
    await db
      .insert(schoolDataTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: schoolDataTable.key,
        set: { value, updatedAt: new Date() },
      });
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to update school data");
    res.status(500).json({ error: "Failed to update data" });
  }
});

router.get("/submissions", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(contactSubmissionsTable.submittedAt);
    const result = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      message: r.message,
      submittedAt: r.submittedAt.toISOString(),
    })).reverse();
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch submissions");
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

router.post("/submissions", async (req, res) => {
  const { name, email, phone, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
  if (!name || !email || !message) {
    res.status(400).json({ error: "name, email, and message are required" });
    return;
  }
  const id = Math.random().toString(36).substring(2, 11);
  try {
    await db.insert(contactSubmissionsTable).values({
      id,
      name,
      email,
      phone: phone ?? "",
      message,
      submittedAt: new Date(),
    });
    res.json({ ok: true, id, submittedAt: new Date().toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to save submission");
    res.status(500).json({ error: "Failed to save submission" });
  }
});

router.delete("/submissions/:id", requireAdmin, async (req, res) => {
  const id = String(req.params["id"]);
  try {
    await db.delete(contactSubmissionsTable).where(eq(contactSubmissionsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete submission");
    res.status(500).json({ error: "Failed to delete submission" });
  }
});

router.delete("/submissions", requireAdmin, async (req, res) => {
  try {
    await db.delete(contactSubmissionsTable);
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to clear submissions");
    res.status(500).json({ error: "Failed to clear submissions" });
  }
});

router.post("/submissions/bulk", requireAdmin, async (req, res) => {
  const { submissions } = req.body as {
    submissions?: Array<{
      id?: string;
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      submittedAt?: string;
    }>;
  };
  if (!Array.isArray(submissions)) {
    res.status(400).json({ error: "submissions array is required" });
    return;
  }
  try {
    await db.delete(contactSubmissionsTable);
    if (submissions.length > 0) {
      const rows = submissions.map((s) => ({
        id: s.id ?? Math.random().toString(36).substring(2, 11),
        name: s.name ?? "",
        email: s.email ?? "",
        phone: s.phone ?? "",
        message: s.message ?? "",
        submittedAt: s.submittedAt ? new Date(s.submittedAt) : new Date(),
      }));
      await db.insert(contactSubmissionsTable).values(rows);
    }
    res.json({ ok: true, count: submissions.length });
  } catch (err) {
    req.log.error({ err }, "Failed to bulk import submissions");
    res.status(500).json({ error: "Failed to bulk import submissions" });
  }
});

export default router;
