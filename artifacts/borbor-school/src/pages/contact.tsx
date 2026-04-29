import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, Mail, Facebook, MessageCircle, Send } from "lucide-react";
import { useSchoolData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Seo } from "@/components/seo";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  // Honeypot — must stay empty. Bots auto-fill all fields.
  website: z.string().max(0, "Spam detected").optional(),
});

import { toast } from "sonner";

export default function Contact() {
  const { schoolInfo, addSubmission } = useSchoolData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formLoadedAt = useRef<number>(Date.now());

  useEffect(() => {
    formLoadedAt.current = Date.now();
  }, []);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    // Honeypot: hidden "website" field must be empty
    if (values.website && values.website.length > 0) {
      toast.success("Message sent. We'll be in touch soon.");
      form.reset();
      return;
    }
    // Time-based bot check: real humans take at least ~3s to fill the form
    const elapsed = Date.now() - formLoadedAt.current;
    if (elapsed < 3000) {
      toast.error("Please take a moment to review your message before sending.");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    const { website: _hp, ...payload } = values;
    addSubmission(payload);
    form.reset();
    formLoadedAt.current = Date.now();
    setIsSubmitting(false);
  };

  const whatsappLink = `https://wa.me/${schoolInfo?.whatsapp?.replace(/\D/g, '')}?text=Hello,%20I%20am%20interested%20in%20DASBMSE.`;

  return (
    <div className="flex flex-col w-full pb-20">
      <Seo
        title={`Contact Us — ${schoolInfo.name} (DASBMSE) | ${schoolInfo.address}`}
        description={`Contact Dr. Abraham S. Borbor Memorial School Of Excellence. Phone, email, WhatsApp, Facebook, and address in Mount Barclay, Lower Johnsonville, Monrovia, Liberia.`}
        path="/contact"
      />
      <section className="bg-primary pt-20 pb-24 text-center px-4 relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            We welcome your questions, enrollment inquiries, and feedback. Reach out to our administrative team today.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 md:px-6 -mt-12 relative z-10">
        <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Contact Information Side */}
          <div className="w-full lg:w-2/5 bg-primary/5 p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/50">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-8">Contact Information</h2>
              
              <ul className="flex flex-col gap-6 mb-10">
                <li className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-secondary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Address</h4>
                    <p className="text-muted-foreground mt-1">{schoolInfo.address}</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-secondary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Phone</h4>
                    {schoolInfo.phones.map((phone, i) => (
                      <p key={i} className="text-muted-foreground mt-1">{phone}</p>
                    ))}
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-secondary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Email</h4>
                    <p className="text-muted-foreground mt-1">{schoolInfo.email}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Connect with us</h4>
              <div className="flex gap-4">
                {schoolInfo.facebookUrl && (
                  <a href={schoolInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-xl shadow-sm text-primary hover:text-secondary hover:-translate-y-1 transition-all">
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {schoolInfo.whatsapp && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-xl shadow-sm text-green-500 hover:text-green-600 hover:-translate-y-1 transition-all">
                    <MessageCircle className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form Side */}
          <div className="w-full lg:w-3/5 p-8 md:p-12 bg-card">
            <h2 className="text-3xl font-serif font-bold text-primary mb-2">Send us a message</h2>
            <p className="text-muted-foreground mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Honeypot field — hidden from real users, visible to bots */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-10000px",
                    top: "auto",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                >
                  <label htmlFor="contact-website-hp">Website (leave empty)</label>
                  <input
                    id="contact-website-hp"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...form.register("website")}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+231 xx xxx xxxx" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" className="bg-background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Your Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can we help you?" 
                          className="min-h-[150px] bg-background resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full md:w-auto px-8 py-6 rounded-full text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <Send className="ml-2 w-5 h-5" />}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 w-full h-[400px] rounded-3xl overflow-hidden shadow-lg border border-border/50 bg-card">
          <iframe 
            src="https://maps.google.com/maps?q=Mount+Barclay+Lower+Johnsonville+Monrovia+Liberia&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="School Location Map"
            className="filter grayscale-[20%] contrast-[90%]"
          ></iframe>
        </div>
      </section>
    </div>
  );
}