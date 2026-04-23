import { useProvider, Provider, PROVIDER_LABELS } from "@/src/contexts/ProviderContext";
import { cn } from "@/src/lib/utils";
import { Radio, Tv, Globe, Sparkles } from "lucide-react";

const PROVIDERS: { key: Provider; label: string; icon: typeof Tv }[] = [
  { key: "tv", label: "TV", icon: Tv },
  { key: "co", label: "CO", icon: Globe },
  { key: "mal", label: "MAL", icon: Sparkles },
];

export function ProviderSelector() {
  const { provider, setProvider } = useProvider();

  return (
    <div className="flex items-center gap-0.5 bg-white/[0.03] p-[3px] rounded-full border border-white/[0.06] backdrop-blur-sm">
      {PROVIDERS.map((p) => {
        const isActive = provider === p.key;
        const Icon = p.icon;
        return (
          <button
            key={p.key}
            onClick={() => setProvider(p.key)}
            title={PROVIDER_LABELS[p.key]}
            className={cn(
              "relative px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 cursor-pointer",
              isActive
                ? "bg-[var(--color-primary)] text-[#201F31] shadow-[0_0_16px_rgba(255,186,222,0.25)]"
                : "text-white/30 hover:text-white/60"
            )}
          >
            <Icon size={12} strokeWidth={2.5} />
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

export function ProviderSelectorMobile() {
  const { provider, setProvider } = useProvider();

  return (
    <div className="flex flex-col gap-3 w-full">
      <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.15em]">Source Provider</span>
      <div className="flex gap-1.5 bg-white/[0.03] p-1 rounded-[14px] border border-white/[0.06]">
        {PROVIDERS.map((p) => {
          const isActive = provider === p.key;
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              onClick={() => setProvider(p.key)}
              className={cn(
                "flex-1 py-2.5 rounded-[10px] text-[12px] font-bold transition-all duration-300 flex items-center justify-center gap-1.5",
                isActive
                  ? "bg-[var(--color-primary)] text-[#201F31] shadow-[0_0_20px_rgba(255,186,222,0.2)]"
                  : "text-white/30 hover:text-white/50"
              )}
            >
              <Icon size={13} strokeWidth={2.5} />
              {PROVIDER_LABELS[p.key]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProviderSelectorFooter() {
  const { provider, setProvider, providerLabel } = useProvider();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-white font-bold uppercase text-[12px] tracking-widest">Provider</h3>
      <div className="flex flex-col gap-2">
        {PROVIDERS.map((p) => {
          const isActive = provider === p.key;
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              onClick={() => setProvider(p.key)}
              className={cn(
                "flex items-center gap-3 text-[14px] font-medium transition-all duration-300 group text-left",
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-white/40 hover:text-[var(--color-primary)]"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                isActive
                  ? "border-[var(--color-primary)]"
                  : "border-white/15 group-hover:border-white/30"
              )}>
                {isActive && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
                )}
              </div>
              <Icon size={14} strokeWidth={2} className={cn(isActive ? "text-[var(--color-primary)]" : "text-white/25 group-hover:text-white/40")} />
              {PROVIDER_LABELS[p.key]}
            </button>
          );
        })}
      </div>
      <p className="text-white/20 text-[11px] mt-1 italic leading-relaxed">
        Switch your streaming source anytime. Each provider offers different content and servers.
      </p>
    </div>
  );
}
