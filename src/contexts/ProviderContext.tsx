import { createContext, useContext, useState, ReactNode } from "react";

export type Provider = "tv" | "co" | "mal";

export interface ProviderContextType {
  provider: Provider;
  setProvider: (p: Provider) => void;
  providerLabel: string;
}

export const PROVIDER_LABELS: Record<Provider, string> = {
  tv: "AniwatchTV",
  co: "Aniwatch.co",
  mal: "MAL",
};

const ProviderContext = createContext<ProviderContextType>({
  provider: "tv",
  setProvider: () => {},
  providerLabel: "AniwatchTV",
});

export function ProviderContextProvider({ children }: { children: ReactNode }) {
  const [provider, setProviderState] = useState<Provider>(() => {
    try {
      const stored = localStorage.getItem("hianime_provider");
      if (stored === "tv" || stored === "co" || stored === "mal") return stored as Provider;
    } catch {}
    return "tv";
  });

  const setProvider = (p: Provider) => {
    setProviderState(p);
    try {
      localStorage.setItem("hianime_provider", p);
    } catch {}
  };

  return (
    <ProviderContext.Provider
      value={{ provider, setProvider, providerLabel: PROVIDER_LABELS[provider] }}
    >
      {children}
    </ProviderContext.Provider>
  );
}

export function useProvider() {
  return useContext(ProviderContext);
}
