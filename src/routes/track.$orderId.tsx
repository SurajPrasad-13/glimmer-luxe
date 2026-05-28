import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PackageCheck, Package, Truck, MapPin, CheckCircle2, Clock,
  ShieldCheck, Phone, Copy, ChevronLeft, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { formatINR } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/track/$orderId")({
  head: () => ({ meta: [{ title: "Track Order · Aurélia" }] }),
  component: TrackPage,
});

type StoredOrder = {
  orderId: string;
  placedAt: string;
  total: number;
  deliveryLabel: string;
  paymentLabel: string;
  address: { name: string; line: string; city: string; state: string; pin: string; phone: string };
  items: { id: string; name: string; metal: string; qty: number; price: number; image: string }[];
};

const STAGES = [
  { key: "placed", label: "Order Placed", desc: "We've received your order.", icon: CheckCircle2 },
  { key: "crafted", label: "Hand-Crafted & Hallmarked", desc: "Our artisans are preparing your piece.", icon: Sparkles },
  { key: "packed", label: "Securely Packed", desc: "Sealed in our signature box with insurance.", icon: Package },
  { key: "shipped", label: "Dispatched", desc: "Picked up by our concierge courier.", icon: Truck },
  { key: "out", label: "Out for Delivery", desc: "Arriving today between 10am–6pm.", icon: PackageCheck },
  { key: "delivered", label: "Delivered", desc: "Enjoy your Aurélia heirloom.", icon: ShieldCheck },
] as const;

function TrackPage() {
  const { orderId } = useParams({ from: "/track/$orderId" });
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`aurelia-order-${orderId}`);
      if (raw) setOrder(JSON.parse(raw));
    } catch {/* ignore */}
  }, [orderId]);

  // Deterministic "progress" based on order ID so reloads stay consistent
  const stageIndex = useMemo(() => {
    const seed = orderId.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
    return seed % (STAGES.length - 1) + 1; // 1..5
  }, [orderId]);

  const eta = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  }, []);

  const copyId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success("Order ID copied");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 pt-28 lg:pt-36 pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
          <Link to="/account" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-[color:var(--gold)] transition">
            <ChevronLeft className="h-3.5 w-3.5" /> My Orders
          </Link>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--gold)]">Live Tracking</p>
              <h1 className="mt-2 font-display text-4xl sm:text-5xl">Your order is on its way</h1>
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Order</span>
                <span className="font-mono text-foreground">{orderId}</span>
                <button onClick={copyId} className="text-muted-foreground hover:text-[color:var(--gold)]">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="glass rounded-2xl px-5 py-4 text-right">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Estimated Delivery</p>
              <p className="font-display text-lg text-gold-gradient">{eta}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-10 glass rounded-3xl p-6 sm:p-10 shadow-luxe">
            <div className="relative">
              <div className="absolute left-5 top-2 bottom-2 w-px bg-[color:var(--glass-border)]" />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(stageIndex / (STAGES.length - 1)) * 100}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute left-5 top-2 w-px bg-gradient-to-b from-[color:var(--gold)] to-[color:var(--gold)]/30"
              />
              <ul className="space-y-7">
                {STAGES.map((s, idx) => {
                  const done = idx <= stageIndex;
                  const current = idx === stageIndex;
                  const Icon = s.icon;
                  return (
                    <motion.li
                      key={s.key}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative flex gap-5 pl-1"
                    >
                      <div
                        className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 border ${
                          done
                            ? "bg-gold-gradient border-transparent text-[color:var(--charcoal)] shadow-luxe"
                            : "bg-background border-[color:var(--glass-border)] text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" strokeWidth={done ? 2.4 : 1.6} />
                        {current && (
                          <motion.span
                            animate={{ scale: [1, 1.7, 1.9], opacity: [0.6, 0.2, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-[color:var(--gold)]/40"
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <p className={`font-display text-lg ${done ? "" : "text-muted-foreground"}`}>{s.label}</p>
                          {current && (
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--gold)] flex items-center gap-1">
                              <Clock className="h-3 w-3" /> In progress
                            </span>
                          )}
                          {done && !current && (
                            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-300/80">Completed</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-3xl p-6 shadow-luxe">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[color:var(--gold)]" />
                <h3 className="font-display text-xl">Shipping Address</h3>
              </div>
              {order ? (
                <div className="mt-4 text-sm leading-relaxed">
                  <p className="font-medium">{order.address.name}</p>
                  <p className="text-muted-foreground">
                    {order.address.line}<br />
                    {order.address.city}, {order.address.state} {order.address.pin}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Phone className="h-3 w-3" /> {order.address.phone}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Address on file with your order.</p>
              )}
            </div>

            <div className="glass rounded-3xl p-6 shadow-luxe">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[color:var(--gold)]" />
                <h3 className="font-display text-xl">Delivery</h3>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <Row k="Method" v={order?.deliveryLabel ?? "Standard Delivery"} />
                <Row k="Payment" v={order?.paymentLabel ?? "Paid"} />
                <Row k="Placed" v={order?.placedAt ?? "—"} />
                {order && <Row k="Total" v={formatINR(order.total)} />}
              </div>
            </div>
          </div>

          {order && order.items.length > 0 && (
            <div className="mt-6 glass rounded-3xl p-6 shadow-luxe">
              <h3 className="font-display text-xl">Items in this order</h3>
              <div className="mt-4 space-y-3">
                {order.items.map((i) => (
                  <div key={i.id} className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl overflow-hidden glass shrink-0">
                      <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display truncate">{i.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{i.metal} · Qty {i.qty}</p>
                    </div>
                    <p className="text-sm">{formatINR(i.price * i.qty)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="px-6 py-3 rounded-xl text-xs uppercase tracking-[0.25em] bg-gold-gradient text-[color:var(--charcoal)] font-medium shadow-luxe text-center">
              Continue Shopping
            </Link>
            <Link to="/account" className="px-6 py-3 rounded-xl text-xs uppercase tracking-[0.25em] border border-[color:var(--glass-border)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition text-center">
              View All Orders
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{k}</span>
      <span className="text-sm text-right">{v}</span>
    </div>
  );
}
