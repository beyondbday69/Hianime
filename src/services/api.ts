import { Provider } from "@/src/contexts/ProviderContext";

// Production API URL for the aniwatch-scraper-api
export const API_BASE = "https://aniwatch-scraper-kappa.vercel.app";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const apiCache: Record<string, { data: any; timestamp: number }> = {};

async function fetchWithCache<T>(url: string, timeoutMs: number = 30000): Promise<T> {
  const now = Date.now();
  if (apiCache[url] && now - apiCache[url].timestamp < CACHE_TTL) {
    return apiCache[url].data;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    apiCache[url] = { data, timestamp: now };
    return data;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error(`Request timed out: ${url}`);
    }
    throw err;
  }
}

export function clearProviderCache(provider: Provider) {
  Object.keys(apiCache).forEach((key) => {
    if (key.includes(`provider=${provider}`) || key.includes(`/mal/`)) {
      delete apiCache[key];
    }
  });
}

export interface AnimeOverview {
  anime_id: string;
  title: string;
  japanese_title?: string;
  image: string;
  type?: string;
  duration?: string;
  release_date?: string;
  sub?: string | null;
  dub?: string | null;
  episodes?: string | null;
  description?: string;
}

export interface HomeResponse {
  spotlight: AnimeOverview[];
  trending: AnimeOverview[];
  top_airing: AnimeOverview[];
  most_popular: AnimeOverview[];
  most_favorite: AnimeOverview[];
  latest_completed: AnimeOverview[];
  latest_episodes: AnimeOverview[];
  genres: string[];
}

export async function fetchHomeData(provider: Provider = "tv"): Promise<HomeResponse> {
  if (provider === "mal") {
    return fetchWithCache<HomeResponse>(`${API_BASE}/mal/home`);
  }
  return fetchWithCache<HomeResponse>(`${API_BASE}/home?provider=${provider}`);
}

export interface AnimeDetailProps {
  anime_id: string;
  title: string;
  description: string;
  image: string;
  provider?: string;
  details: {
    overview?: string;
    japanese?: string;
    synonyms?: string;
    aired?: string;
    premiered?: string;
    duration?: string;
    status?: string;
    "mal score"?: string;
    score?: string;
    genres?: string;
    studios?: string;
    producers?: string;
  };
  seasons: any[];
}

export interface AnimeEpisode {
  ep_id: string;
  number: string;
  title: string;
}

export interface EpisodesResponse {
  episodes: AnimeEpisode[];
}

export interface MegaplayResponse {
  episode_id?: string;
  mal_id?: string;
  episode_number?: string;
  sub: string | null;
  dub: string | null;
  raw?: string | null;
}

export interface ServerItem {
  server_id: string;
  name: string;
  type: string;
}

export interface ServersResponse {
  provider: string;
  servers: ServerItem[];
}

export interface SourceResponse {
  provider?: string;
  type?: string;
  link?: string;
}

export interface SearchResponse {
  results: any[];
}

export async function fetchSearchData(query: string, provider: Provider = "tv"): Promise<SearchResponse> {
  if (provider === "mal") {
    return fetchWithCache<SearchResponse>(`${API_BASE}/mal/search?q=${encodeURIComponent(query.trim())}`);
  }
  return fetchWithCache<SearchResponse>(
    `${API_BASE}/search?q=${encodeURIComponent(query.trim())}&provider=${provider}`
  );
}

export async function fetchAnimeDetails(id: string, provider: Provider = "tv"): Promise<AnimeDetailProps> {
  if (provider === "mal") {
    return fetchWithCache<AnimeDetailProps>(`${API_BASE}/mal/anime/${id}`);
  }
  // CO endpoints can be slow (WordPress scraping), give extra time
  const timeout = provider === "co" ? 45000 : 30000;
  return fetchWithCache<AnimeDetailProps>(`${API_BASE}/anime/${id}?provider=${provider}`, timeout);
}

