import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const cols = [
  { title: "Shop", links: ["Rings", "Earrings", "Necklaces", "Bangles", "Bridal", "Men"] },
  { title: "Aurélia", links: ["Our Story", "Craftsmanship", "Sustainability", "Press", "Careers"] },
  { title: "Care", links: ["Contact", "Shipping", "Returns", "Sizing Guide", "FAQs"] },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-[color:var(--glass-border)] bg-black/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h3 className="font-display text-3xl tracking-[0.2em] text-gold-gradient">AURÉLIA</h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Heirloom jewellery, crafted by hand. Every piece tells a story — yours.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full glass flex items-center justify-center hover:text-[color:var(--gold)] transition">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold)] mb-5">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}><Link to="/shop" className="text-sm text-foreground/70 hover:text-[color:var(--gold)] transition">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold)] mb-5">Trust</h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li>BIS Hallmarked</li>
              <li>IGI Certified</li>
              <li>Lifetime Buyback</li>
              <li>Free Shipping</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[color:var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Aurélia Maison. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[color:var(--gold)]">Privacy</a>
            <a href="#" className="hover:text-[color:var(--gold)]">Terms</a>
            <a href="#" className="hover:text-[color:var(--gold)]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
