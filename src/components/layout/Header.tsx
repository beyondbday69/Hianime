import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { User, LogOut, Search, Play, Menu, X } from "lucide-react";
import { auth, loginWithGoogle, logout } from "@/src/lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

export function Header() {
  const [user, setUser] = useState(auth.currentUser);
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tv", label: "TV Series" },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-300 px-4 md:px-6 lg:px-10 h-[72px] border-b",
          (isScrolled || isMenuOpen)
            ? "bg-black border-[#333333]" 
            : "bg-transparent border-transparent"
        )}
      >
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
              <div className="text-[20px] md:text-[24px] font-bold tracking-tighter text-white">
                Hi<span className="text-[var(--color-primary)]">Anime</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 text-[14px] font-bold tracking-tight text-white/50">
              {navLinks.map((link) => (
                <Link 
                   key={link.href} 
                   href={link.href}
                   className={cn(
                     "transition-colors duration-300 cursor-pointer py-2 hover:text-[var(--color-primary)]",
                     location === link.href ? "text-[var(--color-primary)] opacity-100" : ""
                   )}
                >
                   {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search size={18} className="absolute left-3 text-white/40" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1A1A1A] border border-[#333333] rounded-[20px] pl-[36px] pr-4 py-[8px] text-[13px] text-white outline-none focus:border-[var(--color-primary)] w-[120px] sm:w-[160px] lg:w-[280px] transition-all placeholder:text-white/40"
              />
            </form>
            
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#333333]">
                    <img src={user.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.uid}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : (
                <button onClick={loginWithGoogle} className="bg-[var(--color-primary)] text-black rounded-[20px] px-4 py-[8px] text-[13px] font-semibold hover:opacity-90 transition-opacity">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-black border-b border-[#333333] p-6 md:hidden"
          >
            <div className="flex flex-col gap-4 text-[16px] font-bold text-white/50">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={cn(
                    "py-2 transition-colors",
                    location === link.href ? "text-[var(--color-primary)]" : "hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#333333] flex flex-col gap-4">
                 {user ? (
                    <button onClick={() => {logout(); setIsMenuOpen(false);}} className="text-left py-2 text-[#ff3333]">Logout</button>
                 ) : (
                    <button onClick={() => {loginWithGoogle(); setIsMenuOpen(false);}} className="text-left py-2 text-[var(--color-primary)]">Sign In</button>
                 )}
                 <p className="text-[12px] text-white/40 mt-4 px-2 italic">
                   Note: Mobile UI is currently undergoing optimization for a better experience. Apologies for any inconvenience.
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
