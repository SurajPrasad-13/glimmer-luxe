import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Award, Diamond, Gem, Sparkles, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ProductCard } from "@/components/ProductCard";
import { LazyImage } from "@/components/LazyImage";
import { products } from "@/lib/products";
import hero from "@/assets/hero-necklace.jpg";
import bridal from "@/assets/collection-bridal.jpg";
import men from "@/assets/collection-men.jpg";
import diamond from "@/assets/collection-diamond.jpg";
import craft from "@/assets/craftsmanship.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurélia · Heirloom Fine Jewellery" },
      { name: "description", content: "Discover Aurélia — handcrafted fine jewellery, diamonds, bridal sets and timeless heirloom pieces. BIS hallmarked, IGI certified." },
      { property: "og:title", content: "Aurélia · Heirloom Fine Jewellery" },
      { property: "og:description", content: "Handcrafted fine jewellery, diamonds and bridal sets." },
    ],
  }),
  component: Home,
});

const categories = [
  { name: "Bridal", image: bridal, tag: "Heritage Edit" },
  { name: "Diamonds", image: diamond, tag: "IGI Certified" },
  { name: "For Him", image: men, tag: "Modern Maison" },
];

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 lg:pt-40 pb-20 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
          <div className="absolute bottom-0 -right-32 h-[500px] w-[500px] rounded-full bg-[color:var(--accent)]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:col-span-6 text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
              <Sparkles className="h-3 w-3" /> The Festive Maison 2026
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.02] tracking-tight">
              Forever, <em className="italic text-gold-gradient not-italic">illuminated</em>.
            </h1>
            <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Heirloom diamonds and 22k gold, shaped by master craftsmen across three generations.
              Discover pieces designed to be remembered.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link to="/shop" className="group inline-flex items-center gap-3 rounded-full bg-gold-gradient px-7 py-3.5 text-sm uppercase tracking-[0.25em] font-medium text-[color:var(--charcoal)] shadow-glow hover:shadow-[0_0_80px_-10px_var(--gold)] transition-all">
                Explore Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/shop" className="inline-flex items-center gap-3 rounded-full glass px-7 py-3.5 text-sm uppercase tracking-[0.25em] hover:border-[color:var(--gold)] transition">
                Bridal Atelier
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              {[
                { v: "3M+", l: "Heirlooms" },
                { v: "120", l: "Boutiques" },
                { v: "75yr", l: "Heritage" },
              ].map((s) => (
                <div key={s.l} className="text-center lg:text-left">
                  <p className="font-display text-3xl text-gold-gradient">{s.v}</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-luxe glass">
              <LazyImage src={hero} alt="Diamond necklace" eager width={1600} height={1280} wrapperClassName="h-full w-full" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold)]">Featured</p>
                  <p className="font-display text-lg mt-1">Celestine Diamond Necklace</p>
                </div>
                <Link to="/shop" className="h-11 w-11 rounded-full bg-gold-gradient flex items-center justify-center text-[color:var(--charcoal)]">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
            <div className="hidden lg:block absolute -top-6 -right-6 h-28 w-28 rounded-full glass animate-float-slow flex items-center justify-center text-center">
              <div>
                <p className="font-display text-2xl text-gold-gradient">75</p>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Years</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[color:var(--glass-border)] bg-black/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { I: ShieldCheck, t: "BIS Hallmarked", s: "Certified purity" },
            { I: Diamond, t: "IGI Certified", s: "Ethical diamonds" },
            { I: Truck, t: "Free Shipping", s: "Worldwide insured" },
            { I: RefreshCw, t: "Lifetime Exchange", s: "Buyback guaranteed" },
          ].map(({ I, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full glass flex items-center justify-center text-[color:var(--gold)]">
                <I className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{t}</p>
                <p className="text-[11px] text-muted-foreground">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured collections */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading kicker="Curated Edits" title="Collections to covet" />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {categories.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-luxe"
              >
                <LazyImage src={c.image} alt={c.name} wrapperClassName="h-full w-full" className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold)]">{c.tag}</p>
                  <h3 className="mt-2 font-display text-4xl text-white">{c.name}</h3>
                  <Link to="/shop" className="mt-5 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/90 border-b border-[color:var(--gold)] pb-1 hover:text-[color:var(--gold)] transition">
                    Discover <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading kicker="Most Loved" title="Bestsellers of the season" />
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
          <div className="mt-14 text-center">
            <Link to="/shop" className="inline-flex items-center gap-3 rounded-full glass px-7 py-3.5 text-sm uppercase tracking-[0.25em] hover:border-[color:var(--gold)] transition">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-24 lg:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative aspect-[5/4] rounded-3xl overflow-hidden shadow-luxe"
          >
            <LazyImage src={craft} alt="Craftsmanship" wrapperClassName="h-full w-full" className="h-full w-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--gold)]">The Maison</p>
            <h2 className="mt-4 font-display text-5xl lg:text-6xl leading-tight">
              Three generations<br /> of <em className="italic text-gold-gradient not-italic">quiet mastery</em>.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Every Aurélia piece is shaped in our Jaipur atelier, where master jewellers spend
              over 200 hours on a single bridal set. Hand-set diamonds. Hand-polished gold. Hand-signed.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6">
              {[
                { I: Gem, t: "Hand-set", s: "200+ hours per piece" },
                { I: Award, t: "Certified", s: "BIS · IGI · GIA" },
              ].map(({ I, t, s }) => (
                <div key={t} className="glass rounded-2xl p-5">
                  <I className="h-5 w-5 text-[color:var(--gold)]" />
                  <p className="mt-3 font-display text-xl">{t}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading kicker="Just Unveiled" title="New arrivals" />
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {products.slice(4, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 text-center">
          <SectionHeading kicker="Voices" title="Worn with love" center />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { q: "My bridal set is a heirloom in the making. The craftsmanship is breathtaking.", a: "Ananya R.", c: "Mumbai" },
              { q: "Aurélia turned an idea into the most exquisite engagement ring I've ever seen.", a: "Vikram & Lia", c: "London" },
              { q: "Every piece arrives like it belongs in a museum. Pure poetry in gold.", a: "Meera S.", c: "Dubai" },
            ].map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass rounded-3xl p-8 text-left"
              >
                <Sparkles className="h-5 w-5 text-[color:var(--gold)]" />
                <blockquote className="mt-4 font-display text-xl leading-snug">"{t.q}"</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="text-[color:var(--gold)]">{t.a}</span>
                  <span className="text-muted-foreground"> · {t.c}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl glass p-10 lg:p-16 text-center shadow-luxe">
            <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-[color:var(--accent)]/15 blur-3xl" />
            <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--gold)]">The Atelier Letter</p>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl">
              Private previews, <em className="italic text-gold-gradient not-italic">delivered quietly</em>.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Be the first to discover new collections, atelier events and one-of-a-kind pieces.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email" required placeholder="your@email.com"
                className="flex-1 rounded-full glass px-5 py-3 text-sm outline-none focus:border-[color:var(--gold)] transition"
              />
              <button className="rounded-full bg-gold-gradient px-6 py-3 text-xs uppercase tracking-[0.25em] font-medium text-[color:var(--charcoal)] hover:opacity-90 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function SectionHeading({ kicker, title, center }: { kicker: string; title: string; center?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
      className={center ? "text-center" : "flex items-end justify-between flex-wrap gap-4"}
    >
      <div className={center ? "" : ""}>
        <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--gold)]">{kicker}</p>
        <h2 className="mt-3 font-display text-4xl lg:text-5xl leading-tight">{title}</h2>
      </div>
    </motion.div>
  );
}
