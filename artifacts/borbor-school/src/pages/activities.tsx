import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Image as ImageIcon, Newspaper, X, ZoomIn } from "lucide-react";
import { useSchoolData } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/seo";

const GALLERY_CATEGORIES: { value: import("@/lib/data").GalleryCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "campus", label: "Campus" },
  { value: "events", label: "Events" },
  { value: "sports", label: "Sports" },
  { value: "academics", label: "Academics" },
  { value: "graduation", label: "Graduation" },
  { value: "community", label: "Community" },
];

export default function Activities() {
  const { schoolInfo, activities, news, gallery } = useSchoolData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<import("@/lib/data").GalleryCategory>("all");

  const filteredGallery = galleryFilter === "all"
    ? gallery
    : gallery.filter((g) => (g.category ?? "campus") === galleryFilter);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="flex flex-col w-full pb-20">
      <Seo
        title={`Activities, News & Gallery — ${schoolInfo.name} (DASBMSE)`}
        description={`Latest news, events, photo gallery and student activities at Dr. Abraham S. Borbor Memorial School Of Excellence (DASBMSE) in Mount Barclay, Liberia.`}
        path="/activities"
      />
      <section className="bg-primary pt-20 pb-16 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            Campus Life
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            News, events, and moments that make up the vibrant community at DASBMSE.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12">
        <Tabs defaultValue="news" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-muted/50 p-1.5 rounded-full">
              <TabsTrigger value="news" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
                <Newspaper className="w-4 h-4" /> News & Updates
              </TabsTrigger>
              <TabsTrigger value="events" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
                <Calendar className="w-4 h-4" /> Events
              </TabsTrigger>
              <TabsTrigger value="gallery" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
                <ImageIcon className="w-4 h-4" /> Gallery
              </TabsTrigger>
            </TabsList>
          </div>

          {/* NEWS TAB */}
          <TabsContent value="news" className="mt-0 focus-visible:outline-none min-h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {news.length > 0 ? (
                news.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="h-full border-border/50 shadow-sm overflow-hidden flex flex-col">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="bg-primary/5 px-6 py-4 border-b border-border/50">
                          <div className="text-sm font-medium text-secondary mb-1">
                            {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                          <h3 className="text-xl font-bold font-serif text-primary">{item.title}</h3>
                        </div>
                        <div className="p-6 flex-1 bg-card">
                          <p className="text-foreground whitespace-pre-wrap leading-relaxed">{item.body}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-20 bg-card rounded-2xl border border-dashed border-border/50">
                  <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No news published yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="mt-0 focus-visible:outline-none min-h-[400px]">
            <div className="max-w-4xl mx-auto bg-card rounded-3xl shadow-sm border border-border/50 overflow-hidden">
              {activities.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {activities.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:bg-accent/5 transition-colors"
                    >
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold font-serif text-foreground mb-2">{activity.title}</h3>
                        {activity.date && (
                          <div className="inline-block px-3 py-1 bg-secondary/20 text-secondary-foreground text-sm font-semibold rounded-md mb-3">
                            {activity.date}
                          </div>
                        )}
                        <p className="text-muted-foreground leading-relaxed text-lg">{activity.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No events scheduled at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* GALLERY TAB */}
          <TabsContent value="gallery" className="mt-0 focus-visible:outline-none min-h-[400px]">
            {gallery.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {GALLERY_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setGalleryFilter(cat.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      galleryFilter === cat.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border/50 hover:bg-accent/10"
                    }`}
                    aria-pressed={galleryFilter === cat.value}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
            {filteredGallery.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredGallery.map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (i % 6) * 0.1 }}
                    className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-border/50 bg-card"
                    onClick={() => setSelectedImage(img.dataUrl)}
                  >
                    <img 
                      src={img.dataUrl} 
                      alt={img.caption} 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <ZoomIn className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity delay-100" />
                      <p className="text-white font-medium text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border/50 max-w-4xl mx-auto">
                <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {gallery.length === 0
                    ? "The gallery is currently empty."
                    : "No photos in this category yet."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image itself
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}