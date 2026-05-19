import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Tag, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { products, formatINR } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag · Aurélia" }] }),
  component: Cart,
});

function Cart() {
  const [items, setItems] = useState(
    products.slice(0, 2).map(p => ({ ...p, qty: 1 }))
  );

  const update = (id: string, d: number) =>
    setItems(items.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const remove = (id: string) => { setItems(items.filter(i => i.id !== id)); toast.success("Removed from bag"); };

  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = subtotal > 25000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />

      <div className="pt-28 lg:pt-36 pb-20 mx-auto max-w-7xl px-6 lg:px-10">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--gold)]">Your selection</p>
          <h1 className="mt-3 font-display text-5xl lg:text-6xl">The Bag</h1>
        </motion.header>

        {items.length === 0 ? (
          <div className="mt-20 text-center glass rounded-3xl p-16">
            <p className="font-display text-2xl">Your bag is empty.</p>
            <Link to="/shop" className="mt-6 inline-block rounded-full bg-gold-gradient px-7 py-3 text-xs uppercase tracking-[0.25em] text-[color:var(--charcoal)]">Continue Shopping</Link>
          </div>
        ) : (
          <div className="mt-12 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-4 lg:p-6 flex gap-4 lg:gap-6"
                >
                  <img src={item.image} alt={item.name} className="h-28 w-28 lg:h-36 lg:w-36 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{item.metal} · {item.category}</p>
                    <h3 className="mt-1 font-display text-xl truncate">{item.name}</h3>
                    <p className="mt-1 text-sm text-[color:var(--gold)]">{formatINR(item.price)}</p>

                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="glass rounded-full flex items-center px-1">
                        <button onClick={() => update(item.id, -1)} className="h-8 w-8 flex items-center justify-center"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button onClick={() => update(item.id, 1)} className="h-8 w-8 flex items-center justify-center"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive text-xs uppercase tracking-widest flex items-center gap-1">
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="glass rounded-3xl p-8 shadow-luxe">
                <h2 className="font-display text-2xl">Order Summary</h2>

                <div className="mt-6 flex gap-2">
                  <div className="flex-1 glass rounded-full px-4 py-2.5 flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-[color:var(--gold)]" />
                    <input placeholder="Promo code" className="bg-transparent outline-none text-sm w-full" />
                  </div>
                  <button className="rounded-full bg-gold-gradient px-5 text-xs uppercase tracking-widest text-[color:var(--charcoal)]">Apply</button>
                </div>

                <dl className="mt-8 space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Estimated tax</dt><dd>Included</dd></div>
                </dl>

                <div className="hairline my-6" />

                <div className="flex justify-between items-baseline">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-display text-3xl text-gold-gradient">{formatINR(total)}</span>
                </div>

                <button
                  onClick={() => toast.success("Proceeding to checkout…")}
                  className="mt-8 w-full rounded-full bg-gold-gradient py-4 text-xs uppercase tracking-[0.3em] font-medium text-[color:var(--charcoal)] shadow-glow flex items-center justify-center gap-2 hover:opacity-90 transition">
                  Secure Checkout <ArrowRight className="h-4 w-4" />
                </button>

                <Link to="/shop" className="mt-3 block text-center text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-[color:var(--gold)]">
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
