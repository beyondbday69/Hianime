// Constants for the Unofficial Aniwatch API
export const API_BASE = "https://aniwatch-scraper-kappa.vercel.app";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const apiCache: Record<string, { data: any; timestamp: number }> = {};

async function fetchWithCache<T>(url: string): Promise<T> {
  const now = Date.now();
  if (apiCache[url] && now - apiCache[url].timestamp < CACHE_TTL) {
    return apiCache[url].data;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
  }
  const data = await response.json();
  apiCache[url] = { data, timestamp: now };
  return data;
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

export async function fetchHomeData(): Promise<HomeResponse> {
  return fetchWithCache<HomeResponse>(`${API_BASE}/home`);
}

export interface AnimeDetailProps {
  anime_id: string;
  title: string;
  description: string;
  image: string;
  details: {
    overview?: string;
    japanese?: string;
    synonyms?: string;
    aired?: string;
    premiered?: string;
    duration?: string;
    status?: string;
    "mal score"?: string;
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
  episode_id: string;
  sub: string | null;
  dub: string | null;
  raw: string | null;
}

export async function fetchMegaplay(epId: string): Promise<MegaplayResponse> {
  return fetchWithCache<MegaplayResponse>(`${API_BASE}/megaplay/${epId}`);
}

export interface SearchResponse {
  results: any[];
}

export async function fetchSearchData(query: string): Promise<SearchResponse> {
  return fetchWithCache<SearchResponse>(`${API_BASE}/search?q=${encodeURIComponent(query.trim())}`);
}

export async function fetchAnimeDetails(id: string): Promise<AnimeDetailProps> {
  return fetchWithCache<AnimeDetailProps>(`${API_BASE}/anime/${id}`);
}

export async function fetchAnimeEpisodes(id: string): Promise<EpisodesResponse> {
  return fetchWithCache<EpisodesResponse>(`${API_BASE}/episodes/${id}`);
}
