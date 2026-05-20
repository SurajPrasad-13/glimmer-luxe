import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Truck, CreditCard, Gift, Check, ChevronRight, ChevronLeft,
  Plus, Tag, ShieldCheck, Sparkles, Package, Clock, Zap, Wallet, Smartphone, Building2, Lock,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { products, formatINR } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · Aurélia" }] }),
  component: CheckoutPage,
});

type Step = 0 | 1 | 2 | 3;
const STEPS = [
  { id: 0, label: "Address", icon: MapPin },
  { id: 1, label: "Delivery", icon: Truck },
  { id: 2, label: "Gift", icon: Gift },
  { id: 3, label: "Payment", icon: CreditCard },
] as const;

const SAVED_ADDRESSES = [
  { id: "home", label: "Home", name: "Aanya Sharma", line: "12 Lotus Residency, Bandra West", city: "Mumbai", state: "Maharashtra", pin: "400050", phone: "+91 98200 11122" },
  { id: "office", label: "Office", name: "Aanya Sharma", line: "Tower B, 8th Floor, Nariman Point", city: "Mumbai", state: "Maharashtra", pin: "400021", phone: "+91 98200 11122" },
];

const DELIVERY = [
  { id: "standard", label: "Standard Delivery", eta: "5–7 business days", price: 0, icon: Package, note: "Free · Insured" },
  { id: "express", label: "Express Delivery", eta: "2–3 business days", price: 499, icon: Truck, note: "Priority handling" },
  { id: "white-glove", label: "White-Glove Concierge", eta: "Next day · 10am–6pm", price: 1499, icon: Sparkles, note: "Hand-delivered by an Aurélia stylist" },
] as const;

const GIFT_WRAPS = [
  { id: "none", label: "No Gift Wrap", price: 0, desc: "Standard Aurélia signature box." },
  { id: "silk", label: "Silk Heritage Wrap", price: 399, desc: "Hand-tied silk ribbon, ivory monogram box." },
  { id: "velvet", label: "Velvet Heirloom Case", price: 899, desc: "Plush velvet case with engraved brass clasp." },
] as const;

const PAYMENTS = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "wallet", label: "Wallets", icon: Wallet },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "cod", label: "Cash on Delivery", icon: Package },
] as const;

