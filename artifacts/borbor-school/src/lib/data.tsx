import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

// Types
export type SchoolInfo = {
  name: string;
  slogan: string;
  mission: string;
  vision: string;
  history: string;
  email: string;
  phones: string[];
  whatsapp: string;
  facebookUrl: string;
  address: string;
  established: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  date?: string;
};

export type News = {
  id: string;
  title: string;
  body: string;
  date: string;
};

export type GalleryCategory = "all" | "events" | "sports" | "graduation" | "academics" | "campus" | "community";

export type GalleryImage = {
  id: string;
  dataUrl: string;
  caption: string;
  uploadedAt: string;
  category?: Exclude<GalleryCategory, "all">;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  photoDataUrl?: string;
  bio?: string;
};

export type Testimonial = {
  id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  rating?: number;
  photoDataUrl?: string;
  createdAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  year: string;
  icon?: "trophy" | "medal" | "award" | "star";
};

export type HeroSlide = {
  id: string;
  imageDataUrl: string;
  headline: string;
  subline?: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
};

// Defaults
const defaultSchoolInfo: SchoolInfo = {
  name: "Dr. Abraham S. Borbor Memorial School Of Excellence",
  slogan: "We Don't Just Teach, We Inspire.",
  mission: "To provide quality, faith-grounded education that nurtures disciplined, curious, and responsible young Liberians prepared to lead in their communities and the world.",
  vision: "To be Liberia's most inspiring center of learning — where every child discovers their voice, their purpose, and their power.",
  history: "Founded in 2019 in Mount Barclay, our school was named in memory of Dr. Abraham S. Borbor. We have since grown into a vibrant community of learners dedicated to excellence.",
  email: "info@dasbmse.edu.lr",
  phones: ["+231 88 663 3880"],
  whatsapp: "+231886633880",
  facebookUrl: "https://www.facebook.com/DASBMSE",
  address: "Mount Barclay, Lower Johnsonville, Monrovia, Liberia",
  established: "2019",
};

const defaultActivities: Activity[] = [
  { id: "1", title: "Annual Sports Day", description: "A day of athletic competition and school spirit." },
  { id: "2", title: "Inter-Class Quiz Competition", description: "Fostering academic excellence through friendly competition." },
  { id: "3", title: "Community Service Day", description: "Students giving back to the Mount Barclay community." },
];

const defaultNews: News[] = [
  { id: "1", title: "Welcome Back to a New Academic Year", body: "We are excited to welcome all our students back for another year of learning and inspiration.", date: new Date().toISOString() },
  { id: "2", title: "2024–2025 Graduation Highlights", body: "Congratulations to our recent graduates who have shown exceptional dedication and hard work.", date: new Date(Date.now() - 86400000 * 30).toISOString() },
];

const defaultStaff: StaffMember[] = [
  { id: "1", name: "Cecelia F. Ndomahun", role: "Principal", photoDataUrl: "/images/graduates.jpg" },
  { id: "2", name: "Edwin Kwakpae", role: "Vice Principal", photoDataUrl: "/images/vice-principal.jpg" },
  { id: "3", name: "Mathematics Teacher", role: "Mathematics Teacher" },
  { id: "4", name: "English Teacher", role: "English Teacher" },
  { id: "5", name: "Science Teacher", role: "Science Teacher" },
  { id: "6", name: "Social Studies Teacher", role: "Social Studies Teacher" },
];

const defaultGallery: GalleryImage[] = [
  { id: "1", dataUrl: "/images/graduates.jpg", caption: "Class of 2024–2025 Graduation Day", uploadedAt: new Date().toISOString(), category: "graduation" }
];

