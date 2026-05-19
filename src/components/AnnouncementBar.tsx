import { Sparkles } from "lucide-react";

const items = [
  "Complimentary worldwide shipping on orders above ₹25,000",
  "Lifetime exchange & buyback guarantee",
  "BIS Hallmarked · IGI certified diamonds",
  "Festive Edit — Up to 25% off select pieces",
];

export function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden border-b border-[color:var(--glass-border)] bg-black/40 text-[11px] tracking-[0.25em] uppercase text-[color:var(--gold-soft)]">
      <div className="flex whitespace-nowrap animate-marquee py-2">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}
