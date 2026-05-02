import { motion } from "framer-motion";
import { Trophy, Medal, Award, Star } from "lucide-react";
import type { Achievement } from "@/lib/data";

const ICONS = { trophy: Trophy, medal: Medal, award: Award, star: Star };

export function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground font-semibold text-sm mb-4">
            Our Achievements
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
            Milestones We're Proud Of
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {achievements.map((a, i) => {
            const Icon = ICONS[a.icon ?? "trophy"];
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-start gap-4"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground">
                    {a.year}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl text-foreground">{a.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{a.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
