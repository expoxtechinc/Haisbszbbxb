import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Upload, FileText, User, Users, GraduationCap, ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useSchoolData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Seo } from "@/components/seo";
import { toast } from "sonner";

const MAX_DOC_SIZE = 2 * 1024 * 1024; // 2MB per document

type DocFile = { name: string; type: string; dataUrl: string; size: number };

const schema = z.object({
  // Step 1 — Student
  studentName: z.string().min(2, "Full name required"),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Select gender" }),
  nationality: z.string().min(2, "Nationality required"),
  // Step 2 — Parent/Guardian
  parentName: z.string().min(2, "Parent/guardian name required"),
  relationship: z.string().min(2, "Relationship required"),
  parentPhone: z.string().min(6, "Phone number required"),
  parentEmail: z.string().email("Valid email required"),
  parentAddress: z.string().min(5, "Address required"),
  // Step 3 — Academic
  gradeApplying: z.string().min(1, "Grade required"),
  academicYear: z.string().min(1, "Academic year required"),
  previousSchool: z.string().optional(),
  hasSpecialNeeds: z.enum(["No", "Yes"]).optional(),
  specialNeedsDetails: z.string().optional(),
  additionalNotes: z.string().optional(),
  // Honeypot
  website_hp: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

const STEPS = [
  { id: 1, label: "Student Info", icon: User },
  { id: 2, label: "Parent / Guardian", icon: Users },
  { id: 3, label: "Academic", icon: GraduationCap },
  { id: 4, label: "Documents", icon: FileText },
];

const GRADES = [
  "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7 (JHS 1)", "Grade 8 (JHS 2)", "Grade 9 (JHS 3)",
  "Grade 10 (SHS 1)", "Grade 11 (SHS 2)", "Grade 12 (SHS 3)",
];

const DOCS_REQUIRED = [
  { key: "passport_photo", label: "Passport Photo", hint: "Recent clear photo (JPEG/PNG)", required: true },
  { key: "birth_certificate", label: "Birth Certificate", hint: "Official birth certificate scan", required: true },
  { key: "school_report", label: "Previous School Report / Transcript", hint: "Most recent report card", required: false },
  { key: "medical_certificate", label: "Medical / Health Certificate", hint: "Recent health clearance", required: false },
];

export default function Enroll() {
  const { schoolInfo } = useSchoolData();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [docs, setDocs] = useState<Record<string, DocFile>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const formLoadedAt = useRef(Date.now());

  useEffect(() => { formLoadedAt.current = Date.now(); }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      studentName: "", dateOfBirth: "", gender: "Male", nationality: "Liberian",
      parentName: "", relationship: "Parent", parentPhone: "", parentEmail: "", parentAddress: "",
      gradeApplying: "", academicYear: `${new Date().getFullYear()}–${new Date().getFullYear() + 1}`,
      previousSchool: "", hasSpecialNeeds: "No", specialNeedsDetails: "", additionalNotes: "",
      website_hp: "",
    },
  });

  const handleDocUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_DOC_SIZE) { toast.error(`${file.name} exceeds 2 MB limit`); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocs(prev => ({ ...prev, [key]: { name: file.name, type: file.type, dataUrl: reader.result as string, size: file.size } }));
      toast.success(`${file.name} attached`);
    };
    reader.readAsDataURL(file);
  };

  const validateStep = async () => {
    const fields: Record<number, (keyof FormData)[]> = {
      1: ["studentName", "dateOfBirth", "gender", "nationality"],
      2: ["parentName", "relationship", "parentPhone", "parentEmail", "parentAddress"],
      3: ["gradeApplying", "academicYear"],
    };
    if (step < 4) {
      const ok = await form.trigger(fields[step]);
      return ok;
    }
    return true;
  };

  const nextStep = async () => {
    if (await validateStep()) setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const onSubmit = async (values: FormData) => {
    if (values.website_hp) { setIsSuccess(true); return; } // honeypot
    const elapsed = Date.now() - formLoadedAt.current;
    if (elapsed < 4000) { toast.error("Please review your application before submitting."); return; }
    const required = DOCS_REQUIRED.filter(d => d.required);
    const missing = required.filter(d => !docs[d.key]);
    if (missing.length > 0) {
      toast.error(`Please attach: ${missing.map(d => d.label).join(", ")}`);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = { ...values, documents: docs };
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Server error");
      setIsSuccess(true);
    } catch {
      toast.error("Submission failed. Please try again or contact the school directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col w-full pb-20">
        <Seo title={`Apply Now — ${schoolInfo.name}`} description="Online enrollment application for DASBMSE." path="/enroll" />
        <section className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="font-serif text-4xl font-bold text-primary mb-4">Application Submitted!</h1>
          <p className="text-muted-foreground max-w-lg text-lg mb-8">
            Thank you for applying to <strong>{schoolInfo.name}</strong>. We've received your application and will review it shortly. The school will contact you via the phone or email you provided.
          </p>
          <Button onClick={() => { setIsSuccess(false); setStep(1); form.reset(); setDocs({}); }} variant="outline" className="rounded-full">
            Submit Another Application
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-20">
      <Seo
        title={`Apply / Enroll Online — ${schoolInfo.name} | DASBMSE`}
        description={`Apply for admission to Dr. Abraham S. Borbor Memorial School Of Excellence online. Submit your enrollment application with documents for ${new Date().getFullYear()}–${new Date().getFullYear() + 1}.`}
        path="/enroll"
      />

      <section className="bg-primary pt-20 pb-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">Apply for Admission</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Submit your enrollment application online. Fill in all sections carefully — our team will review and contact you within 3–5 business days.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 md:px-6 -mt-10 relative z-10 max-w-4xl">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 bg-card rounded-2xl shadow-sm border border-border/50 p-4 md:p-6">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className={`hidden sm:block text-xs mt-1 font-medium ${step >= s.id ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded-full transition-colors ${step > s.id ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Honeypot */}
          <div style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
            <input type="text" tabIndex={-1} autoComplete="off" {...form.register("website_hp")} />
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1 — Student Info */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 md:p-8 space-y-5">
                  <h2 className="font-serif text-2xl font-bold text-primary mb-2">Student Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Full Legal Name <span className="text-destructive">*</span></Label>
                      <Input {...form.register("studentName")} placeholder="As it appears on birth certificate" />
                      {form.formState.errors.studentName && <p className="text-destructive text-sm">{form.formState.errors.studentName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Date of Birth <span className="text-destructive">*</span></Label>
                      <Input type="date" {...form.register("dateOfBirth")} />
                      {form.formState.errors.dateOfBirth && <p className="text-destructive text-sm">{form.formState.errors.dateOfBirth.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Gender <span className="text-destructive">*</span></Label>
                      <select {...form.register("gender")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Nationality <span className="text-destructive">*</span></Label>
                      <Input {...form.register("nationality")} placeholder="e.g. Liberian, Ghanaian…" />
                      {form.formState.errors.nationality && <p className="text-destructive text-sm">{form.formState.errors.nationality.message}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Parent/Guardian */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 md:p-8 space-y-5">
                  <h2 className="font-serif text-2xl font-bold text-primary mb-2">Parent / Guardian Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Full Name <span className="text-destructive">*</span></Label>
                      <Input {...form.register("parentName")} placeholder="Parent or guardian full name" />
                      {form.formState.errors.parentName && <p className="text-destructive text-sm">{form.formState.errors.parentName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Relationship to Student <span className="text-destructive">*</span></Label>
                      <select {...form.register("relationship")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        {["Parent", "Guardian", "Grandparent", "Sibling", "Uncle/Aunt", "Other"].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Phone Number <span className="text-destructive">*</span></Label>
                      <Input {...form.register("parentPhone")} placeholder="+231 xx xxx xxxx" />
                      {form.formState.errors.parentPhone && <p className="text-destructive text-sm">{form.formState.errors.parentPhone.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email Address <span className="text-destructive">*</span></Label>
                      <Input type="email" {...form.register("parentEmail")} placeholder="parent@example.com" />
                      {form.formState.errors.parentEmail && <p className="text-destructive text-sm">{form.formState.errors.parentEmail.message}</p>}
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Home Address <span className="text-destructive">*</span></Label>
                      <Textarea {...form.register("parentAddress")} placeholder="Full residential address" className="resize-none h-20" />
                      {form.formState.errors.parentAddress && <p className="text-destructive text-sm">{form.formState.errors.parentAddress.message}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Academic */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 md:p-8 space-y-5">
                  <h2 className="font-serif text-2xl font-bold text-primary mb-2">Academic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Grade / Class Applying For <span className="text-destructive">*</span></Label>
                      <select {...form.register("gradeApplying")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value="">— Select grade —</option>
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      {form.formState.errors.gradeApplying && <p className="text-destructive text-sm">{form.formState.errors.gradeApplying.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Academic Year <span className="text-destructive">*</span></Label>
                      <Input {...form.register("academicYear")} placeholder={`${new Date().getFullYear()}–${new Date().getFullYear() + 1}`} />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Previous / Current School (if any)</Label>
                      <Input {...form.register("previousSchool")} placeholder="Name and location of last school attended" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Does the student have any special educational needs?</Label>
                      <select {...form.register("hasSpecialNeeds")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    {form.watch("hasSpecialNeeds") === "Yes" && (
                      <div className="space-y-1.5 md:col-span-2">
                        <Label>Please describe the special needs</Label>
                        <Textarea {...form.register("specialNeedsDetails")} className="resize-none h-24" placeholder="Describe learning needs, disabilities, or accommodations required" />
                      </div>
                    )}
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Additional Notes / Message to School</Label>
                      <Textarea {...form.register("additionalNotes")} className="resize-none h-24" placeholder="Anything else the school should know about this student…" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — Documents */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-primary mb-1">Upload Documents</h2>
                    <p className="text-muted-foreground text-sm">Required documents are marked with <span className="text-destructive">*</span>. Accepted formats: JPEG, PNG, PDF. Max 2 MB each.</p>
                  </div>
                  <div className="space-y-4">
                    {DOCS_REQUIRED.map((doc) => (
                      <div key={doc.key} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-border/50 bg-background">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {doc.label} {doc.required && <span className="text-destructive">*</span>}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{doc.hint}</div>
                          {docs[doc.key] && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              ✓ {docs[doc.key].name} ({(docs[doc.key].size / 1024).toFixed(0)} KB)
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,application/pdf"
                            ref={el => { fileRefs.current[doc.key] = el; }}
                            className="hidden"
                            onChange={e => handleDocUpload(doc.key, e)}
                          />
                          <Button
                            type="button"
                            variant={docs[doc.key] ? "outline" : "default"}
                            size="sm"
                            onClick={() => fileRefs.current[doc.key]?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {docs[doc.key] ? "Replace" : "Upload"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-secondary/10 rounded-xl p-4 text-sm text-secondary-foreground">
                    <strong>Note:</strong> Documents are transmitted securely. By submitting this form, you confirm that all information provided is accurate and that uploaded documents belong to the student applying.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6 gap-3">
            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1} className="rounded-full px-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="rounded-full px-8">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="rounded-full px-8 bg-primary">
                {isSubmitting ? "Submitting…" : "Submit Application"} {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
