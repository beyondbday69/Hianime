import { Link, useLocation } from "wouter";
import { Github } from "lucide-react";
import { ProviderSelectorFooter } from "@/src/components/ui/ProviderSelector";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [location] = useLocation();
  const showProvider = !location.includes("/dubbed");

  return (
    <footer className="w-full border-t border-[#333333] bg-[#201F31] py-12 mt-20">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Pitch */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <div className="text-[24px] font-bold tracking-tighter text-white">
                Hi<span className="text-[var(--color-primary)]">Anime</span>
              </div>
            </Link>
            <p className="text-white/40 text-[14px] leading-relaxed max-w-md">
              A premium anime streaming experience built with modern web technologies.
              This project is an open-source educational platform exploring high-performance
              frontend architectures and API integrations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-[12px] tracking-widest">Navigation</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-white/40 hover:text-[var(--color-primary)] transition-colors text-[14px] font-medium">Home</Link></li>
              <li><Link href="/tv" className="text-white/40 hover:text-[var(--color-primary)] transition-colors text-[14px] font-medium">TV Series</Link></li>
              <li><Link href="/dubbed" className="text-white/40 hover:text-[var(--color-primary)] transition-colors text-[14px] font-medium">Dubbed</Link></li>
              <li><Link href="/api-info" className="text-white/40 hover:text-[var(--color-primary)] transition-colors text-[14px] font-medium">API & Open Source</Link></li>
            </ul>
          </div>

          {/* Provider Selector */}
          {showProvider && (
            <div>
              <ProviderSelectorFooter />
            </div>
          )}

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-[12px] tracking-widest">Information</h3>
            <ul className="space-y-4">
              <li><span className="text-white/40 text-[14px] block">Copyright &copy; {currentYear} HiAnime</span></li>
              <li><span className="text-white/40 text-[14px] block italic opacity-60">Reserved by HiAnime</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-[12px] font-medium italic">
            Disclaimer: HiAnime does not store any files on its server. All contents are provided by non-affiliated third parties.
          </p>
          <div className="flex gap-4">
             <a
               href="https://github.com/beyondbday69/Hianime.git"
               target="_blank"
               rel="noopener noreferrer"
               className="text-white/20 hover:text-white transition-colors"
               title="View Source on GitHub"
             >
               <Github size={20} />
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
