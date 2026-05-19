import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop · Aurélia Fine Jewellery" },
      { name: "description", content: "Browse Aurélia's complete collection of rings, earrings, necklaces, bangles and bridal jewellery." },
    ],
  }),
  component: Shop,
});

const metals = ["All", "Gold", "Rose Gold", "Platinum", "Silver"];
const cats = ["All", "Rings", "Earrings", "Pendants", "Bangles"];

function Shop() {
  const [metal, setMetal] = useState("All");
  const [cat, setCat] = useState("All");

  const filtered = products.filter(p =>
    (metal === "All" || p.metal === metal) && (cat === "All" || p.category === cat)
  );

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />

      <header className="pt-32 pb-12 lg:pt-40 lg:pb-16 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--gold)]">The Boutique</p>
          <h1 className="mt-3 font-display text-5xl lg:text-7xl">All Jewellery</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {filtered.length} exquisite pieces, curated for the moments that matter.
          </p>
        </motion.div>
      </header>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-24">
        {/* Filter bar */}
        <div className="glass rounded-2xl p-4 lg:p-5 flex flex-wrap items-center gap-3 justify-between mb-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground mr-2 flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Category
            </span>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-widest transition ${
                  cat === c ? "bg-gold-gradient text-[color:var(--charcoal)]" : "glass hover:border-[color:var(--gold)]"
                }`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground mr-2">Metal</span>
            {metals.map(m => (
              <button key={m} onClick={() => setMetal(m)}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-widest transition ${
                  metal === m ? "bg-gold-gradient text-[color:var(--charcoal)]" : "glass hover:border-[color:var(--gold)]"
                }`}>
                {m}
              </button>
            ))}
          </div>
          <button className="ml-auto flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-[color:var(--gold)]">
            Sort: Featured <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No pieces match your selection.</p>
        )}
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