function CheckoutPage() {
  const [step, setStep] = useState<Step>(0);
  const [success, setSuccess] = useState(false);

  const [addressId, setAddressId] = useState("home");
  const [delivery, setDelivery] = useState<(typeof DELIVERY)[number]["id"]>("standard");
  const [wrap, setWrap] = useState<(typeof GIFT_WRAPS)[number]["id"]>("none");
  const [giftMsg, setGiftMsg] = useState("");
  const [payment, setPayment] = useState<(typeof PAYMENTS)[number]["id"]>("card");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);

  const items = useMemo(() => products.slice(0, 2).map((p) => ({ ...p, qty: 1 })), []);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = DELIVERY.find((d) => d.id === delivery)!.price;
  const wrapping = GIFT_WRAPS.find((g) => g.id === wrap)!.price;
  const discount = promoApplied?.discount ?? 0;
  const tax = Math.round((subtotal - discount) * 0.03);
  const total = subtotal + shipping + wrapping + tax - discount;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    const map: Record<string, number> = { AURELIA10: Math.round(subtotal * 0.1), FESTIVE: 2500, WELCOME: 1500 };
    if (map[code]) {
      setPromoApplied({ code, discount: map[code] });
      toast.success(`Promo ${code} applied · −${formatINR(map[code])}`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const next = () => setStep((s) => Math.min(3, (s + 1)) as Step);
  const back = () => setStep((s) => Math.max(0, (s - 1)) as Step);

  const placeOrder = () => {
    setSuccess(true);
  };

  if (success) return <SuccessScreen total={total} />;

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pt-28 lg:pt-36 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {/* Heading + stepper */}
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--gold)]">Secure Checkout</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Complete Your Order</h1>
          </div>

          <Stepper step={step} />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="glass rounded-3xl p-6 sm:p-8 shadow-luxe"
                >
                  {step === 0 && <AddressStep value={addressId} onChange={setAddressId} />}
                  {step === 1 && <DeliveryStep value={delivery} onChange={setDelivery} />}
                  {step === 2 && <GiftStep wrap={wrap} onWrap={setWrap} msg={giftMsg} onMsg={setGiftMsg} />}
                  {step === 3 && <PaymentStep value={payment} onChange={setPayment} />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={step === 0 ? undefined : back}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs uppercase tracking-[0.25em] border border-[color:var(--glass-border)] disabled:opacity-30 hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>

                {step < 3 ? (
                  <button
                    onClick={next}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-[0.25em] bg-gold-gradient text-[color:var(--charcoal)] font-medium shadow-luxe"
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-[0.25em] bg-gold-gradient text-[color:var(--charcoal)] font-medium shadow-luxe"
                  >
                    <Lock className="h-4 w-4" /> Place Order · {formatINR(total)}
                  </button>
                )}
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="glass rounded-3xl p-6 shadow-luxe">
                <h3 className="font-display text-xl">Order Summary</h3>

                <div className="mt-5 space-y-4">
                  {items.map((i) => (
                    <div key={i.id} className="flex gap-3">
                      <div className="h-16 w-16 rounded-xl overflow-hidden glass shrink-0">
                        <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display truncate">{i.name}</p>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{i.metal} · Qty {i.qty}</p>
                      </div>
                      <p className="text-sm">{formatINR(i.price * i.qty)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-[color:var(--glass-border)]">
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[color:var(--glass-border)] focus-within:border-[color:var(--gold)] transition">
                      <Tag className="h-4 w-4 text-[color:var(--gold)]" />
                      <input
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder="Promo code"
                        className="w-full bg-transparent outline-none text-sm uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground"
                      />
                    </div>
                    <button onClick={applyPromo} className="px-4 rounded-xl text-xs uppercase tracking-[0.2em] border border-[color:var(--gold)]/40 text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 transition">
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="mt-2 text-xs text-emerald-300">✓ {promoApplied.code} · −{formatINR(promoApplied.discount)}</p>
                  )}
                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Try AURELIA10 · FESTIVE · WELCOME</p>
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  <Row label="Subtotal" value={formatINR(subtotal)} />
                  <Row label="Shipping" value={shipping === 0 ? "Free" : formatINR(shipping)} />
                  {wrapping > 0 && <Row label="Gift wrap" value={formatINR(wrapping)} />}
                  {discount > 0 && <Row label="Discount" value={`−${formatINR(discount)}`} accent />}
                  <Row label="GST (3%)" value={formatINR(tax)} />
                </div>

                <div className="mt-5 pt-5 border-t border-[color:var(--glass-border)] flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Total</span>
                  <span className="font-display text-2xl text-gold-gradient">{formatINR(total)}</span>
                </div>

                <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--gold)]" />
                  Secured · Hallmark certified · Lifetime exchange
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-emerald-300" : ""}>{value}</span>
    </div>
  );
}

