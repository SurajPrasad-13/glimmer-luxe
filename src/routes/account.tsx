import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Heart, MapPin, Bell, Clock, CreditCard, LogOut,
  User, ChevronRight, Plus, Trash2, Edit3, Check, Star, Truck, Eye, Settings,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { products, formatINR } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account · Aurélia" }] }),
  component: AccountPage,
});

type TabId = "orders" | "wishlist" | "addresses" | "notifications" | "recent" | "payments";

const tabs: { id: TabId; label: string; icon: any; hint: string }[] = [
  { id: "orders", label: "Order History", icon: Package, hint: "Track & re-buy" },
  { id: "wishlist", label: "Wishlist", icon: Heart, hint: "Saved pieces" },
  { id: "addresses", label: "Addresses", icon: MapPin, hint: "Shipping book" },
  { id: "notifications", label: "Notifications", icon: Bell, hint: "Alerts & news" },
  { id: "recent", label: "Recently Viewed", icon: Clock, hint: "Browse history" },
  { id: "payments", label: "Payment Methods", icon: CreditCard, hint: "Cards & UPI" },
];

const mockOrders = [
  { id: "AUR-9241", date: "12 May 2026", status: "Delivered", total: 146800, items: [products[0], products[3]], tracking: "Delivered to Mumbai" },
  { id: "AUR-9118", date: "28 Apr 2026", status: "In Transit", total: 62300, items: [products[1]], tracking: "Out for delivery" },
  { id: "AUR-8973", date: "02 Mar 2026", status: "Delivered", total: 128900, items: [products[2]], tracking: "Delivered to Delhi" },
  { id: "AUR-8810", date: "14 Feb 2026", status: "Cancelled", total: 47800, items: [products[7]], tracking: "Refunded" },
];

const mockAddresses = [
  { id: "1", label: "Home", name: "Aanya Sharma", line: "12 Lotus Residency, Bandra West", city: "Mumbai", state: "Maharashtra", pin: "400050", phone: "+91 98200 11122", default: true },
  { id: "2", label: "Office", name: "Aanya Sharma", line: "Tower B, 8th Floor, Nariman Point", city: "Mumbai", state: "Maharashtra", pin: "400021", phone: "+91 98200 11122", default: false },
];

const mockNotifications = [
  { id: "1", title: "Your order AUR-9118 is out for delivery", time: "2h ago", type: "order", unread: true },
  { id: "2", title: "Bridal Edit: New heirloom pieces just dropped", time: "1d ago", type: "promo", unread: true },
  { id: "3", title: "Price drop on Soirée Pear Drops — now ₹58,200", time: "3d ago", type: "wishlist", unread: false },
  { id: "4", title: "Your Aurelia Solitaire Ring has been delivered", time: "1w ago", type: "order", unread: false },
  { id: "5", title: "Festive Preview: Akshaya Tritiya collection live", time: "2w ago", type: "promo", unread: false },
];

const mockPayments = [
  { id: "1", brand: "Visa", last4: "4421", name: "Aanya Sharma", expiry: "08/29", default: true },
  { id: "2", brand: "Mastercard", last4: "7890", name: "Aanya Sharma", expiry: "11/27", default: false },
  { id: "3", brand: "UPI", last4: "aanya@okhdfc", name: "HDFC UPI", expiry: "", default: false },
];

