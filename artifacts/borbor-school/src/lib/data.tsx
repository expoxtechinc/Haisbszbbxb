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
  authorRole: string; // e.g. "Parent of Grade 7 student", "Class of 2024"
  quote: string;
  rating?: number; // 1-5
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

// Context Setup
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
  login: (pw: string) => boolean;
  logout: () => void;
  changePassword: (oldPw: string, newPw: string) => boolean;
  isLoaded: boolean;
  exportBackup: () => string;
  importBackup: (json: string) => boolean;
  resetAllData: () => void;
  recordVisit: (path: string) => void;
  getStats: () => VisitStats;
};

export type VisitStats = {
  totalVisits: number;
  uniqueDays: number;
  perPage: { path: string; count: number }[];
  last7Days: { date: string; count: number }[];
  firstVisit: string | null;
  lastVisit: string | null;
};

const SchoolDataContext = createContext<SchoolDataContextType | null>(null);

export function SchoolDataProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
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

  // Initialize from localStorage
  useEffect(() => {
    const load = (key: string, defaultValue: any) => {
      const stored = localStorage.getItem(`dasbmse:${key}`);
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { return defaultValue; }
      }
      localStorage.setItem(`dasbmse:${key}`, JSON.stringify(defaultValue));
      return defaultValue;
    };

    setSchoolInfoState(load("schoolInfo", defaultSchoolInfo));
    setActivitiesState(load("activities", defaultActivities));
    setNewsState(load("news", defaultNews));
    setGalleryState(load("gallery", defaultGallery));
    setStaffState(load("staff", defaultStaff));
    setSubmissionsState(load("submissions", []));
    setTestimonialsState(load("testimonials", defaultTestimonials));
    setAchievementsState(load("achievements", defaultAchievements));
    setHeroSlidesState(load("heroSlides", defaultHeroSlides));
    
    const auth = load("auth", { authenticated: false, timestamp: 0 });
    // Simple 24h session expiration for frontend demo
    if (auth.authenticated && Date.now() - auth.timestamp < 86400000) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.setItem("dasbmse:auth", JSON.stringify({ authenticated: false, timestamp: 0 }));
    }

    load("credentials", { email: "borborschool.admin@gmail.com", passwordHash: btoa("Admin2026") });

    setIsLoaded(true);
  }, []);

  const setSchoolInfo = (info: SchoolInfo) => {
    setSchoolInfoState(info);
    localStorage.setItem("dasbmse:schoolInfo", JSON.stringify(info));
    toast.success("School info updated successfully");
  };

  const setActivities = (acts: Activity[]) => {
    setActivitiesState(acts);
    localStorage.setItem("dasbmse:activities", JSON.stringify(acts));
  };

  const setNews = (n: News[]) => {
    setNewsState(n);
    localStorage.setItem("dasbmse:news", JSON.stringify(n));
  };

  const setGallery = (g: GalleryImage[]) => {
    setGalleryState(g);
    localStorage.setItem("dasbmse:gallery", JSON.stringify(g));
  };

  const setStaff = (s: StaffMember[]) => {
    setStaffState(s);
    localStorage.setItem("dasbmse:staff", JSON.stringify(s));
  };

  const setTestimonials = (t: Testimonial[]) => {
    setTestimonialsState(t);
    localStorage.setItem("dasbmse:testimonials", JSON.stringify(t));
  };

  const setAchievements = (a: Achievement[]) => {
    setAchievementsState(a);
    localStorage.setItem("dasbmse:achievements", JSON.stringify(a));
  };

  const setHeroSlides = (s: HeroSlide[]) => {
    setHeroSlidesState(s);
    localStorage.setItem("dasbmse:heroSlides", JSON.stringify(s));
  };

  const addSubmission = (sub: Omit<ContactSubmission, "id" | "submittedAt">) => {
    const newSub: ContactSubmission = {
      ...sub,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString()
    };
    const updated = [newSub, ...submissions];
    setSubmissionsState(updated);
    localStorage.setItem("dasbmse:submissions", JSON.stringify(updated));
    toast.success("Message sent successfully!");
  };

  const deleteSubmission = (id: string) => {
    const updated = submissions.filter(s => s.id !== id);
    setSubmissionsState(updated);
    localStorage.setItem("dasbmse:submissions", JSON.stringify(updated));
    toast.success("Submission deleted");
  };

  const login = (pw: string) => {
    const credsStr = localStorage.getItem("dasbmse:credentials");
    if (credsStr) {
      const creds = JSON.parse(credsStr);
      if (btoa(pw) === creds.passwordHash) {
        setIsAuthenticated(true);
        localStorage.setItem("dasbmse:auth", JSON.stringify({ authenticated: true, timestamp: Date.now() }));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("dasbmse:auth", JSON.stringify({ authenticated: false, timestamp: 0 }));
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
      const data = JSON.parse(json);
      if (!data || typeof data !== "object") throw new Error("Invalid file");
      for (const key of STORAGE_KEYS) {
        if (data[key] !== undefined && data[key] !== null) {
          localStorage.setItem(`dasbmse:${key}`, JSON.stringify(data[key]));
        }
      }
      if (data.schoolInfo) setSchoolInfoState(data.schoolInfo);
      if (data.activities) setActivitiesState(data.activities);
      if (data.news) setNewsState(data.news);
      if (data.gallery) setGalleryState(data.gallery);
      if (data.staff) setStaffState(data.staff);
      if (data.submissions) setSubmissionsState(data.submissions);
      if (data.testimonials) setTestimonialsState(data.testimonials);
      if (data.achievements) setAchievementsState(data.achievements);
      if (data.heroSlides) setHeroSlidesState(data.heroSlides);
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
      if (raw) visits = JSON.parse(raw);
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

  const changePassword = (oldPw: string, newPw: string) => {
    const credsStr = localStorage.getItem("dasbmse:credentials");
    if (credsStr) {
      const creds = JSON.parse(credsStr);
      if (btoa(oldPw) === creds.passwordHash) {
        creds.passwordHash = btoa(newPw);
        localStorage.setItem("dasbmse:credentials", JSON.stringify(creds));
        toast.success("Password updated successfully");
        return true;
      }
    }
    toast.error("Incorrect old password");
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
      isLoaded,
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
