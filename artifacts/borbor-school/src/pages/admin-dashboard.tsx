import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Save, Plus, Trash2, Edit2, KeyRound, Upload, Users, Image as ImageIcon, Newspaper, Info, MessageSquare } from "lucide-react";
import { useSchoolData, SchoolInfo, Activity, News, StaffMember, GalleryImage } from "@/lib/data";
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
    changePassword, isLoaded
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
                { val: "activities", label: "Activities", icon: CalendarIcon },
                { val: "news", label: "News", icon: Newspaper },
                { val: "gallery", label: "Gallery", icon: ImageIcon },
                { val: "staff", label: "Staff", icon: Users },
                { val: "messages", label: "Messages", icon: MessageSquare },
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

            <TabsContent value="staff" className="mt-0 outline-none">
              <StaffManager staff={staff} onSave={setStaff} />
            </TabsContent>

            <TabsContent value="messages" className="mt-0 outline-none">
              <SubmissionsViewer submissions={submissions} onDelete={deleteSubmission} />
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

function GalleryManager({ gallery, onSave }: { gallery: GalleryImage[], onSave: (g: GalleryImage[]) => void }) {
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
      const newImg: GalleryImage = {
        id: Math.random().toString(36).substr(2, 9),
        dataUrl: reader.result as string,
        caption: file.name,
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

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl flex flex-row items-center justify-between py-4">
        <CardTitle className="font-serif text-2xl text-primary m-0">Manage Gallery</CardTitle>
        <div>
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
              <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border shadow-sm">
                <img src={img.dataUrl} alt={img.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(img.id)} className="translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
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