import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/data";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-card border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground font-semibold text-sm mb-4">
            What People Say
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
            Voices from Our Community
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Parents, students, and graduates share their experience at DASBMSE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="bg-background rounded-2xl border border-border/50 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow relative"
            >
              <Quote className="w-8 h-8 text-secondary/30 absolute top-4 right-4" />
              {typeof t.rating === "number" && t.rating > 0 && (
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${idx < t.rating! ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              )}
              <blockquote className="text-foreground leading-relaxed flex-1 italic">
                "{t.quote}"
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-3 border-t border-border/50">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden shrink-0">
                  {t.photoDataUrl ? (
                    <img src={t.photoDataUrl} alt={t.authorName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{t.authorName.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-foreground truncate">{t.authorName}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.authorRole}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