function AccountPage() {
  const [tab, setTab] = useState<TabId>("orders");

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pt-28 lg:pt-36 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden glass shadow-luxe p-6 sm:p-10"
          >
            <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top_right,var(--gold)/0.25,transparent_60%)]" />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-gold-gradient flex items-center justify-center text-[color:var(--charcoal)] text-2xl font-display shrink-0 shadow-luxe">
                AS
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold)]">Aurélia Privé · Gold Member</p>
                <h1 className="mt-1 font-display text-3xl sm:text-4xl">Welcome back, Aanya</h1>
                <p className="mt-1 text-sm text-muted-foreground">aanya.sharma@example.com · +91 98200 11122</p>
              </div>
              <div className="flex gap-6 sm:gap-10">
                <Stat label="Orders" value="14" />
                <Stat label="Wishlist" value="8" />
                <Stat label="Reward Pts" value="2,480" />
              </div>
            </div>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <aside>
              <div className="glass rounded-2xl p-2 sticky top-28">
                {tabs.map((t) => {
                  const active = tab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${
                        active
                          ? "bg-gold-gradient text-[color:var(--charcoal)] shadow-luxe"
                          : "hover:bg-white/5 text-foreground/85"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{t.label}</p>
                        <p className={`text-[10px] uppercase tracking-[0.2em] mt-0.5 ${active ? "text-[color:var(--charcoal)]/70" : "text-muted-foreground"}`}>
                          {t.hint}
                        </p>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${active ? "translate-x-0.5" : "opacity-40 group-hover:opacity-80"}`} />
                    </button>
                  );
                })}
                <div className="my-2 h-px bg-[color:var(--glass-border)]" />
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-white/5 text-foreground/85"
                  onClick={() => toast.success("Profile settings coming soon")}
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Profile Settings</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-red-500/10 text-red-300"
                  onClick={() => toast.success("You have been signed out")}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </aside>

            {/* Content */}
            <section className="min-h-[60vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {tab === "orders" && <Orders />}
                  {tab === "wishlist" && <Wishlist />}
                  {tab === "addresses" && <Addresses />}
                  {tab === "notifications" && <Notifications />}
                  {tab === "recent" && <RecentlyViewed />}
                  {tab === "payments" && <Payments />}
                </motion.div>
              </AnimatePresence>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl text-gold-gradient">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
        {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- ORDERS ---------- */
function Orders() {
  const statusColor = (s: string) =>
    s === "Delivered" ? "text-emerald-300 border-emerald-400/30 bg-emerald-400/10"
    : s === "In Transit" ? "text-amber-200 border-amber-400/30 bg-amber-400/10"
    : "text-red-300 border-red-400/30 bg-red-400/10";

  return (
    <div>
      <SectionHeader title="Order History" sub="Track shipments, download invoices and re-order favourites." />
      <div className="space-y-5">
        {mockOrders.map((o, i) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[color:var(--glass-border)]">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order</p>
                  <p className="font-display text-lg">{o.id}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Placed</p>
                  <p className="text-sm">{o.date}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Total</p>
                  <p className="text-sm">{formatINR(o.total)}</p>
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 rounded-full border ${statusColor(o.status)}`}>
                {o.status}
              </span>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex gap-3 flex-1">
                {o.items.map((p) => (
                  <Link to="/products/$id" params={{ id: p.id }} key={p.id} className="flex items-center gap-3 group">
                    <div className="h-16 w-16 rounded-xl overflow-hidden glass shrink-0">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm group-hover:text-[color:var(--gold)] transition">{p.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{p.metal}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5" /> {o.tracking}
              </div>

              <div className="flex gap-2">
                <button onClick={() => toast.success("Invoice downloaded")} className="px-4 py-2 rounded-xl text-xs uppercase tracking-[0.2em] border border-[color:var(--glass-border)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition">
                  Invoice
                </button>
                <button onClick={() => toast.success("Items added to bag")} className="px-4 py-2 rounded-xl text-xs uppercase tracking-[0.2em] bg-gold-gradient text-[color:var(--charcoal)] font-medium">
                  Re-order
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- WISHLIST ---------- */
function Wishlist() {
  const [items, setItems] = useState(products.slice(0, 6));
  const remove = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast.success("Removed from wishlist");
  };
  return (
    <div>
      <SectionHeader
        title="Wishlist"
        sub={`${items.length} curated pieces saved for later.`}
        action={
          <button onClick={() => toast.success("Wishlist shared")} className="px-4 py-2 rounded-xl text-xs uppercase tracking-[0.2em] border border-[color:var(--glass-border)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition">
            Share List
          </button>
        }
      />
      {items.length === 0 ? (
        <Empty icon={Heart} title="Your wishlist is empty" sub="Tap the heart on any piece to save it here." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              <Link to="/products/$id" params={{ id: p.id }} className="block relative aspect-square overflow-hidden">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <button onClick={(e) => { e.preventDefault(); remove(p.id); }} className="absolute top-2 right-2 h-8 w-8 rounded-full glass flex items-center justify-center hover:text-red-300">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </Link>
              <div className="p-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{p.metal}</p>
                <p className="font-display text-sm mt-0.5 line-clamp-1">{p.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">{formatINR(p.price)}</span>
                  <button onClick={() => toast.success("Added to bag")} className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold)] hover:underline">
                    Add to Bag
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- ADDRESSES ---------- */
function Addresses() {
  const [list, setList] = useState(mockAddresses);
  const setDefault = (id: string) => {
    setList(list.map(a => ({ ...a, default: a.id === id })));
    toast.success("Default address updated");
  };
  return (
    <div>
      <SectionHeader
        title="Saved Addresses"
        sub="Manage your shipping address book."
        action={
          <button onClick={() => toast.success("Address form coming soon")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-[0.2em] bg-gold-gradient text-[color:var(--charcoal)] font-medium">
            <Plus className="h-3.5 w-3.5" /> New Address
          </button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {list.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`glass rounded-2xl p-6 relative ${a.default ? "ring-1 ring-[color:var(--gold)]/50" : ""}`}
          >
            {a.default && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-[color:var(--charcoal)] bg-gold-gradient px-2.5 py-1 rounded-full">
                <Check className="h-3 w-3" /> Default
              </span>
            )}
            <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--gold)]">{a.label}</p>
            <p className="font-display text-lg mt-2">{a.name}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {a.line}<br />{a.city}, {a.state} {a.pin}<br />{a.phone}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => toast.success("Edit dialog coming soon")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-[0.2em] border border-[color:var(--glass-border)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition">
                <Edit3 className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => { setList(list.filter(x => x.id !== a.id)); toast.success("Address removed"); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-[0.2em] border border-[color:var(--glass-border)] hover:border-red-400/50 hover:text-red-300 transition">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
              {!a.default && (
                <button onClick={() => setDefault(a.id)} className="px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-[0.2em] bg-gold-gradient text-[color:var(--charcoal)] font-medium">
                  Set Default
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- NOTIFICATIONS ---------- */
function Notifications() {
  const [list, setList] = useState(mockNotifications);
  const typeIcon = (t: string) =>
    t === "order" ? Package : t === "wishlist" ? Heart : Star;
  const markAll = () => { setList(list.map(n => ({ ...n, unread: false }))); toast.success("All notifications marked as read"); };

  return (
    <div>
      <SectionHeader
        title="Notifications"
        sub="Order updates, price drops and Aurélia announcements."
        action={
          <button onClick={markAll} className="px-4 py-2 rounded-xl text-xs uppercase tracking-[0.2em] border border-[color:var(--glass-border)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition">
            Mark all read
          </button>
        }
      />
      <div className="glass rounded-2xl divide-y divide-[color:var(--glass-border)] overflow-hidden">
        {list.map((n, i) => {
          const Icon = typeIcon(n.type);
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className={`flex items-start gap-4 p-5 hover:bg-white/[0.03] transition ${n.unread ? "" : "opacity-70"}`}
            >
              <div className="h-10 w-10 rounded-full bg-gold-gradient/20 border border-[color:var(--gold)]/30 flex items-center justify-center text-[color:var(--gold)] shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">{n.title}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{n.time}</p>
              </div>
              {n.unread && <span className="h-2 w-2 rounded-full bg-[color:var(--gold)] mt-2" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- RECENTLY VIEWED ---------- */
function RecentlyViewed() {
  const recent = products.slice(2, 8);
  return (
    <div>
      <SectionHeader title="Recently Viewed" sub="Pick up where you left off." />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {recent.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          >
            <Link to="/products/$id" params={{ id: p.id }} className="block group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Viewed
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--gold)]">
                    {formatINR(p.price)}
                  </span>
                </div>
              </div>
              <p className="mt-3 font-display text-base group-hover:text-[color:var(--gold)] transition">{p.name}</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{p.metal} · {p.category}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- PAYMENTS ---------- */
function Payments() {
  const [list, setList] = useState(mockPayments);
  const setDefault = (id: string) => {
    setList(list.map(p => ({ ...p, default: p.id === id })));
    toast.success("Default payment updated");
  };
  return (
    <div>
      <SectionHeader
        title="Saved Payment Methods"
        sub="Cards and UPI tokenised securely with your bank."
        action={
          <button onClick={() => toast.success("Add payment coming soon")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-[0.2em] bg-gold-gradient text-[color:var(--charcoal)] font-medium">
            <Plus className="h-3.5 w-3.5" /> Add Method
          </button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {list.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="relative rounded-2xl overflow-hidden p-6 min-h-[200px] flex flex-col justify-between shadow-luxe"
            style={{
              background: "linear-gradient(135deg, oklch(0.22 0.02 80) 0%, oklch(0.16 0.02 70) 60%, oklch(0.28 0.06 75) 100%)",
            }}
          >
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gold-gradient opacity-20 blur-2xl" />
            <div className="flex items-start justify-between relative">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold)]">{p.brand}</p>
                <p className="mt-3 font-display text-lg tracking-[0.25em]">
                  {p.brand === "UPI" ? p.last4 : `•••• •••• •••• ${p.last4}`}
                </p>
              </div>
              {p.default && (
                <span className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--charcoal)] bg-gold-gradient px-2.5 py-1 rounded-full">Default</span>
              )}
            </div>
            <div className="flex items-end justify-between relative">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Holder</p>
                <p className="text-sm">{p.name}</p>
              </div>
              {p.expiry && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Expires</p>
                  <p className="text-sm">{p.expiry}</p>
                </div>
              )}
              <div className="flex gap-2">
                {!p.default && (
                  <button onClick={() => setDefault(p.id)} className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold)] hover:underline">
                    Default
                  </button>
                )}
                <button onClick={() => { setList(list.filter(x => x.id !== p.id)); toast.success("Method removed"); }} className="text-[10px] uppercase tracking-[0.2em] text-red-300 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Empty({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <div className="glass rounded-2xl p-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-gold-gradient/20 border border-[color:var(--gold)]/30 flex items-center justify-center text-[color:var(--gold)]">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-4 font-display text-xl">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      <Link to="/shop" className="inline-block mt-6 px-5 py-2.5 rounded-xl text-xs uppercase tracking-[0.25em] bg-gold-gradient text-[color:var(--charcoal)] font-medium">
        Explore Collection
      </Link>
    </div>
  );
}
