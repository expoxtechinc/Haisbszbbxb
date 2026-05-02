import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users, Trophy, ChevronRight } from "lucide-react";
import { useSchoolData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Seo } from "@/components/seo";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { TestimonialsSection } from "@/components/testimonials-section";
import { AchievementsSection } from "@/components/achievements-section";

export default function Home() {
  const { schoolInfo, news, staff, testimonials, achievements, heroSlides } = useSchoolData();

  const whatsappLink = `https://wa.me/${schoolInfo?.whatsapp?.replace(/\D/g, '')}?text=Hello,%20I%20am%20interested%20in%20enrolling%20my%20child%20at%20DASBMSE.`;

  return (
    <div className="flex flex-col w-full">
      <Seo
        title={`${schoolInfo.name} — DR. ABRAHAM S. BORBOR SCHOOL, Mount Barclay, Liberia`}
        description={`${schoolInfo.name} (DASBMSE). ${schoolInfo.slogan} A Christian primary, junior high, and senior high school in Mount Barclay, Lower Johnsonville, Monrovia, Liberia.`}
        path="/"
        schoolInfo={schoolInfo}
      />
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-12 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-2xl mx-auto border-4 border-secondary/20">
              <img src="/images/school-logo.jpg" alt="DASBMSE Logo" className="w-full h-full object-cover rounded-full" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-6 max-w-4xl leading-tight"
          >
            Dr. Abraham S. Borbor <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              Memorial School
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-secondary rounded-full transform -skew-x-12"></span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl italic font-serif text-muted-foreground mb-10"
          >
            "{schoolInfo.slogan}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button asChild size="lg" className="text-lg px-8 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Enroll Now <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 h-14 rounded-full border-2 border-primary text-primary hover:bg-primary/5">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>

          {heroSlides.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="w-full max-w-5xl mt-14"
            >
              <HeroSlideshow slides={heroSlides} />
            </motion.div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-card border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Quality Education", desc: "Rigorous academic programs designed to challenge and inspire." },
              { icon: Trophy, title: "Excellence", desc: "Striving for the highest standards in all our endeavors." },
              { icon: Users, title: "Discipline", desc: "Fostering character, responsibility, and strong moral values." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-accent/10 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 transform rotate-3">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src="/images/graduates.jpg" alt="Students" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-serif text-xl font-medium">Shaping the leaders of tomorrow in Mount Barclay.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 flex flex-col items-start"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground font-semibold text-sm mb-6">
                About DASBMSE
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-6">
                A Legacy of Learning
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {schoolInfo.history}
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our mission is {schoolInfo.mission.toLowerCase()}
              </p>
              <Button asChild variant="outline" className="rounded-full px-6 group">
                <Link href="/about">
                  Read Our Full Story <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Academic Programs</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">Comprehensive educational pathways designed to nurture students at every stage of their development.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Primary", desc: "Building a strong foundation in core subjects, curiosity, and character.", color: "bg-white text-primary" },
              { title: "Junior High", desc: "Expanding horizons through structured learning and critical thinking.", color: "bg-secondary text-secondary-foreground" },
              { title: "Senior High", desc: "Preparing young adults for higher education and global leadership.", color: "bg-primary-foreground/10 text-white border border-white/20" }
            ].map((prog, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`${prog.color} p-8 rounded-3xl flex flex-col items-start shadow-xl`}
              >
                <h3 className="text-2xl font-serif font-bold mb-4">{prog.title}</h3>
                <p className="opacity-90 mb-8 flex-1">{prog.desc}</p>
                <Button asChild variant="link" className={`p-0 h-auto ${i===2 ? 'text-white' : 'text-current'} font-semibold group`}>
                  <Link href="/academics">
                    Learn more <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground font-semibold text-sm mb-6">
            Leadership
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-12">Meet Our Leaders</h2>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {staff.slice(0, 2).map((member, i) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center max-w-xs"
              >
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-accent shadow-xl mb-6">
                  {member.photoDataUrl ? (
                    <img src={member.photoDataUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-4xl text-muted-foreground font-serif">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold font-serif text-foreground">{member.name}</h3>
                <p className="text-secondary font-medium mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/staff">View All Staff</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Preview */}
      {news.length > 0 && (
        <section className="py-20 bg-card border-t border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-2">Latest News</h2>
                <p className="text-muted-foreground">Updates from our community</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex">
                <Link href="/activities">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.slice(0, 2).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-secondary mb-3">
                        {new Date(item.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h3 className="text-xl font-bold font-serif text-foreground mb-3">{item.title}</h3>
                      <p className="text-muted-foreground line-clamp-3">{item.body}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Button asChild variant="ghost" className="w-full">
                <Link href="/activities">View All News</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <AchievementsSection achievements={achievements} />
      <TestimonialsSection testimonials={testimonials} />
    </div>
  );
}