export async function fetchAnimeEpisodes(id: string, provider: Provider = "tv"): Promise<EpisodesResponse> {
  if (provider === "mal") {
    const data = await fetchWithCache<{ episodes: any[]; pagination: any }>(
      `${API_BASE}/mal/episodes/${id}?page=1`
    );
    const episodes: AnimeEpisode[] = (data.episodes || []).map((ep: any, idx: number) => ({
      ep_id: String(ep.mal_id || ep.episode_id || idx + 1),
      number: String(ep.episode_id || ep.mal_id || idx + 1),
      title: ep.title || ep.title_romanji || `Episode ${idx + 1}`,
    }));
    return { episodes };
  }
  // CO episodes endpoint can be very slow (WordPress AJAX chain), give extra time
  const timeout = provider === "co" ? 45000 : 30000;
  return fetchWithCache<EpisodesResponse>(`${API_BASE}/episodes/${id}?provider=${provider}`, timeout);
}

export async function fetchMegaplay(
  epId: string,
  provider: Provider = "tv",
  malId?: string,
  epNum?: string
): Promise<MegaplayResponse> {
  if (provider === "mal" && malId && epNum) {
    return fetchWithCache<MegaplayResponse>(`${API_BASE}/megaplay/mal/${malId}/${epNum}`);
  }
  return fetchWithCache<MegaplayResponse>(`${API_BASE}/megaplay/${epId}`);
}

export async function fetchServers(epId: string, provider: Provider = "tv"): Promise<ServersResponse> {
  // CO servers endpoint does WordPress scraping, can be slow
  const timeout = provider === "co" ? 45000 : 30000;
  return fetchWithCache<ServersResponse>(`${API_BASE}/servers/${epId}?provider=${provider}`, timeout);
}

export async function fetchSource(serverId: string, provider: Provider = "tv"): Promise<SourceResponse> {
  return fetchWithCache<SourceResponse>(`${API_BASE}/sources/${encodeURIComponent(serverId)}?provider=${provider}`);
}

/**
 * Unified streaming source fetcher for all providers.
 * - tv: uses /megaplay/{ep_id}
 * - mal: uses /megaplay/mal/{mal_id}/{ep_num}
 * - co: uses /servers/{ep_id} + /sources/{server_id} to build sub/dub iframe links
 */
export async function fetchStreamingSources(
  epId: string,
  provider: Provider,
  malId?: string,
  epNum?: string
): Promise<MegaplayResponse> {
  if (provider === "tv") {
    return fetchMegaplay(epId, provider);
  }

  if (provider === "mal" && malId && epNum) {
    return fetchMegaplay(epId, provider, malId, epNum);
  }

  if (provider === "co") {
    // CO: fetch servers, then resolve iframe links for sub and dub
    try {
      const serversData = await fetchServers(epId, "co");
      const servers = serversData.servers || [];

      if (servers.length === 0) {
        console.warn("CO: No servers found for ep_id:", epId);
        return { episode_id: epId, sub: null, dub: null, raw: null };
      }

      const subServer = servers.find(s => s.type === "sub");
      const dubServer = servers.find(s => s.type === "dub");

      const [subSource, dubSource] = await Promise.all([
        subServer ? fetchSource(subServer.server_id, "co").catch((e) => { console.warn("CO sub source err:", e); return null; }) : Promise.resolve(null),
        dubServer ? fetchSource(dubServer.server_id, "co").catch((e) => { console.warn("CO dub source err:", e); return null; }) : Promise.resolve(null),
      ]);

      return {
        episode_id: epId,
        sub: subSource?.link || null,
        dub: dubSource?.link || null,
        raw: null,
      };
    } catch (err) {
      console.error("CO streaming failed, servers/sources chain error:", err);
      return { episode_id: epId, sub: null, dub: null, raw: null };
    }
  }

  // Fallback
  return fetchMegaplay(epId, provider);
}
