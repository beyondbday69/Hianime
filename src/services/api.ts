// Constants for the Unofficial Aniwatch API
export const API_BASE = "https://aniwatch-scraper-kappa.vercel.app";

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
  const url = `${API_BASE}/home`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch home data: ${response.statusText}`);
  }
  
  return await response.json();
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
  const url = `${API_BASE}/megaplay/${epId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch megaplay links: ${response.statusText}`);
  }
  return await response.json();
}

export interface SearchResponse {
  results: any[];
}

export async function fetchSearchData(query: string): Promise<SearchResponse> {
  const url = `${API_BASE}/search?q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch search data: ${response.statusText}`);
  }
  return await response.json();
}

export async function fetchAnimeDetails(id: string): Promise<AnimeDetailProps> {
  const url = `${API_BASE}/anime/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch anime details: ${response.statusText}`);
  }
  return await response.json();
}

export async function fetchAnimeEpisodes(id: string): Promise<EpisodesResponse> {
  const url = `${API_BASE}/episodes/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch anime episodes: ${response.statusText}`);
  }
  return await response.json();
}