/* ---------- STEPPER ---------- */
function Stepper({ step }: { step: Step }) {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute top-5 left-[10%] right-[10%] h-px bg-[color:var(--glass-border)]" />
      <motion.div
        className="absolute top-5 left-[10%] h-px bg-gold-gradient"
        initial={false}
        animate={{ width: `${(step / (STEPS.length - 1)) * 80}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <div className="relative grid grid-cols-4">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ scale: active ? 1.05 : 1 }}
                className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all ${
                  done
                    ? "bg-gold-gradient border-transparent text-[color:var(--charcoal)]"
                    : active
                    ? "bg-gold-gradient border-transparent text-[color:var(--charcoal)] shadow-luxe"
                    : "border-[color:var(--glass-border)] text-muted-foreground bg-background"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </motion.div>
              <p className={`text-[10px] uppercase tracking-[0.25em] ${active || done ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- ADDRESS ---------- */
function AddressStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <StepHeader title="Shipping Address" sub="Choose a saved address or add a new one." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAVED_ADDRESSES.map((a) => {
          const active = value === a.id;
          return (
            <button
              key={a.id}
              onClick={() => onChange(a.id)}
              className={`text-left rounded-2xl p-5 border transition-all ${
                active
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)]/5 shadow-luxe"
                  : "border-[color:var(--glass-border)] hover:border-[color:var(--gold)]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--gold)]">{a.label}</span>
                <span className={`h-5 w-5 rounded-full border flex items-center justify-center ${active ? "border-[color:var(--gold)] bg-gold-gradient" : "border-[color:var(--glass-border)]"}`}>
                  {active && <Check className="h-3 w-3 text-[color:var(--charcoal)]" />}
                </span>
              </div>
              <p className="mt-3 font-display text-lg">{a.name}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {a.line}<br />{a.city}, {a.state} {a.pin}<br />{a.phone}
              </p>
            </button>
          );
        })}
        <button
          onClick={() => toast.info("Address form coming soon")}
          className="rounded-2xl border border-dashed border-[color:var(--glass-border)] p-5 flex flex-col items-center justify-center text-muted-foreground hover:text-[color:var(--gold)] hover:border-[color:var(--gold)]/60 transition min-h-[170px]"
        >
          <Plus className="h-5 w-5" />
          <span className="mt-2 text-xs uppercase tracking-[0.25em]">Add New Address</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- DELIVERY ---------- */
function DeliveryStep({ value, onChange }: { value: string; onChange: (v: any) => void }) {
  return (
    <div>
      <StepHeader title="Delivery Method" sub="Insured shipping on every Aurélia order." />
      <div className="space-y-3">
        {DELIVERY.map((d) => {
          const active = value === d.id;
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => onChange(d.id)}
              className={`w-full text-left rounded-2xl p-5 border flex items-center gap-5 transition-all ${
                active ? "border-[color:var(--gold)] bg-[color:var(--gold)]/5 shadow-luxe" : "border-[color:var(--glass-border)] hover:border-[color:var(--gold)]/50"
              }`}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-gold-gradient text-[color:var(--charcoal)]" : "bg-white/5 text-[color:var(--gold)]"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg">{d.label}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" /> {d.eta} · <span className="text-[color:var(--gold)]">{d.note}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg">{d.price === 0 ? "Free" : formatINR(d.price)}</p>
              </div>
              <span className={`h-5 w-5 rounded-full border flex items-center justify-center ${active ? "border-[color:var(--gold)] bg-gold-gradient" : "border-[color:var(--glass-border)]"}`}>
                {active && <Check className="h-3 w-3 text-[color:var(--charcoal)]" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- GIFT ---------- */
function GiftStep({ wrap, onWrap, msg, onMsg }: { wrap: string; onWrap: (v: any) => void; msg: string; onMsg: (v: string) => void }) {
  return (
    <div>
      <StepHeader title="Gift Wrapping" sub="Make it unforgettable with our signature packaging." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GIFT_WRAPS.map((g) => {
          const active = wrap === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onWrap(g.id)}
              className={`text-left rounded-2xl p-5 border transition-all ${
                active ? "border-[color:var(--gold)] bg-[color:var(--gold)]/5 shadow-luxe" : "border-[color:var(--glass-border)] hover:border-[color:var(--gold)]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <Gift className="h-5 w-5 text-[color:var(--gold)]" />
                <span className="text-xs">{g.price === 0 ? "Free" : `+${formatINR(g.price)}`}</span>
              </div>
              <p className="mt-3 font-display text-base">{g.label}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{g.desc}</p>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {wrap !== "none" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6">
              <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Personal Message · Hand-written by our team</label>
              <textarea
                value={msg}
                onChange={(e) => onMsg(e.target.value.slice(0, 180))}
                rows={3}
                placeholder="To my forever, with love…"
                className="mt-2 w-full rounded-2xl bg-white/5 border border-[color:var(--glass-border)] focus:border-[color:var(--gold)] outline-none px-4 py-3 text-sm font-display placeholder:text-muted-foreground transition"
              />
              <p className="mt-1 text-[10px] text-right text-muted-foreground">{msg.length}/180</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- PAYMENT ---------- */
function PaymentStep({ value, onChange }: { value: string; onChange: (v: any) => void }) {
  return (
    <div>
      <StepHeader title="Payment Method" sub="All transactions encrypted & PCI-DSS compliant." />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {PAYMENTS.map((p) => {
          const active = value === p.id;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`rounded-xl p-3 border flex flex-col items-center gap-2 transition-all ${
                active ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-[color:var(--gold)]" : "border-[color:var(--glass-border)] hover:border-[color:var(--gold)]/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-center leading-tight">{p.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {value === "card" && <CardForm />}
          {value === "upi" && <UPIForm />}
          {value === "wallet" && <SimpleNote text="You'll be redirected to your selected wallet (Paytm, PhonePe, Amazon Pay) to complete payment." />}
          {value === "netbanking" && <SimpleNote text="Select your bank on the next screen — supports 50+ Indian banks." />}
          {value === "cod" && <SimpleNote text="Pay in cash on delivery. Available on orders below ₹50,000." />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Lock className="h-3 w-3 text-[color:var(--gold)]" /> Your payment details are encrypted end-to-end.
      </div>
    </div>
  );
}

function CardForm() {
  return (
    <div className="space-y-4">
      <Field label="Card Number">
        <input placeholder="1234 5678 9012 3456" className="input" />
      </Field>
      <Field label="Name on Card">
        <input placeholder="AANYA SHARMA" className="input uppercase tracking-wider" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Expiry"><input placeholder="MM / YY" className="input" /></Field>
        <Field label="CVV"><input placeholder="•••" className="input" /></Field>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" defaultChecked className="accent-[color:var(--gold)]" />
        Securely save this card for future Aurélia purchases.
      </label>
    </div>
  );
}

function UPIForm() {
  return (
    <Field label="UPI ID">
      <input placeholder="yourname@bank" className="input" />
    </Field>
  );
}

function SimpleNote({ text }: { text: string }) {
  return (
    <div className="rounded-2xl p-5 border border-[color:var(--glass-border)] bg-white/[0.03] text-sm text-muted-foreground flex items-start gap-3">
      <Zap className="h-4 w-4 text-[color:var(--gold)] mt-0.5 shrink-0" />
      {text}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      <style>{`.input{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);border-radius:0.85rem;padding:0.75rem 1rem;font-size:0.95rem;outline:none;transition:border-color .2s, background .2s}.input:focus{border-color:var(--gold);background:rgba(255,255,255,0.06)}`}</style>
    </label>
  );
}

function StepHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

/* ---------- SUCCESS ---------- */
function SuccessScreen({ total }: { total: number }) {
  const navigate = useNavigate();
  const orderId = `AUR-${Math.floor(10000 + Math.random() * 89999)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-28 pb-24 px-4 relative overflow-hidden">
        {/* Confetti / sparkles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -300 - Math.random() * 200],
              x: [(Math.random() - 0.5) * 80, (Math.random() - 0.5) * 600],
              scale: [0, 1, 0.5],
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 2.4 + Math.random(), delay: 0.4 + i * 0.06, ease: "easeOut" }}
            className="absolute bottom-1/3 left-1/2 h-2 w-2 rounded-full"
            style={{
              background: i % 2 === 0 ? "var(--gold)" : "var(--champagne, #f3e6c4)",
              boxShadow: "0 0 12px var(--gold)",
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-lg w-full text-center glass rounded-3xl p-10 shadow-luxe"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
            className="mx-auto h-24 w-24 rounded-full bg-gold-gradient flex items-center justify-center relative shadow-luxe"
          >
            <motion.div
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Check className="h-12 w-12 text-[color:var(--charcoal)]" strokeWidth={3} />
            </motion.div>
            <motion.span
              animate={{ scale: [1, 1.6, 1.9], opacity: [0.6, 0.2, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[color:var(--gold)]/40"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-[color:var(--gold)]">Order Confirmed</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Thank You</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your Aurélia order <span className="text-foreground">{orderId}</span> has been placed.
              A confirmation has been sent to your inbox.
            </p>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Total Paid</p>
                <p className="font-display text-lg text-gold-gradient">{formatINR(total)}</p>
              </div>
              <div className="h-8 w-px bg-[color:var(--glass-border)]" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Delivery</p>
                <p className="font-display text-lg">5–7 days</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate({ to: "/account" })}
                className="px-6 py-3 rounded-xl text-xs uppercase tracking-[0.25em] bg-gold-gradient text-[color:var(--charcoal)] font-medium shadow-luxe"
              >
                Track Order
              </button>
              <Link
                to="/shop"
                className="px-6 py-3 rounded-xl text-xs uppercase tracking-[0.25em] border border-[color:var(--glass-border)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
