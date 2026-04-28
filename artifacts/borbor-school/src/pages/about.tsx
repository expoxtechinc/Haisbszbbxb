import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useSchoolData } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function About() {
  const { schoolInfo } = useSchoolData();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    document.title = `${schoolInfo.name} | About`;
  }, [schoolInfo.name]);

  const generateBrochure = async () => {
    setIsGeneratingPdf(true);
    try {
      // Dynamic import to keep bundle small initially
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(18, 48, 107); // Primary blue
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Dr. Abraham S. Borbor Memorial School", pageWidth / 2, 20, { align: "center" });
      
      doc.setTextColor(245, 166, 35); // Accent gold
      doc.setFont("helvetica", "italic");
      doc.setFontSize(12);
      doc.text(`"${schoolInfo.slogan}"`, pageWidth / 2, 30, { align: "center" });
      
      // Content
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "normal");
      
      let y = 60;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("About Us", 20, y);
      y += 10;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const splitHistory = doc.splitTextToSize(schoolInfo.history, pageWidth - 40);
      doc.text(splitHistory, 20, y);
      y += (splitHistory.length * 6) + 10;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Our Mission", 20, y);
      y += 10;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const splitMission = doc.splitTextToSize(schoolInfo.mission, pageWidth - 40);
      doc.text(splitMission, 20, y);
      y += (splitMission.length * 6) + 10;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Our Vision", 20, y);
      y += 10;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const splitVision = doc.splitTextToSize(schoolInfo.vision, pageWidth - 40);
      doc.text(splitVision, 20, y);
      y += (splitVision.length * 6) + 15;
      
      // Footer info
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, pageWidth - 20, y);
      y += 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("Contact Information", 20, y);
      y += 10;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Address: ${schoolInfo.address}`, 20, y);
      y += 8;
      doc.text(`Phone: ${schoolInfo.phones.join(", ")}`, 20, y);
      y += 8;
      doc.text(`Email: ${schoolInfo.email}`, 20, y);
      
      doc.save("DASBMSE_Brochure.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Header */}
      <section className="bg-primary pt-20 pb-24 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            About DASBMSE
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Discover our history, our values, and the vision that drives our commitment to excellence in Mount Barclay.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 md:px-6 -mt-12 relative z-10 print:mt-0 print:pt-8">
        <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8 md:p-12 lg:p-16 max-w-5xl mx-auto flex flex-col gap-16">
          
          {/* Controls - Hide on print */}
          <div className="flex justify-end print:hidden">
            <Button 
              onClick={generateBrochure} 
              disabled={isGeneratingPdf}
              variant="outline" 
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf ? "Generating..." : "Download Brochure"}
            </Button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"
          >
            <div className="md:col-span-4">
              <h2 className="text-3xl font-serif font-bold text-primary sticky top-24">Our History</h2>
            </div>
            <div className="md:col-span-8 prose prose-lg dark:prose-invert">
              <p className="text-lg leading-relaxed text-foreground">{schoolInfo.history}</p>
              <p className="text-lg leading-relaxed text-foreground mt-4">
                Since our founding in {schoolInfo.established}, we have been steadfast in our commitment to the Mount Barclay and Lower Johnsonville communities. We believe that every child deserves a school that not only imparts knowledge but nurtures character.
              </p>
            </div>
          </motion.div>

          <hr className="border-border/50" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"
          >
            <div className="md:col-span-4">
              <h2 className="text-3xl font-serif font-bold text-primary sticky top-24">Mission & Vision</h2>
            </div>
            <div className="md:col-span-8 flex flex-col gap-10">
              <div className="bg-accent/10 p-8 rounded-2xl border-l-4 border-accent">
                <h3 className="text-xl font-bold text-foreground mb-3 uppercase tracking-wider text-sm">Our Mission</h3>
                <p className="text-xl font-serif text-foreground/90 italic leading-relaxed">
                  "{schoolInfo.mission}"
                </p>
              </div>
              
              <div className="bg-primary/5 p-8 rounded-2xl border-l-4 border-primary">
                <h3 className="text-xl font-bold text-foreground mb-3 uppercase tracking-wider text-sm">Our Vision</h3>
                <p className="text-xl font-serif text-foreground/90 italic leading-relaxed">
                  "{schoolInfo.vision}"
                </p>
              </div>
            </div>
          </motion.div>

          <hr className="border-border/50" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"
          >
            <div className="md:col-span-4">
              <h2 className="text-3xl font-serif font-bold text-primary sticky top-24">Core Values</h2>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Excellence", desc: "We demand the best from ourselves in academics, character, and service." },
                { title: "Discipline", desc: "We believe structure and self-control are the foundations of freedom and success." },
                { title: "Integrity", desc: "We do the right thing, even when no one is watching." },
                { title: "Community", desc: "We lift each other up and serve the community of Mount Barclay with pride." }
              ].map((value, i) => (
                <div key={i} className="p-6 border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-background">
                  <h4 className="text-lg font-bold text-primary mb-2">{value.title}</h4>
                  <p className="text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}