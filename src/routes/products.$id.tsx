import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, Share2, Shield, Truck, RefreshCw, Star, Plus, Minus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { LazyImage } from "@/components/LazyImage";
import { ProductCard } from "@/components/ProductCard";
import { products, formatINR } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = products.find(p => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name ?? "Product"} · Aurélia` },
      { name: "description", content: `${loaderData?.product.name} — handcrafted in ${loaderData?.product.metal}.` },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-5xl">Piece not found</h1>
        <Link to="/shop" className="mt-6 inline-block text-[color:var(--gold)] underline">Return to boutique</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-center">
      <p>{error.message}</p>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("M");
  const [metal, setMetal] = useState(product.metal);

  const related = products.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />

      <div className="pt-28 lg:pt-36 pb-20 mx-auto max-w-7xl px-6 lg:px-10">
        <nav className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
          <Link to="/" className="hover:text-[color:var(--gold)]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-[color:var(--gold)]">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden glass shadow-luxe group">
              <LazyImage src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" wrapperClassName="h-full w-full" />
              {product.badge && (
                <span className="absolute top-5 left-5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest bg-gold-gradient text-[color:var(--charcoal)]">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[0,1,2,3].map(i => (
                <button key={i} className="aspect-square rounded-xl overflow-hidden glass hover:border-[color:var(--gold)] transition">
                  <LazyImage src={product.image} alt="" className="h-full w-full object-cover opacity-80 hover:opacity-100" wrapperClassName="h-full w-full" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--gold)]">{product.category}</p>
            <h1 className="mt-3 font-display text-4xl lg:text-5xl leading-tight">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-[color:var(--gold)] text-[color:var(--gold)]" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} · {product.reviews} reviews</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl text-gold-gradient">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg line-through text-muted-foreground">{formatINR(product.originalPrice)}</span>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Inclusive of all taxes · EMI from {formatINR(Math.round(product.price / 12))}/mo</p>

            <div className="hairline my-8" />

            <p className="text-sm text-muted-foreground leading-relaxed">
              A defining piece from the {product.category.toLowerCase()} atelier. Hand-crafted in {product.metal.toLowerCase()},
              hand-set with brilliant-cut diamonds, and finished with our signature mirror polish.
            </p>

            {/* Metal */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Metal</p>
              <div className="flex flex-wrap gap-2">
                {["Gold", "Rose Gold", "Platinum"].map(m => (
                  <button key={m} onClick={() => setMetal(m as typeof metal)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition ${
                      metal === m ? "bg-gold-gradient text-[color:var(--charcoal)]" : "glass hover:border-[color:var(--gold)]"
                    }`}>{m}</button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Size</p>
              <div className="flex gap-2">
                {["XS","S","M","L","XL"].map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`h-11 w-11 rounded-full text-sm transition ${
                      size === s ? "bg-gold-gradient text-[color:var(--charcoal)]" : "glass hover:border-[color:var(--gold)]"
                    }`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Qty + actions */}
            <div className="mt-8 flex items-stretch gap-3">
              <div className="glass rounded-full flex items-center px-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 flex items-center justify-center hover:text-[color:var(--gold)]"><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-10 w-10 flex items-center justify-center hover:text-[color:var(--gold)]"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={() => toast.success(`${product.name} added to bag`)}
                className="flex-1 rounded-full bg-gold-gradient text-[color:var(--charcoal)] text-xs uppercase tracking-[0.25em] font-medium hover:opacity-90 shadow-glow transition">
                Add to Bag
              </button>
              <button onClick={() => toast.success("Saved to wishlist")} className="glass rounded-full h-12 w-12 flex items-center justify-center hover:text-[color:var(--gold)]"><Heart className="h-4 w-4" /></button>
              <button className="glass rounded-full h-12 w-12 flex items-center justify-center hover:text-[color:var(--gold)]"><Share2 className="h-4 w-4" /></button>
            </div>

            <Link to="/cart" className="mt-3 block text-center rounded-full glass py-3.5 text-xs uppercase tracking-[0.25em] hover:border-[color:var(--gold)] transition">
              Buy Now
            </Link>

            {/* Trust */}
            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                { I: Shield, t: "Lifetime Warranty" },
                { I: Truck, t: "Free Delivery" },
                { I: RefreshCw, t: "30-Day Returns" },
              ].map(({ I, t }) => (
                <div key={t} className="glass rounded-xl p-3 text-center">
                  <I className="h-4 w-4 text-[color:var(--gold)] mx-auto" />
                  <p className="text-[10px] uppercase tracking-widest mt-2 text-muted-foreground">{t}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related */}
        <section className="mt-28">
          <h2 className="font-display text-3xl lg:text-4xl">You may also love</h2>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
