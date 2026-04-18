import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { PageTransition } from "@/src/components/layout/PageTransition";
import { fetchMegaplay, fetchAnimeDetails, fetchAnimeEpisodes, AnimeDetailProps, AnimeEpisode, MegaplayResponse } from "@/src/services/api";
import { auth, db } from "@/src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Play, SkipForward, SkipBack, Settings } from "lucide-react";

// In-memory cache to persist data across component remounts for the same anime
const animeDataCache: Record<string, { anime: AnimeDetailProps; episodes: AnimeEpisode[]; timestamp: number }> = {};

export function Watch() {
  const [match, params] = useRoute("/watch/:animeId/:epId");
  const animeId = params ? (params as any).animeId : null;
  const epId = params ? (params as any).epId : null;
  const [_, setLocation] = useLocation();

  const [anime, setAnime] = useState<AnimeDetailProps | null>(null);
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [megaplay, setMegaplay] = useState<MegaplayResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [mode, setMode] = useState<'sub' | 'dub' | 'raw'>('sub');
  const [episodeSearchQuery, setEpisodeSearchQuery] = useState("");
  const [autoNext, setAutoNext] = useState(true);

  // Initialize from cache if available
  useEffect(() => {
    if (animeId && animeDataCache[animeId]) {
      setAnime(animeDataCache[animeId].anime);
      setEpisodes(animeDataCache[animeId].episodes);
      setIsLoading(false);
    }
  }, [animeId]);

  // Player Event Listeners
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      let data = event.data;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          return;
        }
      }

      // Handle events
      if (data.event === "complete" || data.type === "complete") {
        if (autoNext) {
          const nextIndex = episodes.findIndex(e => e.ep_id === epId) + 1;
          if (nextIndex < episodes.length) {
            setLocation(`/watch/${animeId}/${episodes[nextIndex].ep_id}`);
          }
        }
      }

      if (data.type === "watching-log" || data.event === "time") {
        const currentTime = data.currentTime || data.time;
        const duration = data.duration;
        
        if (auth.currentUser && currentTime && epId && animeId) {
          try {
            await setDoc(doc(db, "users", auth.currentUser.uid, "history", epId), {
              userId: auth.currentUser.uid,
              animeId: animeId,
              episodeId: epId,
              progressSeconds: Math.floor(currentTime),
              ...(duration && { durationSeconds: Math.floor(duration) }),
              lastWatchedAt: Date.now()
            }, { merge: true });
          } catch (e) {
            // Silently fail history updates
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [episodes, epId, animeId, autoNext]);

  const filteredEpisodes = episodes.filter(
    (ep) =>
      ep.title.toLowerCase().includes(episodeSearchQuery.toLowerCase()) ||
      ep.number.toString().includes(episodeSearchQuery)
  );

  useEffect(() => {
    if (!animeId || !epId) return;

    async function loadWatchData() {
      // Only set main loading if we don't have cached data
      if (!animeDataCache[animeId]) {
        setIsLoading(true);
      }
      setPlayerLoading(true);
      setError(null);
      setMegaplay(null); // Clear previous player source
      
      try {
        // Fetch Megaplay ALWAYS for the specific episode
        const mpPromise = fetchMegaplay(epId!);
        
        // Only fetch details if needed
        let detailsPromise = Promise.resolve(animeDataCache[animeId]?.anime || null);
        let episodesPromise = Promise.resolve(animeDataCache[animeId]?.episodes ? { episodes: animeDataCache[animeId].episodes } : null);

        if (!animeDataCache[animeId]) {
          detailsPromise = fetchAnimeDetails(animeId!);
          episodesPromise = fetchAnimeEpisodes(animeId!);
        }

        const [details, eps, mp] = await Promise.all([
          detailsPromise,
          episodesPromise as Promise<{ episodes: AnimeEpisode[] }>,
          mpPromise
        ]);

        if (details && eps) {
          setAnime(details);
          setEpisodes(eps.episodes);
          animeDataCache[animeId] = { anime: details, episodes: eps.episodes, timestamp: Date.now() };
        }
        
        setMegaplay(mp);
        setIsLoading(false); // Ensure main loading is false after we have initial data
        
        // Auto-select mode
        if (mp) {
           if (!mp[mode] && mp.sub) setMode('sub');
           else if (!mp[mode] && mp.dub) setMode('dub');
           else if (!mp[mode] && mp.raw) setMode('raw');
        }
        
        // Track History if user logged in
        if (auth.currentUser && epId && animeId) {
          try {
            await setDoc(doc(db, "users", auth.currentUser.uid, "history", epId), {
              userId: auth.currentUser.uid,
              animeId: animeId,
              episodeId: epId,
              progressSeconds: 0,
              lastWatchedAt: Date.now()
            }, { merge: true });
          } catch (e) {
            console.error("Initial history write failed", e);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load video player.");
      } finally {
        setIsLoading(false);
        setPlayerLoading(false);
      }
    }
    loadWatchData();
  }, [animeId, epId]);

  const currentEp = episodes.find(e => e.ep_id === epId);
  const currentIndex = episodes.findIndex(e => e.ep_id === epId);

  return (
    <PageTransition>
      <main className="min-h-screen pb-20 overflow-x-hidden pt-[80px] lg:pt-[100px]">
        <Header />
        
        {isLoading ? (
        <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 mt-6">
          <div className="w-full aspect-video rounded-[16px] overflow-hidden layer-2 border border-white/10 flex items-center justify-center">
             <div className="w-full h-full shimmer" />
          </div>
        </div>
      ) : error || !anime ? (
        <div className="w-full h-[85vh] min-h-[600px] flex items-center justify-center flex-col gap-4">
          <div className="w-16 h-16 rounded-full layer-2 flex items-center justify-center text-3xl text-[#ff3333] mb-2 border border-white/10">
            !
          </div>
          <h2 className="text-display text-center">Playback Error</h2>
          <p className="text-xl font-medium text-white/50">{error || "Episode not found."}</p>
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-6 lg:mt-8 flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Player Area */}
          <div className="flex-1 w-full flex flex-col gap-6">
            <div className="w-full aspect-video bg-black rounded-[16px] shadow-2xl relative overflow-hidden chrome-border">
               {playerLoading ? (
                 <div className="w-full h-full shimmer" />
               ) : megaplay?.[mode] ? (
                 <iframe 
                   src={megaplay[mode]!} 
                   allowFullScreen 
                   className="w-full h-full border-0"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-white/40 font-medium">
                   Source not available
                 </div>
               )}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl lg:text-3xl font-semibold text-white truncate max-w-full hover:text-[var(--color-primary)] cursor-pointer transition-colors" onClick={() => setLocation(`/anime/${anime.anime_id}`)}>
                  {anime.title}
                </h1>
                <h2 className="text-[14px] font-medium text-white/60">
                  <span className="text-white/90">Episode {currentEp?.number}</span>: {currentEp?.title || "Untitled"}
                </h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 layer-2 px-4 py-2 rounded-[12px] border border-[#333333]">
                   <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">Auto Next</span>
                   <button 
                    onClick={() => setAutoNext(!autoNext)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${autoNext ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`}
                   >
                     <div className={`absolute top-1 w-3 h-3 rounded-full bg-black transition-all duration-300 ${autoNext ? 'left-6' : 'left-1'}`} />
                   </button>
                </div>

                <div className="flex items-center gap-2 layer-2 p-1.5 rounded-[12px] border border-[#333333]">
                {megaplay?.sub && (
                  <button 
                    onClick={() => setMode('sub')}
                    className={`px-4 py-2 font-bold rounded-[8px] text-[12px] transition-all ${mode === 'sub' ? 'bg-[#b0e3af] text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-[#222222]'}`}
                  >
                    SUB
                  </button>
                )}
                {megaplay?.dub && (
                  <button 
                    onClick={() => setMode('dub')}
                    className={`px-4 py-2 font-bold rounded-[8px] text-[12px] transition-all ${mode === 'dub' ? 'bg-[#e3b5af] text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-[#222222]'}`}
                  >
                    DUB
                  </button>
                )}
                 {megaplay?.raw && (
                  <button 
                    onClick={() => setMode('raw')}
                    className={`px-4 py-2 font-bold rounded-[8px] text-[12px] transition-all ${mode === 'raw' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-[#222222]'}`}
                  >
                    RAW
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

          {/* Sidebar / Episodes */}
          <div className="w-full lg:w-[400px] shrink-0 layer-2 rounded-[16px] h-[600px] flex flex-col shadow-xl overflow-hidden chrome-border">
            <div className="p-5 border-b border-[#333333] bg-[#1A1A1A] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-white flex items-center gap-2">
                 Episodes <span className="text-[12px] font-medium text-white/40 bg-[#222222] px-2 py-0.5 rounded-[6px]">{filteredEpisodes.length}</span>
              </h3>
              <input 
                type="text" 
                placeholder="Search..." 
                value={episodeSearchQuery}
                onChange={(e) => setEpisodeSearchQuery(e.target.value)}
                className="bg-black border border-[#333333] rounded-[8px] px-3 py-1 text-[12px] text-white outline-none focus:border-[#555555] w-[100px]"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto w-full p-3 space-y-1.5 relative scroll-smooth" data-lenis-prevent>
              {filteredEpisodes.map(ep => {
                const isActive = ep.ep_id === epId;
                return (
                  <div 
                    key={ep.ep_id} 
                    onClick={() => !isActive && setLocation(`/watch/${animeId}/${ep.ep_id}`)}
                    className={`flex items-center gap-3 p-2 rounded-[10px] cursor-pointer transition-all ${isActive ? 'bg-[var(--color-primary)] text-black' : 'bg-transparent text-white/80 hover:bg-[#222222]'}`}
                  >
                    <div className={`w-10 h-10 shrink-0 rounded-[8px] flex text-[13px] items-center justify-center font-bold ${isActive ? 'bg-black/20 text-black' : 'bg-[#1A1A1A] text-white/60'}`}>
                      {ep.number}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className={`text-[13px] font-medium truncate ${isActive ? 'text-black font-semibold' : 'text-white/80'}`}>{ep.title}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}
      <Footer />
    </main>
  </PageTransition>
);
}
