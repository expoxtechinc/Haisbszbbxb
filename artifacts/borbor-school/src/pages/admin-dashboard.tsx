import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Save, Plus, Trash2, Edit2, KeyRound, Upload, Users, Image as ImageIcon, Newspaper, Info, MessageSquare, Database, BarChart3, Download as DownloadIcon, RefreshCcw, Quote, Trophy, Sparkles, ClipboardList, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import { useSchoolData, SchoolInfo, Activity, News, StaffMember, GalleryImage, VisitStats, Testimonial, Achievement, HeroSlide, GalleryCategory } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { 
    isAuthenticated, logout, 
    schoolInfo, setSchoolInfo,
    activities, setActivities,
    news, setNews,
    staff, setStaff,
    gallery, setGallery,
    submissions, deleteSubmission,
    testimonials, setTestimonials,
    achievements, setAchievements,
    heroSlides, setHeroSlides,
    changePassword, isLoaded,
    exportBackup, importBackup, resetAllData,
    getStats
  } = useSchoolData();

  useEffect(() => {
    document.title = `Admin Dashboard | DASBMSE`;
    if (isLoaded && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, isLoaded, setLocation]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/20 pb-20">
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4 md:px-8 shadow-md relative z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full p-0.5">
              <img src="/images/school-logo.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
              <p className="text-primary-foreground/70 text-sm">Manage website content</p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 mt-8 flex-1">
        <Tabs defaultValue="info" className="w-full flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-64 shrink-0">
            <TabsList className="flex flex-col h-auto w-full bg-card border border-border/50 shadow-sm p-2 rounded-2xl gap-1">
              {[
                { val: "info", label: "School Info", icon: Info },
                { val: "hero", label: "Hero Slides", icon: Sparkles },
                { val: "activities", label: "Activities", icon: CalendarIcon },
                { val: "news", label: "News", icon: Newspaper },
                { val: "gallery", label: "Gallery", icon: ImageIcon },
                { val: "achievements", label: "Achievements", icon: Trophy },
                { val: "testimonials", label: "Testimonials", icon: Quote },
                { val: "staff", label: "Staff", icon: Users },
                { val: "applications", label: "Applications", icon: ClipboardList },
                { val: "messages", label: "Messages", icon: MessageSquare },
                { val: "stats", label: "Visit Stats", icon: BarChart3 },
                { val: "backup", label: "Backup", icon: Database },
                { val: "security", label: "Security", icon: KeyRound },
              ].map(tab => (
                <TabsTrigger 
                  key={tab.val} 
                  value={tab.val} 
                  className="w-full justify-start py-3 px-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium text-muted-foreground hover:bg-muted/50 data-[state=active]:hover:bg-primary transition-colors"
                >
                  <tab.icon className="w-4 h-4 mr-3 shrink-0" /> {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 min-w-0">
            <TabsContent value="info" className="mt-0 outline-none">
              <SchoolInfoEditor info={schoolInfo} onSave={setSchoolInfo} />
            </TabsContent>
            
            <TabsContent value="activities" className="mt-0 outline-none">
              <ItemsManager 
                items={activities} 
                onSave={setActivities} 
                title="Manage Activities" 
                emptyMsg="No activities found."
                renderForm={(item, onChange) => (
                  <>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={item?.title || ''} onChange={e => onChange({ ...item, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Date (Optional)</Label>
                      <Input value={item?.date || ''} onChange={e => onChange({ ...item, date: e.target.value })} placeholder="e.g. October 15, 2026" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={item?.description || ''} onChange={e => onChange({ ...item, description: e.target.value })} className="h-32" />
                    </div>
                  </>
                )}
                renderCard={(item) => (
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    {item.date && <p className="text-xs text-secondary font-medium mb-1">{item.date}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                )}
                createNew={() => ({ id: Math.random().toString(36).substr(2, 9), title: "", description: "", date: "" })}
              />
            </TabsContent>

            <TabsContent value="news" className="mt-0 outline-none">
              <ItemsManager 
                items={news} 
                onSave={setNews} 
                title="Manage News" 
                emptyMsg="No news articles found."
                renderForm={(item, onChange) => (
                  <>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={item?.title || ''} onChange={e => onChange({ ...item, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" value={item?.date ? new Date(item.date).toISOString().split('T')[0] : ''} onChange={e => onChange({ ...item, date: new Date(e.target.value).toISOString() })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Body Content</Label>
                      <Textarea value={item?.body || ''} onChange={e => onChange({ ...item, body: e.target.value })} className="h-40" />
                    </div>
                  </>
                )}
                renderCard={(item) => (
                  <div>
                    <div className="text-xs text-secondary font-medium mb-1">{new Date(item.date).toLocaleDateString()}</div>
                    <h4 className="font-bold line-clamp-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.body}</p>
                  </div>
                )}
                createNew={() => ({ id: Math.random().toString(36).substr(2, 9), title: "", body: "", date: new Date().toISOString() })}
              />
            </TabsContent>

            <TabsContent value="gallery" className="mt-0 outline-none">
              <GalleryManager gallery={gallery} onSave={setGallery} />
            </TabsContent>

            <TabsContent value="hero" className="mt-0 outline-none">
              <HeroSlidesManager slides={heroSlides} onSave={setHeroSlides} />
            </TabsContent>

            <TabsContent value="achievements" className="mt-0 outline-none">
              <AchievementsManager achievements={achievements} onSave={setAchievements} />
            </TabsContent>

            <TabsContent value="testimonials" className="mt-0 outline-none">
              <TestimonialsManager testimonials={testimonials} onSave={setTestimonials} />
            </TabsContent>

            <TabsContent value="staff" className="mt-0 outline-none">
              <StaffManager staff={staff} onSave={setStaff} />
            </TabsContent>

            <TabsContent value="applications" className="mt-0 outline-none">
              <ApplicationsManager />
            </TabsContent>

            <TabsContent value="messages" className="mt-0 outline-none">
              <SubmissionsViewer submissions={submissions} onDelete={deleteSubmission} />
            </TabsContent>

            <TabsContent value="stats" className="mt-0 outline-none">
              <VisitStatsViewer getStats={getStats} />
            </TabsContent>

            <TabsContent value="backup" className="mt-0 outline-none">
              <BackupManager exportBackup={exportBackup} importBackup={importBackup} resetAllData={resetAllData} />
            </TabsContent>

            <TabsContent value="security" className="mt-0 outline-none">
              <SecurityManager onChangePassword={changePassword} />
            </TabsContent>

          </div>
        </Tabs>
      </main>
    </div>
  );
}

// Reusable SVG for icon map
function CalendarIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  )
}

// Subcomponents

function SchoolInfoEditor({ info, onSave }: { info: SchoolInfo, onSave: (info: SchoolInfo) => void }) {
  const [formData, setFormData] = useState(info);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl">
        <CardTitle className="font-serif text-2xl text-primary">School Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>School Name</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Slogan</Label>
              <Input value={formData.slogan} onChange={e => setFormData({...formData, slogan: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Phones (comma separated)</Label>
              <Input value={formData.phones.join(", ")} onChange={e => setFormData({...formData, phones: e.target.value.split(",").map(s => s.trim())})} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input value={formData.facebookUrl} onChange={e => setFormData({...formData, facebookUrl: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Mission</Label>
            <Textarea value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Vision</Label>
            <Textarea value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>History</Label>
            <Textarea value={formData.history} onChange={e => setFormData({...formData, history: e.target.value})} className="min-h-[150px]"/>
          </div>

          <Button type="submit" className="w-full sm:w-auto px-8"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ItemsManager<T extends {id: string}>({ 
  items, onSave, title, emptyMsg, renderForm, renderCard, createNew 
}: { 
  items: T[], 
  onSave: (items: T[]) => void, 
  title: string, 
  emptyMsg: string,
  renderForm: (item: T, onChange: (i: T) => void) => React.ReactNode,
  renderCard: (item: T) => React.ReactNode,
  createNew: () => T
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<T | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenNew = () => {
    setEditingId(null);
    setEditDraft(createNew());
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: T) => {
    setEditingId(item.id);
    setEditDraft({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this item?")) {
      const updated = items.filter(i => i.id !== id);
      onSave(updated);
      toast.success("Item deleted");
    }
  };

  const handleSave = () => {
    if (!editDraft) return;
    
    let updated;
    if (editingId) {
      updated = items.map(i => i.id === editingId ? editDraft : i);
      toast.success("Item updated");
    } else {
      updated = [editDraft, ...items];
      toast.success("Item created");
    }
    onSave(updated);
    setIsDialogOpen(false);
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl flex flex-row items-center justify-between py-4">
        <CardTitle className="font-serif text-2xl text-primary m-0">{title}</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} size="sm"><Plus className="w-4 h-4 mr-1" /> Add New</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Item" : "Create New Item"}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {editDraft && renderForm(editDraft, (updated) => setEditDraft(updated))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="pt-6">
        {items.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">{emptyMsg}</div>
        ) : (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {items.map(item => (
              <div key={item.id} className="p-4 border rounded-xl flex items-start justify-between gap-4 bg-background shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 min-w-0">
                  {renderCard(item)}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const GALLERY_CATEGORY_OPTIONS: { value: Exclude<GalleryCategory, "all">; label: string }[] = [
  { value: "campus", label: "Campus" },
  { value: "events", label: "Events" },
  { value: "sports", label: "Sports" },
  { value: "academics", label: "Academics" },
  { value: "graduation", label: "Graduation" },
  { value: "community", label: "Community" },
];

function GalleryManager({ gallery, onSave }: { gallery: GalleryImage[], onSave: (g: GalleryImage[]) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<Exclude<GalleryCategory, "all">>("campus");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image too large. Please keep under 1MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImg: GalleryImage = {
        id: Math.random().toString(36).substr(2, 9),
        dataUrl: reader.result as string,
        caption: file.name,
        category: uploadCategory,
        uploadedAt: new Date().toISOString()
      };
      onSave([newImg, ...gallery]);
      toast.success("Image uploaded successfully");
      setIsUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    if(confirm("Delete this image from gallery?")) {
      onSave(gallery.filter(g => g.id !== id));
      toast.success("Image deleted");
    }
  };

  const handleCategoryChange = (id: string, category: Exclude<GalleryCategory, "all">) => {
    onSave(gallery.map(g => g.id === id ? { ...g, category } : g));
  };

  const handleCaptionChange = (id: string, caption: string) => {
    onSave(gallery.map(g => g.id === id ? { ...g, caption } : g));
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl flex flex-row items-center justify-between py-4 gap-3 flex-wrap">
        <CardTitle className="font-serif text-2xl text-primary m-0">Manage Gallery</CardTitle>
        <div className="flex items-center gap-2">
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value as Exclude<GalleryCategory, "all">)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Upload category"
          >
            {GALLERY_CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" ref={fileInputRef} onChange={handleUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} size="sm">
            <Upload className="w-4 h-4 mr-2" /> {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {gallery.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-background">No images in gallery yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map(img => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border shadow-sm bg-background flex flex-col">
                <div className="relative aspect-square">
                  <img src={img.dataUrl} alt={img.caption} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <Input
                    value={img.caption}
                    onChange={(e) => handleCaptionChange(img.id, e.target.value)}
                    className="h-8 text-xs"
                    placeholder="Caption"
                  />
                  <select
                    value={img.category ?? "campus"}
                    onChange={(e) => handleCategoryChange(img.id, e.target.value as Exclude<GalleryCategory, "all">)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    aria-label="Category"
                  >
                    {GALLERY_CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HeroSlidesManager({ slides, onSave }: { slides: HeroSlide[], onSave: (s: HeroSlide[]) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image too large. Please keep under 1MB.");
      return;
    }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const newSlide: HeroSlide = {
        id: Math.random().toString(36).substr(2, 9),
        imageDataUrl: reader.result as string,
        headline: "New Slide",
        subline: "",
      };
      onSave([...slides, newSlide]);
      toast.success("Slide added");
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      toast.error("Failed to read image");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const update = (id: string, patch: Partial<HeroSlide>) => {
    onSave(slides.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const remove = (id: string) => {
    if (confirm("Delete this slide?")) {
      onSave(slides.filter(s => s.id !== id));
    }
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = slides.findIndex(s => s.id === id);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= slides.length) return;
    const copy = [...slides];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    onSave(copy);
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl flex flex-row items-center justify-between py-4">
        <CardTitle className="font-serif text-2xl text-primary m-0">Hero Slideshow</CardTitle>
        <div>
          <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" ref={fileInputRef} onChange={handleUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} size="sm">
            <Upload className="w-4 h-4 mr-2" /> {isUploading ? "Uploading..." : "Add Slide"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm text-muted-foreground">Slides auto-rotate on the home page every ~5.5 seconds. Keep images under 1 MB and roughly 16:9 for best results.</p>
        {slides.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-background">No hero slides yet. Add one to start.</div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, i) => (
              <div key={slide.id} className="flex flex-col md:flex-row gap-4 p-3 border rounded-xl bg-background">
                <img src={slide.imageDataUrl} alt={slide.headline} className="w-full md:w-48 h-32 object-cover rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Input value={slide.headline} onChange={(e) => update(slide.id, { headline: e.target.value })} placeholder="Headline" />
                  <Input value={slide.subline ?? ""} onChange={(e) => update(slide.id, { subline: e.target.value })} placeholder="Optional subline" />
                </div>
                <div className="flex md:flex-col items-end gap-2">
                  <Button size="icon" variant="outline" onClick={() => move(slide.id, -1)} disabled={i === 0} aria-label="Move up">↑</Button>
                  <Button size="icon" variant="outline" onClick={() => move(slide.id, 1)} disabled={i === slides.length - 1} aria-label="Move down">↓</Button>
                  <Button size="icon" variant="destructive" onClick={() => remove(slide.id)} aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AchievementsManager({ achievements, onSave }: { achievements: Achievement[], onSave: (a: Achievement[]) => void }) {
  const [draft, setDraft] = useState<Achievement | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => {
    setDraft({ id: Math.random().toString(36).substr(2, 9), title: "", description: "", year: new Date().getFullYear().toString(), icon: "trophy" });
    setOpen(true);
  };
  const openEdit = (a: Achievement) => {
    setDraft({ ...a });
    setOpen(true);
  };
  const save = () => {
    if (!draft) return;
    if (!draft.title || !draft.description) { toast.error("Title and description are required"); return; }
    const exists = achievements.some(a => a.id === draft.id);
    onSave(exists ? achievements.map(a => a.id === draft.id ? draft : a) : [...achievements, draft]);
    toast.success(exists ? "Achievement updated" : "Achievement added");
    setOpen(false);
  };
  const remove = (id: string) => {
    if (confirm("Delete this achievement?")) onSave(achievements.filter(a => a.id !== id));
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl flex flex-row items-center justify-between py-4">
        <CardTitle className="font-serif text-2xl text-primary m-0">Achievements</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Add</Button>
      </CardHeader>
      <CardContent className="pt-6">
        {achievements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-background">No achievements yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map(a => (
              <div key={a.id} className="p-4 border rounded-xl bg-background flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold truncate">{a.title}</h4>
                    <span className="text-xs px-2 py-0.5 bg-secondary/20 rounded-full">{a.year}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{a.description}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(a)} aria-label="Edit"><Edit2 className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(a.id)} aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{achievements.some(a => a.id === draft?.id) ? "Edit" : "Add"} Achievement</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Year</Label><Input value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="h-28" /></div>
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <select
                  value={draft.icon ?? "trophy"}
                  onChange={(e) => setDraft({ ...draft, icon: e.target.value as Achievement["icon"] })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="trophy">Trophy</option>
                  <option value="medal">Medal</option>
                  <option value="award">Award</option>
                  <option value="star">Star</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}><Save className="w-4 h-4 mr-2" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function TestimonialsManager({ testimonials, onSave }: { testimonials: Testimonial[], onSave: (t: Testimonial[]) => void }) {
  const [draft, setDraft] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setDraft({ id: Math.random().toString(36).substr(2, 9), authorName: "", authorRole: "", quote: "", rating: 5, createdAt: new Date().toISOString() });
    setOpen(true);
  };
  const openEdit = (t: Testimonial) => {
    setDraft({ ...t });
    setOpen(true);
  };
  const save = () => {
    if (!draft) return;
    if (!draft.authorName || !draft.quote) { toast.error("Author name and quote are required"); return; }
    const exists = testimonials.some(t => t.id === draft.id);
    onSave(exists ? testimonials.map(t => t.id === draft.id ? draft : t) : [...testimonials, draft]);
    toast.success(exists ? "Testimonial updated" : "Testimonial added");
    setOpen(false);
  };
  const remove = (id: string) => {
    if (confirm("Delete this testimonial?")) onSave(testimonials.filter(t => t.id !== id));
  };
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !draft) return;
    if (file.size > MAX_IMAGE_SIZE) { toast.error("Image too large (max 1MB)"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setDraft({ ...draft, photoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl flex flex-row items-center justify-between py-4">
        <CardTitle className="font-serif text-2xl text-primary m-0">Testimonials</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Add</Button>
      </CardHeader>
      <CardContent className="pt-6">
        {testimonials.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-background">No testimonials yet.</div>
        ) : (
          <div className="space-y-3">
            {testimonials.map(t => (
              <div key={t.id} className="p-4 border rounded-xl bg-background flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden shrink-0">
                  {t.photoDataUrl
                    ? <img src={t.photoDataUrl} alt={t.authorName} className="w-full h-full object-cover" />
                    : <span>{t.authorName.charAt(0) || "?"}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold truncate">{t.authorName}</h4>
                    <span className="text-xs text-muted-foreground truncate">{t.authorRole}</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic line-clamp-2 mt-1">"{t.quote}"</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(t)} aria-label="Edit"><Edit2 className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(t.id)} aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{testimonials.some(t => t.id === draft?.id) ? "Edit" : "Add"} Testimonial</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Author name</Label><Input value={draft.authorName} onChange={(e) => setDraft({ ...draft, authorName: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Role / relationship</Label><Input value={draft.authorRole} onChange={(e) => setDraft({ ...draft, authorRole: e.target.value })} placeholder="Parent, Alumnus, Grade 6 Student…" /></div>
              <div className="space-y-1.5"><Label>Quote</Label><Textarea value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} className="h-28" /></div>
              <div className="space-y-1.5">
                <Label>Rating (0–5)</Label>
                <Input type="number" min={0} max={5} value={draft.rating ?? 5} onChange={(e) => setDraft({ ...draft, rating: Math.min(5, Math.max(0, Number(e.target.value) || 0)) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Photo (optional, &lt; 1 MB)</Label>
                <input type="file" accept="image/jpeg, image/png, image/webp" ref={photoInputRef} onChange={handlePhoto} className="hidden" />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload photo
                  </Button>
                  {draft.photoDataUrl && (
                    <Button variant="ghost" size="sm" onClick={() => setDraft({ ...draft, photoDataUrl: undefined })}>Remove</Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}><Save className="w-4 h-4 mr-2" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function StaffManager({ staff, onSave }: { staff: StaffMember[], onSave: (s: StaffMember[]) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<StaffMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenNew = () => {
    setEditingId(null);
    setEditDraft({ id: Math.random().toString(36).substr(2, 9), name: "", role: "", bio: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setEditingId(member.id);
    setEditDraft({ ...member });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if(confirm("Remove this staff member?")) {
      onSave(staff.filter(s => s.id !== id));
      toast.success("Staff member removed");
    }
  };

  const handleSave = () => {
    if (!editDraft) return;
    if (!editDraft.name || !editDraft.role) {
      toast.error("Name and role are required");
      return;
    }
    
    let updated;
    if (editingId) {
      updated = staff.map(s => s.id === editingId ? editDraft : s);
      toast.success("Staff member updated");
    } else {
      updated = [...staff, editDraft];
      toast.success("Staff member added");
    }
    onSave(updated);
    setIsDialogOpen(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editDraft) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image too large. Please keep under 1MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditDraft({ ...editDraft, photoDataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl flex flex-row items-center justify-between py-4">
        <CardTitle className="font-serif text-2xl text-primary m-0">Manage Staff</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Staff</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-20 h-20 rounded-full border-2 border-primary overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                  {editDraft?.photoDataUrl ? (
                    <img src={editDraft.photoDataUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Upload Photo</Button>
                  <p className="text-xs text-muted-foreground mt-2">Max size: 1MB</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={editDraft?.name || ''} onChange={e => editDraft && setEditDraft({ ...editDraft, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role / Title</Label>
                <Input value={editDraft?.role || ''} onChange={e => editDraft && setEditDraft({ ...editDraft, role: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Short Bio (Optional)</Label>
                <Textarea value={editDraft?.bio || ''} onChange={e => editDraft && setEditDraft({ ...editDraft, bio: e.target.value })} className="h-24" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {staff.map(member => (
            <div key={member.id} className="p-4 border rounded-xl flex flex-col items-center text-center bg-background shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(member)}><Edit2 className="w-3.5 h-3.5" /></Button>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(member.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
              <div className="w-24 h-24 rounded-full border-2 border-muted overflow-hidden mb-4">
                {member.photoDataUrl ? (
                  <img src={member.photoDataUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <h4 className="font-bold text-foreground line-clamp-1 w-full">{member.name}</h4>
              <p className="text-sm text-secondary font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionsViewer({ submissions, onDelete }: { submissions: any[], onDelete: (id: string) => void }) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl py-4">
        <CardTitle className="font-serif text-2xl text-primary m-0">Contact Submissions</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {submissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-background">No messages received yet.</div>
        ) : (
          <div className="space-y-4">
            {submissions.map(sub => (
              <div key={sub.id} className="p-5 border rounded-xl bg-background shadow-sm relative pr-12">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 text-destructive hover:bg-destructive/10"
                  onClick={() => confirm("Delete this message?") && onDelete(sub.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-3 border-b pb-3">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">From</span>
                    <p className="font-bold">{sub.name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Contact</span>
                    <p className="text-sm">{sub.email} <span className="text-muted-foreground mx-1">•</span> {sub.phone}</p>
                  </div>
                  <div className="sm:ml-auto text-left sm:text-right">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Received</span>
                    <p className="text-sm text-secondary font-medium">{new Date(sub.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-foreground whitespace-pre-wrap">{sub.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SecurityManager({ onChangePassword }: { onChangePassword: (o: string, n: string) => boolean }) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newPw !== confirmPw) {
      toast.error("New passwords do not match");
      return;
    }
    if(newPw.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const success = onChangePassword(oldPw, newPw);
    if(success) {
      setOldPw("");
      setNewPw("");
      setConfirmPw("");
    }
  };

  return (
    <Card className="border-border/50 shadow-sm max-w-2xl">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl py-4">
        <CardTitle className="font-serif text-2xl text-primary m-0">Change Password</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
          </div>
          <Button type="submit" className="mt-4"><Save className="w-4 h-4 mr-2" /> Update Password</Button>
        </form>
      </CardContent>
    </Card>
  );
}
function VisitStatsViewer({ getStats }: { getStats: () => VisitStats }) {
  const [stats, setStats] = useState<VisitStats>(() => getStats());

  useEffect(() => {
    setStats(getStats());
    const id = setInterval(() => setStats(getStats()), 5000);
    return () => clearInterval(id);
  }, [getStats]);

  const refresh = () => {
    setStats(getStats());
    toast.success("Stats refreshed");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl py-4 flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-2xl text-primary m-0">Visit Statistics</CardTitle>
          <Button variant="outline" size="sm" onClick={refresh} className="gap-2">
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Visits" value={stats.totalVisits} />
            <StatCard label="Active Days" value={stats.uniqueDays} />
            <StatCard label="Today" value={stats.last7Days[stats.last7Days.length - 1]?.count ?? 0} />
            <StatCard label="Last 7 Days" value={stats.last7Days.reduce((s, d) => s + d.count, 0)} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {stats.firstVisit && <>First visit: {new Date(stats.firstVisit).toLocaleString()} · </>}
            {stats.lastVisit && <>Last visit: {new Date(stats.lastVisit).toLocaleString()}</>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl py-4">
          <CardTitle className="font-serif text-xl text-primary m-0">Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-end gap-2 h-32">
            {stats.last7Days.map(d => {
              const max = Math.max(1, ...stats.last7Days.map(x => x.count));
              const h = Math.round((d.count / max) * 100);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary/20 rounded-t-md relative" style={{ height: `${h}%`, minHeight: d.count > 0 ? '8px' : '2px' }}>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-primary">{d.count || ''}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{d.date.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl py-4">
          <CardTitle className="font-serif text-xl text-primary m-0">Top Pages</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {stats.perPage.length === 0 ? (
            <p className="text-muted-foreground text-sm">No visits recorded yet.</p>
          ) : (
            <ul className="divide-y divide-border/50">
              {stats.perPage.slice(0, 10).map((p) => (
                <li key={p.path} className="py-3 flex items-center justify-between gap-4">
                  <span className="font-mono text-sm truncate">{p.path}</span>
                  <span className="text-sm font-semibold text-primary shrink-0">{p.count} {p.count === 1 ? 'visit' : 'visits'}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border/50 text-center">
      <div className="text-3xl font-bold text-primary">{value.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function BackupManager({
  exportBackup,
  importBackup,
  resetAllData,
}: {
  exportBackup: () => string;
  importBackup: (json: string) => boolean;
  resetAllData: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    try {
      const json = exportBackup();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
      a.href = url;
      a.download = `dasbmse-backup-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded");
    } catch (e) {
      toast.error("Export failed");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importBackup(String(reader.result || ""));
      if (ok) {
        toast.success("Backup restored. Reloading...");
        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 5000);
      return;
    }
    resetAllData();
    toast.success("All data reset to defaults. Reloading...");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl py-4">
          <CardTitle className="font-serif text-2xl text-primary m-0">Backup & Restore</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Export a full backup of school info, activities, news, gallery, staff, and submissions. Import a previously saved backup to restore data.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleExport} className="gap-2">
              <DownloadIcon className="w-4 h-4" /> Export Backup (.json)
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
              <Upload className="w-4 h-4" /> Import Backup
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40 shadow-sm">
        <CardHeader className="bg-destructive/5 border-b border-destructive/30 rounded-t-xl py-4">
          <CardTitle className="font-serif text-2xl text-destructive m-0">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Reset every section back to default content. This cannot be undone — export a backup first.
          </p>
          <Button variant="destructive" onClick={handleReset} className="gap-2">
            <Trash2 className="w-4 h-4" />
            {confirmReset ? "Click again to confirm reset" : "Reset All Data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

type ApplicationDoc = { name: string; type: string; dataUrl: string; size: number };
type Application = {
  id: string;
  studentName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  parentName: string;
  relationship: string;
  parentPhone: string;
  parentEmail: string;
  parentAddress: string;
  gradeApplying: string;
  academicYear: string;
  previousSchool: string;
  hasSpecialNeeds: boolean;
  specialNeedsDetails: string;
  additionalNotes: string;
  documents: Record<string, ApplicationDoc>;
  status: string;
  adminNotes: string | null;
  submittedAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-800 border-blue-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  reviewing: <Eye className="w-3.5 h-3.5" />,
  accepted: <CheckCircle2 className="w-3.5 h-3.5" />,
  rejected: <XCircle className="w-3.5 h-3.5" />,
};

const DOC_LABELS: Record<string, string> = {
  passport_photo: "Passport Photo",
  birth_certificate: "Birth Certificate",
  school_report: "School Report",
  medical_certificate: "Medical Certificate",
};

function ApplicationsManager() {
  const { isAuthenticated } = useSchoolData();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("dasbmse:authToken") ?? "" : "";

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed");
      setApps(await res.json());
    } catch {
      toast.error("Could not load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAuthenticated) fetchApps(); }, [isAuthenticated]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, notes: statusNote }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Status updated to "${status}"`);
      setSelected(prev => prev ? { ...prev, status, adminNotes: statusNote } : null);
      await fetchApps();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Delete this application permanently?")) return;
    try {
      await fetch(`/api/applications/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      toast.success("Application deleted");
      setSelected(null);
      await fetchApps();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const counts: Record<string, number> = { pending: 0, reviewing: 0, accepted: 0, rejected: 0 };
  apps.forEach(a => { if (a.status in counts) counts[a.status]++; });

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-2xl text-primary">Enrollment Applications</CardTitle>
          <Button size="sm" variant="outline" onClick={fetchApps} disabled={loading} className="gap-2">
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {(["pending", "reviewing", "accepted", "rejected"] as const).map(s => (
            <span key={s} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[s]}`}>
              {STATUS_ICONS[s]} {s.charAt(0).toUpperCase() + s.slice(1)}: {counts[s]}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {loading ? (
          <p className="text-muted-foreground text-sm text-center py-8">Loading applications…</p>
        ) : apps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No applications received yet.</p>
            <p className="text-xs mt-1">Applications submitted via the <strong>/enroll</strong> page will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app) => (
              <div
                key={app.id}
                onClick={() => { setSelected(app); setStatusNote(app.adminNotes ?? ""); }}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">{app.studentName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Grade: <span className="font-medium">{app.gradeApplying}</span> · {app.academicYear} · Parent: {app.parentName}
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(app.submittedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</div>
                </div>
                <span className={`ml-3 shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[app.status] ?? ""}`}>
                  {STATUS_ICONS[app.status]} {app.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl text-primary">Application — {selected.studentName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  {([
                    ["Student Name", selected.studentName],
                    ["Date of Birth", selected.dateOfBirth],
                    ["Gender", selected.gender],
                    ["Nationality", selected.nationality],
                    ["Grade Applying", selected.gradeApplying],
                    ["Academic Year", selected.academicYear],
                    ["Previous School", selected.previousSchool || "—"],
                    ["Special Needs", selected.hasSpecialNeeds ? "Yes" : "No"],
                    ["Parent / Guardian", selected.parentName],
                    ["Relationship", selected.relationship],
                    ["Phone", selected.parentPhone],
                    ["Email", selected.parentEmail],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label}>
                      <div className="text-xs text-muted-foreground font-medium">{label}</div>
                      <div className="font-medium text-foreground">{val}</div>
                    </div>
                  ))}
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground font-medium">Home Address</div>
                    <div className="font-medium text-foreground">{selected.parentAddress}</div>
                  </div>
                  {selected.specialNeedsDetails && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground font-medium">Special Needs Details</div>
                      <div className="text-foreground">{selected.specialNeedsDetails}</div>
                    </div>
                  )}
                  {selected.additionalNotes && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground font-medium">Additional Notes</div>
                      <div className="text-foreground">{selected.additionalNotes}</div>
                    </div>
                  )}
                </div>

                {Object.keys(selected.documents).length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground font-medium mb-2">Submitted Documents</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selected.documents).map(([key, doc]) => (
                        <a
                          key={key}
                          href={doc.dataUrl}
                          download={doc.name}
                          className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 hover:border-primary/40 hover:bg-muted/30 transition-colors"
                        >
                          <DownloadIcon className="w-4 h-4 text-primary shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-medium truncate">{DOC_LABELS[key] ?? key}</div>
                            <div className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(0)} KB</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border/50 pt-4 space-y-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Update Status</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["pending", "reviewing", "accepted", "rejected"] as const).map(s => (
                      <Button
                        key={s}
                        size="sm"
                        variant={selected.status === s ? "default" : "outline"}
                        disabled={updatingId === selected.id}
                        onClick={() => updateStatus(selected.id, s)}
                        className="gap-1.5 capitalize"
                      >
                        {STATUS_ICONS[s]} {s}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Admin Note (optional)</Label>
                    <Textarea
                      value={statusNote}
                      onChange={e => setStatusNote(e.target.value)}
                      placeholder="Internal note visible only to admin…"
                      className="resize-none h-20 text-sm"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 flex-wrap">
                <Button variant="destructive" size="sm" onClick={() => deleteApp(selected.id)} className="gap-2">
                  <Trash2 className="w-4 h-4" /> Delete Application
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
