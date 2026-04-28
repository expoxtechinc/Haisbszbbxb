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

export type GalleryImage = {
  id: string;
  dataUrl: string;
  caption: string;
  uploadedAt: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  photoDataUrl?: string;
  bio?: string;
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
  { id: "1", dataUrl: "/images/graduates.jpg", caption: "Class of 2024–2025 Graduation Day", uploadedAt: new Date().toISOString() }
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
  isAuthenticated: boolean;
  login: (pw: string) => boolean;
  logout: () => void;
  changePassword: (oldPw: string, newPw: string) => boolean;
  isLoaded: boolean;
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
      isAuthenticated, login, logout, changePassword,
      isLoaded
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