const defaultTestimonials: Testimonial[] = [
  {
    id: "t1",
    authorName: "Mrs. Johnson",
    authorRole: "Parent of Grade 5 student",
    quote: "DASBMSE has shaped my child into a confident, disciplined learner. The teachers truly care about every student.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    authorName: "James K.",
    authorRole: "Class of 2024 Graduate",
    quote: "The values and academic excellence I gained at DASBMSE prepared me for university. Forever grateful.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t3",
    authorName: "Mr. Tarpeh",
    authorRole: "Parent of JHS student",
    quote: "Faith-grounded education with strong academics. Exactly what I wanted for my daughter.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
];

const defaultAchievements: Achievement[] = [
  { id: "a1", title: "100% WAEC Pass Rate", description: "All graduating seniors passed the West African Examinations Council exams.", year: "2024", icon: "trophy" },
  { id: "a2", title: "Inter-School Quiz Champions", description: "Mount Barclay zone academic quiz competition winners.", year: "2024", icon: "medal" },
  { id: "a3", title: "Community Service Award", description: "Recognized for outstanding community outreach by local leaders.", year: "2023", icon: "award" },
];

const defaultHeroSlides: HeroSlide[] = [
  { id: "h1", imageDataUrl: "/images/graduates.jpg", headline: "Shaping Tomorrow's Leaders", subline: "Class of 2024–2025 Graduation Day" },
  { id: "h2", imageDataUrl: "/images/school-logo.jpg", headline: "We Don't Just Teach, We Inspire", subline: "Faith-grounded education in Mount Barclay, Liberia" },
  { id: "h3", imageDataUrl: "/images/vice-principal.jpg", headline: "Dedicated Leadership", subline: "Guiding every student toward excellence" },
];

// API helpers
const API_BASE = "/api";

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem("dasbmse:authToken");
    if (!raw) return null;
    const { token, expiresAt } = JSON.parse(raw) as { token: string; expiresAt: number };
    if (Date.now() > expiresAt) {
      localStorage.removeItem("dasbmse:authToken");
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

function saveAuthToken(token: string, expiresAt: number) {
  localStorage.setItem("dasbmse:authToken", JSON.stringify({ token, expiresAt }));
}

function clearAuthToken() {
  localStorage.removeItem("dasbmse:authToken");
}

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function apiGetAuth<T>(path: string): Promise<T | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function apiPut(path: string, value: unknown): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function apiPost<T>(path: string, body: unknown, auth = false): Promise<T | null> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function apiDelete(path: string): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// localStorage helpers (cache layer)
function lsGet<T>(key: string, defaultValue: T): T {
  const stored = localStorage.getItem(`dasbmse:${key}`);
  if (stored) {
    try { return JSON.parse(stored) as T; } catch { return defaultValue; }
  }
  return defaultValue;
}

function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(`dasbmse:${key}`, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

// Context Setup
export type VisitStats = {
  totalVisits: number;
  uniqueDays: number;
  perPage: { path: string; count: number }[];
  last7Days: { date: string; count: number }[];
  firstVisit: string | null;
  lastVisit: string | null;
};

type SchoolDataContextType = {
  schoolInfo: SchoolInfo;
  setSchoolInfo: (info: SchoolInfo) => void;
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  news: News[];
  setNews: (news: News[]) => void;
  gallery: GalleryImage[];
  setGallery: (gallery: GalleryImage[]) => void;
  staff: StaffMember[];
  setStaff: (staff: StaffMember[]) => void;
  submissions: ContactSubmission[];
  addSubmission: (sub: Omit<ContactSubmission, "id" | "submittedAt">) => void;
  deleteSubmission: (id: string) => void;
  testimonials: Testimonial[];
  setTestimonials: (t: Testimonial[]) => void;
  achievements: Achievement[];
  setAchievements: (a: Achievement[]) => void;
  heroSlides: HeroSlide[];
  setHeroSlides: (s: HeroSlide[]) => void;
  isAuthenticated: boolean;
  login: (pw: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPw: string, newPw: string) => boolean;
  isLoaded: boolean;
  isSyncing: boolean;
  exportBackup: () => string;
  importBackup: (json: string) => boolean;
  resetAllData: () => void;
  recordVisit: (path: string) => void;
  getStats: () => VisitStats;
};

const SchoolDataContext = createContext<SchoolDataContextType | null>(null);

export function SchoolDataProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [schoolInfo, setSchoolInfoState] = useState<SchoolInfo>(defaultSchoolInfo);
  const [activities, setActivitiesState] = useState<Activity[]>(defaultActivities);
  const [news, setNewsState] = useState<News[]>(defaultNews);
  const [gallery, setGalleryState] = useState<GalleryImage[]>(defaultGallery);
  const [staff, setStaffState] = useState<StaffMember[]>(defaultStaff);
  const [submissions, setSubmissionsState] = useState<ContactSubmission[]>([]);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(defaultTestimonials);
  const [achievements, setAchievementsState] = useState<Achievement[]>(defaultAchievements);
  const [heroSlides, setHeroSlidesState] = useState<HeroSlide[]>(defaultHeroSlides);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize: load from localStorage immediately, then sync from API
  useEffect(() => {
    // Step 1: hydrate from localStorage cache for instant load
    const cachedSchoolInfo = lsGet<Partial<SchoolInfo>>("schoolInfo", defaultSchoolInfo);
    const mergedSchoolInfo = { ...defaultSchoolInfo, ...cachedSchoolInfo };
    if (!Array.isArray(mergedSchoolInfo.phones)) mergedSchoolInfo.phones = defaultSchoolInfo.phones;
    setSchoolInfoState(mergedSchoolInfo);
    setActivitiesState(lsGet("activities", defaultActivities));
    setNewsState(lsGet("news", defaultNews));
    setGalleryState(lsGet("gallery", defaultGallery));
    setStaffState(lsGet("staff", defaultStaff));
    setTestimonialsState(lsGet("testimonials", defaultTestimonials));
    setAchievementsState(lsGet("achievements", defaultAchievements));
    setHeroSlidesState(lsGet("heroSlides", defaultHeroSlides));

    // Restore auth state
    const token = getAuthToken();
    if (token) setIsAuthenticated(true);

    setIsLoaded(true);

    // Step 2: fetch fresh data from API in background
    setIsSyncing(true);
    apiGet<Record<string, unknown>>("/data").then((data) => {
      if (data) {
        if (data.schoolInfo && typeof data.schoolInfo === "object") {
          const merged = { ...defaultSchoolInfo, ...(data.schoolInfo as Partial<SchoolInfo>) };
          if (!Array.isArray(merged.phones)) merged.phones = defaultSchoolInfo.phones;
          setSchoolInfoState(merged);
          lsSet("schoolInfo", merged);
        }
        if (Array.isArray(data.activities)) {
          setActivitiesState(data.activities as Activity[]);
          lsSet("activities", data.activities);
        }
        if (Array.isArray(data.news)) {
          setNewsState(data.news as News[]);
          lsSet("news", data.news);
        }
        if (Array.isArray(data.gallery)) {
          setGalleryState(data.gallery as GalleryImage[]);
          lsSet("gallery", data.gallery);
        }
        if (Array.isArray(data.staff)) {
          setStaffState(data.staff as StaffMember[]);
          lsSet("staff", data.staff);
        }
        if (Array.isArray(data.testimonials)) {
          setTestimonialsState(data.testimonials as Testimonial[]);
          lsSet("testimonials", data.testimonials);
        }
        if (Array.isArray(data.achievements)) {
          setAchievementsState(data.achievements as Achievement[]);
          lsSet("achievements", data.achievements);
        }
        if (Array.isArray(data.heroSlides)) {
          setHeroSlidesState(data.heroSlides as HeroSlide[]);
          lsSet("heroSlides", data.heroSlides);
        }
      }
    }).finally(() => setIsSyncing(false));

    // Load submissions for authenticated admin
    if (token) {
      loadSubmissions();
    }
  }, []);

  const loadSubmissions = async () => {
    const data = await apiGetAuth<ContactSubmission[]>("/submissions");
    if (data) {
      setSubmissionsState(data);
      lsSet("submissions", data);
    } else {
      setSubmissionsState(lsGet("submissions", []));
    }
  };

  const setSchoolInfo = async (info: SchoolInfo) => {
    setSchoolInfoState(info);
    lsSet("schoolInfo", info);
    const ok = await apiPut("/data/schoolInfo", info);
    if (ok) {
      toast.success("School info updated successfully");
    } else {
      toast.success("School info saved locally");
    }
  };

  const setActivities = async (acts: Activity[]) => {
    setActivitiesState(acts);
    lsSet("activities", acts);
    await apiPut("/data/activities", acts);
  };

  const setNews = async (n: News[]) => {
    setNewsState(n);
    lsSet("news", n);
    await apiPut("/data/news", n);
  };

  const setGallery = async (g: GalleryImage[]) => {
    setGalleryState(g);
    lsSet("gallery", g);
    await apiPut("/data/gallery", g);
  };

  const setStaff = async (s: StaffMember[]) => {
    setStaffState(s);
    lsSet("staff", s);
    await apiPut("/data/staff", s);
  };

  const setTestimonials = async (t: Testimonial[]) => {
    setTestimonialsState(t);
    lsSet("testimonials", t);
    await apiPut("/data/testimonials", t);
  };

  const setAchievements = async (a: Achievement[]) => {
    setAchievementsState(a);
    lsSet("achievements", a);
    await apiPut("/data/achievements", a);
  };

  const setHeroSlides = async (s: HeroSlide[]) => {
    setHeroSlidesState(s);
    lsSet("heroSlides", s);
    await apiPut("/data/heroSlides", s);
  };

  const addSubmission = async (sub: Omit<ContactSubmission, "id" | "submittedAt">) => {
    const result = await apiPost<{ ok: boolean; id: string; submittedAt: string }>(
      "/submissions",
      sub
    );
    if (result) {
      const newSub: ContactSubmission = {
        ...sub,
        id: result.id,
        submittedAt: result.submittedAt,
      };
      const updated = [newSub, ...submissions];
      setSubmissionsState(updated);
      lsSet("submissions", updated);
      toast.success("Message sent successfully!");
    } else {
      // Fallback: save locally
      const newSub: ContactSubmission = {
        ...sub,
        id: Math.random().toString(36).substring(2, 9),
        submittedAt: new Date().toISOString(),
      };
      const updated = [newSub, ...submissions];
      setSubmissionsState(updated);
      lsSet("submissions", updated);
      toast.success("Message sent!");
    }
  };

  const deleteSubmission = async (id: string) => {
    const ok = await apiDelete(`/submissions/${id}`);
    const updated = submissions.filter(s => s.id !== id);
    setSubmissionsState(updated);
    lsSet("submissions", updated);
    if (ok) {
      toast.success("Submission deleted");
    } else {
      toast.success("Submission removed locally");
    }
  };

  const login = async (pw: string): Promise<boolean> => {
    const result = await apiPost<{ token: string; expiresAt: number }>(
      "/auth/login",
      { password: pw }
    );
    if (result) {
      saveAuthToken(result.token, result.expiresAt);
      setIsAuthenticated(true);
      // Load submissions after login
      await loadSubmissions();
      return true;
    }
    // Fallback: check against old localStorage credentials for offline use
    const credsStr = localStorage.getItem("dasbmse:credentials");
    if (credsStr) {
      try {
        const creds = JSON.parse(credsStr) as { passwordHash: string };
        if (btoa(pw) === creds.passwordHash) {
          setIsAuthenticated(true);
          setSubmissionsState(lsGet("submissions", []));
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearAuthToken();
    toast.info("Logged out successfully");
  };

  const STORAGE_KEYS = ["schoolInfo", "activities", "news", "gallery", "staff", "submissions", "testimonials", "achievements", "heroSlides"];

  const exportBackup = (): string => {
    const data: Record<string, unknown> = {
      _meta: {
        app: "DASBMSE",
        version: 1,
        exportedAt: new Date().toISOString(),
      },
    };
    for (const key of STORAGE_KEYS) {
      const raw = localStorage.getItem(`dasbmse:${key}`);
      data[key] = raw ? JSON.parse(raw) : null;
    }
    return JSON.stringify(data, null, 2);
  };

  const importBackup = (json: string): boolean => {
    try {
      const data = JSON.parse(json) as Record<string, unknown>;
      if (!data || typeof data !== "object") throw new Error("Invalid file");

      const importToApi = async () => {
        if (data.schoolInfo) await apiPut("/data/schoolInfo", data.schoolInfo);
        if (data.activities) await apiPut("/data/activities", data.activities);
        if (data.news) await apiPut("/data/news", data.news);
        if (data.gallery) await apiPut("/data/gallery", data.gallery);
        if (data.staff) await apiPut("/data/staff", data.staff);
        if (data.testimonials) await apiPut("/data/testimonials", data.testimonials);
        if (data.achievements) await apiPut("/data/achievements", data.achievements);
        if (data.heroSlides) await apiPut("/data/heroSlides", data.heroSlides);
        if (Array.isArray(data.submissions)) {
          await apiPost("/submissions/bulk", { submissions: data.submissions }, true);
        }
      };

      for (const key of STORAGE_KEYS) {
        if (data[key] !== undefined && data[key] !== null) {
          lsSet(key, data[key]);
        }
      }
      if (data.schoolInfo) setSchoolInfoState(data.schoolInfo as SchoolInfo);
      if (data.activities) setActivitiesState(data.activities as Activity[]);
      if (data.news) setNewsState(data.news as News[]);
      if (data.gallery) setGalleryState(data.gallery as GalleryImage[]);
      if (data.staff) setStaffState(data.staff as StaffMember[]);
      if (data.submissions) setSubmissionsState(data.submissions as ContactSubmission[]);
      if (data.testimonials) setTestimonialsState(data.testimonials as Testimonial[]);
      if (data.achievements) setAchievementsState(data.achievements as Achievement[]);
      if (data.heroSlides) setHeroSlidesState(data.heroSlides as HeroSlide[]);

      importToApi().catch(() => {});
      toast.success("Backup restored successfully");
      return true;
    } catch (e) {
      toast.error("Could not import backup: " + (e as Error).message);
      return false;
    }
  };

  const resetAllData = () => {
    for (const key of STORAGE_KEYS) localStorage.removeItem(`dasbmse:${key}`);
    localStorage.removeItem("dasbmse:visits");
    setSchoolInfoState(defaultSchoolInfo);
    setActivitiesState(defaultActivities);
    setNewsState(defaultNews);
    setGalleryState(defaultGallery);
    setStaffState(defaultStaff);
    setSubmissionsState([]);
    setTestimonialsState(defaultTestimonials);
    setAchievementsState(defaultAchievements);
    setHeroSlidesState(defaultHeroSlides);

    const resetApi = async () => {
      await apiPut("/data/schoolInfo", defaultSchoolInfo);
      await apiPut("/data/activities", defaultActivities);
      await apiPut("/data/news", defaultNews);
      await apiPut("/data/gallery", defaultGallery);
      await apiPut("/data/staff", defaultStaff);
      await apiPut("/data/testimonials", defaultTestimonials);
      await apiPut("/data/achievements", defaultAchievements);
      await apiPut("/data/heroSlides", defaultHeroSlides);
      await apiDelete("/submissions");
    };
    resetApi().catch(() => {});
    toast.success("All content reset to defaults");
  };

  const recordVisit = (path: string) => {
    if (typeof window === "undefined") return;
    if (path.startsWith("/admin")) return;
    try {
      const raw = localStorage.getItem("dasbmse:visits");
      const visits: { path: string; at: string }[] = raw ? JSON.parse(raw) : [];
      visits.push({ path, at: new Date().toISOString() });
      const trimmed = visits.slice(-2000);
      localStorage.setItem("dasbmse:visits", JSON.stringify(trimmed));
    } catch {
      // ignore localStorage errors (private mode, quota)
    }
  };

  const getStats = (): VisitStats => {
    let visits: { path: string; at: string }[] = [];
    try {
      const raw = localStorage.getItem("dasbmse:visits");
      if (raw) visits = JSON.parse(raw) as { path: string; at: string }[];
    } catch { /* noop */ }
    const perPageMap = new Map<string, number>();
    const dayMap = new Map<string, number>();
    for (const v of visits) {
      perPageMap.set(v.path, (perPageMap.get(v.path) || 0) + 1);
      const day = v.at.slice(0, 10);
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    }
    const last7: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      last7.push({ date: key, count: dayMap.get(key) || 0 });
    }
    return {
      totalVisits: visits.length,
      uniqueDays: dayMap.size,
      perPage: Array.from(perPageMap.entries())
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count),
      last7Days: last7,
      firstVisit: visits[0]?.at ?? null,
      lastVisit: visits[visits.length - 1]?.at ?? null,
    };
  };

  const changePassword = (_oldPw: string, _newPw: string) => {
    toast.error("Password changes must be made via the server environment settings.");
    return false;
  };

  return (
    <SchoolDataContext.Provider value={{
      schoolInfo, setSchoolInfo,
      activities, setActivities,
      news, setNews,
      gallery, setGallery,
      staff, setStaff,
      submissions, addSubmission, deleteSubmission,
      testimonials, setTestimonials,
      achievements, setAchievements,
      heroSlides, setHeroSlides,
      isAuthenticated, login, logout, changePassword,
      isLoaded, isSyncing,
      exportBackup, importBackup, resetAllData,
      recordVisit, getStats
    }}>
      {children}
    </SchoolDataContext.Provider>
  );
}

export const useSchoolData = () => {
  const ctx = useContext(SchoolDataContext);
  if (!ctx) throw new Error("useSchoolData must be used within SchoolDataProvider");
  return ctx;
};
