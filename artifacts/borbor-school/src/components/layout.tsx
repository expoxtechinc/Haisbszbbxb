import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Phone, Mail, Facebook, MessageCircle, ChevronUp, Rss } from "lucide-react";
import { useSchoolData } from "@/lib/data";
import { Button } from "@/components/ui/button";

function NavLink({ href, children, currentPath, onClick }: { href: string; children: ReactNode; currentPath: string; onClick?: () => void }) {
  const isActive = currentPath === href || (href !== "/" && currentPath.startsWith(href));
  return (
    <Link href={href} onClick={onClick}>
      <span className={`cursor-pointer font-medium transition-colors hover:text-secondary ${isActive ? "text-secondary" : "text-foreground dark:text-muted-foreground"}`}>
        {children}
      </span>
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { schoolInfo, isLoaded } = useSchoolData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial Loading Screen
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/academics", label: "Academics" },
    { href: "/activities", label: "Activities" },
    { href: "/staff", label: "Staff" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-x-hidden">
      <AnimatePresence>
        {showLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          >
            <motion.img 
              src="/images/school-logo.jpg" 
              alt="DASBMSE Logo" 
              className="w-32 h-32 rounded-full shadow-2xl"
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 font-serif text-primary font-bold text-xl tracking-wider text-center px-4"
            >
              DR. ABRAHAM S. BORBOR<br/>MEMORIAL SCHOOL
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      <header 
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm py-2" : "bg-background py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center gap-3 cursor-pointer group">
              <img src="/images/school-logo.jpg" alt="Logo" className="w-12 h-12 rounded-full shadow-md group-hover:shadow-lg transition-all" />
              <div className="hidden sm:block">
                <h1 className="font-serif font-bold text-primary text-lg md:text-xl leading-tight">
                  DASBMSE
                </h1>
                <p className="text-xs text-muted-foreground font-medium">{schoolInfo?.established ? `Est. ${schoolInfo.established}` : ''}</p>
              </div>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} currentPath={location}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md">
                Enroll Now
              </Button>
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-background border-l shadow-2xl z-50 flex flex-col md:hidden"
            >
              <div className="p-4 flex items-center justify-between border-b">
                <span className="font-serif font-bold text-primary">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-foreground" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
                {navLinks.map((link) => (
                  <NavLink key={link.href} href={link.href} currentPath={location} onClick={() => setMobileMenuOpen(false)}>
                    <div className="text-lg py-2 border-b border-border/50">{link.label}</div>
                  </NavLink>
                ))}
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full mt-4 bg-primary text-primary-foreground font-semibold">
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-primary text-primary-foreground pt-12 pb-6 border-t-[6px] border-secondary z-10 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white p-1 rounded-full">
                  <img src="/images/school-logo.jpg" alt="Logo" className="w-10 h-10 rounded-full" />
                </div>
                <h3 className="font-serif font-bold text-lg md:text-xl leading-tight">DASBMSE</h3>
              </div>
              <p className="text-primary-foreground/80 mb-6 italic text-sm max-w-xs">
                "{schoolInfo?.slogan}"
              </p>
              <div className="flex gap-4">
                {schoolInfo?.facebookUrl && (
                  <a href={schoolInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-secondary hover:text-primary transition-colors aria-label='Facebook'">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {schoolInfo?.whatsapp && (
                  <a href={`https://wa.me/${schoolInfo.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-secondary hover:text-primary transition-colors aria-label='WhatsApp'">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg mb-4 text-secondary">Quick Links</h4>
              <ul className="flex flex-col gap-2">
                <li><Link href="/about"><span className="text-primary-foreground/80 hover:text-white transition-colors cursor-pointer">About Us</span></Link></li>
                <li><Link href="/academics"><span className="text-primary-foreground/80 hover:text-white transition-colors cursor-pointer">Academic Programs</span></Link></li>
                <li><Link href="/activities"><span className="text-primary-foreground/80 hover:text-white transition-colors cursor-pointer">Activities & Gallery</span></Link></li>
                <li><Link href="/staff"><span className="text-primary-foreground/80 hover:text-white transition-colors cursor-pointer">Our Staff</span></Link></li>
                <li><Link href="/contact"><span className="text-primary-foreground/80 hover:text-white transition-colors cursor-pointer">Contact Us</span></Link></li>
                <li>
                  <a
                    href="/feed.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-white transition-colors cursor-pointer"
                    aria-label="Subscribe to DASBMSE news RSS feed"
                  >
                    <Rss className="w-4 h-4" />
                    <span>News RSS Feed</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg mb-4 text-secondary">Contact Info</h4>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/80 text-sm">{schoolInfo?.address}</span>
                </li>
                {schoolInfo?.phones?.map((phone, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-secondary shrink-0" />
                    <span className="text-primary-foreground/80 text-sm">{phone}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-secondary shrink-0" />
                  <span className="text-primary-foreground/80 text-sm">{schoolInfo?.email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60 text-center md:text-left">
              © {new Date().getFullYear()} Dr. Abraham S. Borbor Memorial School Of Excellence. All rights reserved.
            </p>
            <Link href="/admin">
              <span className="text-xs text-primary-foreground/40 hover:text-primary-foreground/80 transition-colors cursor-pointer">Admin Portal</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="p-3 bg-card shadow-lg rounded-full text-foreground border hover:bg-accent transition-colors"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {schoolInfo?.whatsapp && (
          <motion.a
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            href={`https://wa.me/${schoolInfo.whatsapp.replace(/\D/g,'')}?text=Hello%20DASBMSE,%20I%20would%20like%20to%20inquire%20about%20enrollment.`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-[#25D366] text-white shadow-xl rounded-full hover:scale-110 transition-transform flex items-center justify-center relative group"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute right-full mr-4 bg-background text-foreground text-xs font-semibold py-1 px-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Chat with us
            </span>
          </motion.a>
        )}
      </div>
    </div>
  );
}