import { motion } from "framer-motion";
import { BookOpen, Target, Microscope, Globe } from "lucide-react";
import { useSchoolData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/seo";

export default function Academics() {
  const { schoolInfo } = useSchoolData();

  const programs = [
    {
      id: "primary",
      name: "Primary School",
      grades: "Grades 1-6",
      description: "Our Primary School program focuses on building a solid foundation in literacy, numeracy, and character development. We create a nurturing environment where children discover the joy of learning.",
      subjects: ["Mathematics", "Language Arts", "General Science", "Social Studies", "Physical Education", "Moral Education"],
      color: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-900"
    },
    {
      id: "junior",
      name: "Junior High",
      grades: "Grades 7-9",
      description: "The Junior High curriculum bridges foundational knowledge with advanced analytical skills. Students are encouraged to think critically, ask questions, and take ownership of their educational journey.",
      subjects: ["Advanced Mathematics", "Literature & Grammar", "Integrated Science", "Liberian History & Geography", "Information Technology", "French"],
      color: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-900"
    },
    {
      id: "senior",
      name: "Senior High",
      grades: "Grades 10-12",
      description: "Our Senior High program is rigorous and preparatory. We equip students with the academic proficiency and leadership skills necessary to excel in national examinations and higher education.",
      subjects: ["Algebra, Geometry & Calculus", "Biology, Chemistry & Physics", "Literature in English", "Economics & World History", "Computer Science", "Career Preparation"],
      color: "bg-slate-50 dark:bg-slate-900/50",
      border: "border-slate-200 dark:border-slate-800"
    }
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      <Seo
        title={`Academics — ${schoolInfo.name} (DASBMSE) | Mount Barclay, Liberia`}
        description={`Explore academic programs at Dr. Abraham S. Borbor Memorial School Of Excellence: Primary School, Junior High, and Senior High in Mount Barclay, Lower Johnsonville, Liberia.`}
        path="/academics"
      />
      <section className="bg-primary pt-20 pb-20 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            Academic Programs
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            From the first day of primary school to senior high graduation, we provide a continuous pathway of rigorous, inspiring education.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16">
        <Tabs defaultValue="primary" className="w-full max-w-5xl mx-auto">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-muted/50 p-1.5 rounded-full h-auto w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="primary" className="rounded-full py-3 text-sm sm:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Primary</TabsTrigger>
              <TabsTrigger value="junior" className="rounded-full py-3 text-sm sm:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Junior High</TabsTrigger>
              <TabsTrigger value="senior" className="rounded-full py-3 text-sm sm:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Senior High</TabsTrigger>
            </TabsList>
          </div>

          {programs.map((program) => (
            <TabsContent key={program.id} value={program.id} className="mt-0 focus-visible:outline-none">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`rounded-3xl p-6 md:p-10 border ${program.border} ${program.color} shadow-sm`}
              >
                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                  <div className="md:w-1/2 flex flex-col justify-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-background border border-border text-sm font-semibold mb-4 w-max shadow-sm">
                      {program.grades}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">{program.name}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {program.description}
                    </p>
                  </div>
                  
                  <div className="md:w-1/2">
                    <Card className="border-border/50 shadow-md bg-background/80 backdrop-blur">
                      <CardHeader className="pb-3 border-b border-border/50">
                        <CardTitle className="font-serif text-xl flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Core Curriculum
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {program.subjects.map((subject, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-foreground/80 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                              {subject}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Methodology */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">Our Teaching Methodology</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We employ modern pedagogical approaches adapted for the Liberian context to ensure every student thrives.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold font-serif text-lg mb-2">Student-Centered</h3>
                <p className="text-sm text-muted-foreground">Recognizing that each child learns differently, our teachers adapt to individual needs to unlock potential.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Microscope className="w-6 h-6" />
                </div>
                <h3 className="font-bold font-serif text-lg mb-2">Practical Application</h3>
                <p className="text-sm text-muted-foreground">Moving beyond rote memorization to ensure students can apply what they learn to real-world problems.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-bold font-serif text-lg mb-2">Global Perspective</h3>
                <p className="text-sm text-muted-foreground">Rooted in Liberian culture but looking outward, preparing students to compete on a global stage.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}