import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Truck, CreditCard, Gift, Check, ChevronRight, ChevronLeft,
  Plus, Tag, ShieldCheck, Sparkles, Package, Clock, Zap, Wallet, Smartphone,
  Building2, Lock, AlertCircle, Loader2, QrCode, Download, RefreshCw, X,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { products, formatINR, type Product } from "@/lib/products";
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

type Address = {
  id: string; label: string; name: string; line: string;
  city: string; state: string; pin: string; phone: string;
};

const INITIAL_ADDRESSES: Address[] = [
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

const PROMO_MAP: Record<string, (sub: number) => number> = {
  AURELIA10: (s) => Math.round(s * 0.1),
  FESTIVE: () => 2500,
  WELCOME: () => 1500,
};

type CartItem = Product & { qty: number };

function CheckoutPage() {
  const [step, setStep] = useState<Step>(0);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [addressId, setAddressId] = useState("home");
  const [showAddrForm, setShowAddrForm] = useState(false);

  const [delivery, setDelivery] = useState<(typeof DELIVERY)[number]["id"]>("standard");
  const [wrap, setWrap] = useState<(typeof GIFT_WRAPS)[number]["id"]>("none");
  const [giftMsg, setGiftMsg] = useState("");
  const [giftErr, setGiftErr] = useState("");

  const [payment, setPayment] = useState<(typeof PAYMENTS)[number]["id"]>("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [cardErr, setCardErr] = useState<Partial<Record<keyof typeof card, string>>>({});
  const [upi, setUpi] = useState({ mode: "id" as "id" | "qr", id: "" });
  const [upiErr, setUpiErr] = useState("");

  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [promoErr, setPromoErr] = useState("");

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [success, setSuccess] = useState<null | {
    orderId: string; items: CartItem[]; address: Address;
    subtotal: number; shipping: number; wrapping: number; discount: number;
    tax: number; total: number; deliveryLabel: string; wrapLabel: string;
    paymentLabel: string; placedAt: string; promo?: string; giftMsg?: string;
  }>(null);

  const items = useMemo<CartItem[]>(() => products.slice(0, 2).map((p) => ({ ...p, qty: 1 })), []);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = DELIVERY.find((d) => d.id === delivery)!.price;
  const wrapping = GIFT_WRAPS.find((g) => g.id === wrap)!.price;
  const discount = promoApplied?.discount ?? 0;
  const tax = Math.round((subtotal - discount) * 0.03);
  const total = subtotal + shipping + wrapping + tax - discount;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    setPromoErr("");
    if (!code) { setPromoErr("Enter a promo code to apply."); return; }
    const fn = PROMO_MAP[code];
    if (!fn) { setPromoErr(`"${code}" is not a valid promo code.`); setPromoApplied(null); return; }
    const d = fn(subtotal);
    setPromoApplied({ code, discount: d });
    toast.success(`Promo ${code} applied · −${formatINR(d)}`);
  };

  const validateGift = () => {
    if (wrap !== "none" && giftMsg.trim().length < 3) {
      setGiftErr("Please add a short message (min 3 characters) for your gift wrap.");
      return false;
    }
    setGiftErr("");
    return true;
  };

  const validateCard = () => {
    const errs: typeof cardErr = {};
    const digits = card.number.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(digits)) errs.number = "Enter a valid card number (13–19 digits).";
    if (card.name.trim().length < 2) errs.name = "Cardholder name is required.";
    if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(card.expiry)) errs.expiry = "Expiry must be MM/YY.";
    else {
      const [mm, yy] = card.expiry.split("/").map((s) => parseInt(s.trim(), 10));
      const exp = new Date(2000 + yy, mm, 0, 23, 59, 59);
      if (exp < new Date()) errs.expiry = "Card has expired.";
    }
    if (!/^\d{3,4}$/.test(card.cvv)) errs.cvv = "CVV must be 3 or 4 digits.";
    setCardErr(errs);
    return Object.keys(errs).length === 0;
  };

  const validateUPI = () => {
    if (upi.mode === "qr") { setUpiErr(""); return true; }
    if (!/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upi.id.trim())) {
      setUpiErr("Enter a valid UPI ID (e.g. name@bank).");
      return false;
    }
    setUpiErr("");
    return true;
  };

  const next = () => {
    if (step === 0 && showAddrForm) { toast.error("Save or cancel the new address first."); return; }
    if (step === 2 && !validateGift()) return;
    setStep((s) => Math.min(3, s + 1) as Step);
  };
  const back = () => setStep((s) => Math.max(0, s - 1) as Step);

  const placeOrder = async () => {
    setPayError("");
    if (payment === "card" && !validateCard()) { toast.error("Fix the card details to continue."); return; }
    if (payment === "upi" && !validateUPI()) { toast.error("Enter a valid UPI ID."); return; }
    if (!validateGift()) { setStep(2); return; }

    setPaying(true);
    await new Promise((r) => setTimeout(r, 1600));
    // Simulate a 12% random gateway failure on card so users can see the error state
    const failed = payment === "card" && card.cvv === "000";
    if (failed) {
      setPaying(false);
      setPayError("Your bank declined this transaction. Please try a different card or method.");
      return;
    }
    const addr = addresses.find((a) => a.id === addressId)!;
    setSuccess({
      orderId: `AUR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 899)}`,
      items, address: addr,
      subtotal, shipping, wrapping, discount, tax, total,
      deliveryLabel: DELIVERY.find((d) => d.id === delivery)!.label,
      wrapLabel: GIFT_WRAPS.find((g) => g.id === wrap)!.label,
      paymentLabel: PAYMENTS.find((p) => p.id === payment)!.label,
      placedAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      promo: promoApplied?.code,
      giftMsg: wrap !== "none" ? giftMsg : undefined,
    });
    setPaying(false);
  };

  if (success) return <SuccessScreen order={success} />;

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pt-28 lg:pt-36 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
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
                  {step === 0 && (
                    <AddressStep
                      addresses={addresses}
                      value={addressId}
                      onChange={setAddressId}
                      showForm={showAddrForm}
                      setShowForm={setShowAddrForm}
                      onAdd={(a) => {
                        setAddresses((prev) => [...prev, a]);
                        setAddressId(a.id);
                        setShowAddrForm(false);
                        toast.success("Address saved");
                      }}
                    />
                  )}
                  {step === 1 && <DeliveryStep value={delivery} onChange={setDelivery} />}
                  {step === 2 && (
                    <GiftStep
                      wrap={wrap} onWrap={(v) => { setWrap(v); setGiftErr(""); }}
                      msg={giftMsg} onMsg={(v) => { setGiftMsg(v); if (giftErr) setGiftErr(""); }}
                      error={giftErr}
                    />
                  )}
                  {step === 3 && (
                    <PaymentStep
                      value={payment} onChange={(v) => { setPayment(v); setPayError(""); }}
                      card={card} setCard={setCard} cardErr={cardErr} setCardErr={setCardErr}
                      upi={upi} setUpi={setUpi} upiErr={upiErr} setUpiErr={setUpiErr}
                      total={total}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {payError && step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">Payment failed</p>
                      <p className="text-red-200/80 text-xs mt-0.5">{payError}</p>
                    </div>
                    <button onClick={placeOrder} className="text-xs uppercase tracking-[0.2em] inline-flex items-center gap-1 hover:text-white">
                      <RefreshCw className="h-3 w-3" /> Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={step === 0 ? undefined : back}
                  disabled={step === 0 || paying}
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
                    disabled={paying}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-[0.25em] bg-gold-gradient text-[color:var(--charcoal)] font-medium shadow-luxe disabled:opacity-70"
                  >
                    {paying ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                    ) : (
                      <><Lock className="h-4 w-4" /> Pay {formatINR(total)}</>
                    )}
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
                    <div className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border transition ${promoErr ? "border-red-500/60" : "border-[color:var(--glass-border)] focus-within:border-[color:var(--gold)]"}`}>
                      <Tag className="h-4 w-4 text-[color:var(--gold)]" />
                      <input
                        value={promo}
                        onChange={(e) => { setPromo(e.target.value); if (promoErr) setPromoErr(""); }}
                        onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                        placeholder="Promo code"
                        className="w-full bg-transparent outline-none text-sm uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground"
                      />
                      {promoApplied && (
                        <button onClick={() => { setPromoApplied(null); setPromo(""); }} className="text-muted-foreground hover:text-foreground">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <button onClick={applyPromo} className="px-4 rounded-xl text-xs uppercase tracking-[0.2em] border border-[color:var(--gold)]/40 text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 transition">
                      Apply
                    </button>
                  </div>
                  {promoErr && (
                    <p className="mt-2 text-xs text-red-300 flex items-center gap-1.5">
                      <AlertCircle className="h-3 w-3" /> {promoErr}
                    </p>
                  )}
                  {promoApplied && !promoErr && (
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
                  done || active
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
function AddressStep({
  addresses, value, onChange, showForm, setShowForm, onAdd,
}: {
  addresses: Address[]; value: string; onChange: (v: string) => void;
  showForm: boolean; setShowForm: (v: boolean) => void;
  onAdd: (a: Address) => void;
}) {
  return (
    <div>
      <StepHeader title="Shipping Address" sub="Choose a saved address or add a new one." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((a) => {
          const active = value === a.id;
          return (
            <button
              key={a.id} onClick={() => onChange(a.id)}
              className={`text-left rounded-2xl p-5 border transition-all ${
                active ? "border-[color:var(--gold)] bg-[color:var(--gold)]/5 shadow-luxe"
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
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl border border-dashed border-[color:var(--glass-border)] p-5 flex flex-col items-center justify-center text-muted-foreground hover:text-[color:var(--gold)] hover:border-[color:var(--gold)]/60 transition min-h-[170px]"
          >
            <Plus className="h-5 w-5" />
            <span className="mt-2 text-xs uppercase tracking-[0.25em]">Add New Address</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
          >
            <AddressForm onCancel={() => setShowForm(false)} onSave={onAdd} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddressForm({ onCancel, onSave }: { onCancel: () => void; onSave: (a: Address) => void }) {
  const [form, setForm] = useState({ label: "Home", name: "", line: "", city: "", state: "", pin: "", phone: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errs[k]) setErrs((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  const save = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Full name is required.";
    if (form.line.trim().length < 5) e.line = "Street address is required.";
    if (form.city.trim().length < 2) e.city = "City is required.";
    if (form.state.trim().length < 2) e.state = "State is required.";
    if (!/^\d{6}$/.test(form.pin)) e.pin = "PIN code must be 6 digits.";
    if (!/^[+\d][\d\s\-]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    setErrs(e);
    if (Object.keys(e).length) return;
    onSave({ ...form, id: `addr-${Date.now()}` });
  };

  return (
    <div className="mt-6 rounded-2xl border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display text-lg">New Address</p>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Full Name *" value={form.name} onChange={set("name")} error={errs.name} />
        <FormInput label="Phone *" value={form.phone} onChange={set("phone")} error={errs.phone} placeholder="+91 …" />
        <div className="sm:col-span-2">
          <FormInput label="Street Address *" value={form.line} onChange={set("line")} error={errs.line} />
        </div>
        <FormInput label="City *" value={form.city} onChange={set("city")} error={errs.city} />
        <FormInput label="State *" value={form.state} onChange={set("state")} error={errs.state} />
        <FormInput label="PIN Code *" value={form.pin} onChange={set("pin")} error={errs.pin} placeholder="6 digits" />
        <FormInput label="Label" value={form.label} onChange={set("label")} />
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-xs uppercase tracking-[0.2em] border border-[color:var(--glass-border)] hover:border-foreground/40">Cancel</button>
        <button onClick={save} className="px-5 py-2 rounded-xl text-xs uppercase tracking-[0.2em] bg-gold-gradient text-[color:var(--charcoal)] font-medium">Save Address</button>
      </div>
    </div>
  );
}

function FormInput({ label, error, ...rest }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <input
        {...rest}
        className={`mt-1.5 w-full rounded-xl bg-white/[0.04] border px-4 py-2.5 text-sm outline-none transition focus:bg-white/[0.06] ${error ? "border-red-500/60 focus:border-red-500" : "border-[color:var(--glass-border)] focus:border-[color:var(--gold)]"}`}
      />
      {error && <p className="mt-1 text-xs text-red-300 flex items-center gap-1.5"><AlertCircle className="h-3 w-3" />{error}</p>}
    </label>
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
              key={d.id} onClick={() => onChange(d.id)}
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
function GiftStep({
  wrap, onWrap, msg, onMsg, error,
}: { wrap: string; onWrap: (v: any) => void; msg: string; onMsg: (v: string) => void; error: string }) {
  return (
    <div>
      <StepHeader title="Gift Wrapping" sub="Make it unforgettable with our signature packaging." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GIFT_WRAPS.map((g) => {
          const active = wrap === g.id;
          return (
            <button
              key={g.id} onClick={() => onWrap(g.id)}
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
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
          >
            <div className="mt-6">
              <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Personal Message * · Hand-written by our team
              </label>
              <textarea
                value={msg}
                onChange={(e) => onMsg(e.target.value.slice(0, 180))}
                rows={3}
                placeholder="To my forever, with love…"
                className={`mt-2 w-full rounded-2xl bg-white/5 border outline-none px-4 py-3 text-sm font-display placeholder:text-muted-foreground transition ${
                  error ? "border-red-500/60" : "border-[color:var(--glass-border)] focus:border-[color:var(--gold)]"
                }`}
              />
              <div className="mt-1 flex items-center justify-between">
                {error ? (
                  <p className="text-xs text-red-300 flex items-center gap-1.5"><AlertCircle className="h-3 w-3" />{error}</p>
                ) : <span />}
                <p className="text-[10px] text-muted-foreground">{msg.length}/180</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- PAYMENT ---------- */
function PaymentStep({
  value, onChange, card, setCard, cardErr, setCardErr,
  upi, setUpi, upiErr, setUpiErr, total,
}: {
  value: string; onChange: (v: any) => void;
  card: { number: string; name: string; expiry: string; cvv: string };
  setCard: React.Dispatch<React.SetStateAction<{ number: string; name: string; expiry: string; cvv: string }>>;
  cardErr: Partial<Record<"number" | "name" | "expiry" | "cvv", string>>;
  setCardErr: React.Dispatch<React.SetStateAction<Partial<Record<"number" | "name" | "expiry" | "cvv", string>>>>;
  upi: { mode: "id" | "qr"; id: string };
  setUpi: React.Dispatch<React.SetStateAction<{ mode: "id" | "qr"; id: string }>>;
  upiErr: string; setUpiErr: (v: string) => void;
  total: number;
}) {
  return (
    <div>
      <StepHeader title="Payment Method" sub="All transactions encrypted & PCI-DSS compliant." />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {PAYMENTS.map((p) => {
          const active = value === p.id;
          const Icon = p.icon;
          return (
            <button
              key={p.id} onClick={() => onChange(p.id)}
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
          {value === "card" && <CardForm card={card} setCard={setCard} errors={cardErr} setErrors={setCardErr} />}
          {value === "upi" && <UPIForm upi={upi} setUpi={setUpi} error={upiErr} setError={setUpiErr} total={total} />}
          {value === "wallet" && <SimpleNote text="You'll be redirected to your selected wallet (Paytm, PhonePe, Amazon Pay) to complete payment." />}
          {value === "netbanking" && <SimpleNote text="Select your bank on the next screen — supports 50+ Indian banks." />}
          {value === "cod" && <SimpleNote text="Pay in cash on delivery. Available on orders below ₹50,000." />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Lock className="h-3 w-3 text-[color:var(--gold)]" /> Your payment details are encrypted end-to-end. Tip: use CVV "000" to simulate a failure.
      </div>
    </div>
  );
}

function CardForm({
  card, setCard, errors, setErrors,
}: {
  card: { number: string; name: string; expiry: string; cvv: string };
  setCard: React.Dispatch<React.SetStateAction<typeof card>>;
  errors: Partial<Record<keyof typeof card, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof typeof card, string>>>>;
}) {
  const clear = (k: keyof typeof card) => { if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n; }); };

  const formatNumber = (v: string) => v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Card preview */}
      <div className="relative h-44 rounded-2xl bg-gradient-to-br from-[#2a2419] via-[#1a1611] to-black border border-[color:var(--gold)]/30 p-5 overflow-hidden shadow-luxe">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[color:var(--gold)]/20 blur-3xl" />
        <div className="flex justify-between items-start relative">
          <div className="h-8 w-12 rounded bg-gradient-to-br from-[color:var(--gold)] to-amber-700/70" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold)]">Aurélia</span>
        </div>
        <p className="mt-6 font-mono text-lg tracking-[0.2em] text-foreground/90">
          {card.number || "•••• •••• •••• ••••"}
        </p>
        <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <div>
            <p className="text-[9px]">Cardholder</p>
            <p className="text-foreground/90 mt-0.5">{card.name || "YOUR NAME"}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px]">Expires</p>
            <p className="text-foreground/90 mt-0.5">{card.expiry || "MM/YY"}</p>
          </div>
        </div>
      </div>

      <PField label="Card Number *" error={errors.number}>
        <input
          inputMode="numeric"
          value={card.number}
          onChange={(e) => { setCard((p) => ({ ...p, number: formatNumber(e.target.value) })); clear("number"); }}
          placeholder="1234 5678 9012 3456"
          className={inputCls(!!errors.number)}
        />
      </PField>
      <PField label="Name on Card *" error={errors.name}>
        <input
          value={card.name}
          onChange={(e) => { setCard((p) => ({ ...p, name: e.target.value.toUpperCase() })); clear("name"); }}
          placeholder="AANYA SHARMA"
          className={inputCls(!!errors.name) + " uppercase tracking-wider"}
        />
      </PField>
      <div className="grid grid-cols-2 gap-4">
        <PField label="Expiry *" error={errors.expiry}>
          <input
            inputMode="numeric"
            value={card.expiry}
            onChange={(e) => { setCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) })); clear("expiry"); }}
            placeholder="MM/YY"
            className={inputCls(!!errors.expiry)}
          />
        </PField>
        <PField label="CVV *" error={errors.cvv}>
          <input
            inputMode="numeric" type="password" maxLength={4}
            value={card.cvv}
            onChange={(e) => { setCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "") })); clear("cvv"); }}
            placeholder="•••"
            className={inputCls(!!errors.cvv)}
          />
        </PField>
      </div>
    </div>
  );
}

function UPIForm({
  upi, setUpi, error, setError, total,
}: {
  upi: { mode: "id" | "qr"; id: string };
  setUpi: React.Dispatch<React.SetStateAction<typeof upi>>;
  error: string; setError: (v: string) => void; total: number;
}) {
  const [waiting, setWaiting] = useState(false);
  useEffect(() => { setWaiting(false); }, [upi.mode]);

  const upiUri = `upi://pay?pa=aurelia@hdfcbank&pn=Aurelia&am=${total}&cu=INR&tn=Aurelia%20Order`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiUri)}`;

  return (
    <div className="space-y-4">
      <div className="inline-flex p-1 rounded-xl border border-[color:var(--glass-border)]">
        {(["id", "qr"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setUpi((p) => ({ ...p, mode: m }))}
            className={`px-4 py-1.5 rounded-lg text-xs uppercase tracking-[0.2em] transition ${
              upi.mode === m ? "bg-gold-gradient text-[color:var(--charcoal)]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "id" ? "Enter UPI ID" : "Scan QR"}
          </button>
        ))}
      </div>

      {upi.mode === "id" ? (
        <PField label="UPI ID *" error={error}>
          <input
            value={upi.id}
            onChange={(e) => { setUpi((p) => ({ ...p, id: e.target.value.trim() })); if (error) setError(""); }}
            placeholder="yourname@bank"
            className={inputCls(!!error)}
          />
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            We'll send a collect request to your UPI app. Approve within 5 minutes.
          </p>
        </PField>
      ) : (
        <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/[0.03] p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="rounded-2xl bg-white p-3 shrink-0">
            <img src={qrSrc} alt="UPI QR code" className="h-44 w-44" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold)] flex items-center justify-center sm:justify-start gap-2">
              <QrCode className="h-3.5 w-3.5" /> Scan with any UPI app
            </p>
            <p className="mt-2 font-display text-xl">Pay {formatINR(total)}</p>
            <p className="mt-1 text-xs text-muted-foreground">aurelia@hdfcbank · Aurélia Jewellery</p>
            <button
              onClick={() => setWaiting((w) => !w)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-[0.2em] border border-[color:var(--gold)]/50 text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 transition"
            >
              {waiting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Waiting for payment…</> : <>I've Scanned</>}
            </button>
          </div>
        </div>
      )}
    </div>
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

function PField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-red-300 flex items-center gap-1.5"><AlertCircle className="h-3 w-3" />{error}</p>}
    </label>
  );
}

const inputCls = (err: boolean) =>
  `w-full bg-white/[0.04] border rounded-[0.85rem] px-4 py-3 text-sm outline-none transition focus:bg-white/[0.06] ${
    err ? "border-red-500/60 focus:border-red-500" : "border-[color:var(--glass-border)] focus:border-[color:var(--gold)]"
  }`;

function StepHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

/* ---------- SUCCESS ---------- */


function SuccessScreen({ order }: { order: any }) {
  const navigate = useNavigate();

  const downloadReceipt = () => {
    const lines: string[] = [];
    lines.push("AURÉLIA · HEIRLOOM FINE JEWELLERY");
    lines.push("Order Receipt");
    lines.push("====================================");
    lines.push(`Order ID    : ${order.orderId}`);
    lines.push(`Placed      : ${order.placedAt}`);
    lines.push(`Payment     : ${order.paymentLabel}`);
    lines.push(`Delivery    : ${order.deliveryLabel}`);
    lines.push(`Gift Wrap   : ${order.wrapLabel}`);
    if (order.giftMsg) lines.push(`Gift Message: "${order.giftMsg}"`);
    lines.push("");
    lines.push("Shipping Address");
    lines.push("------------------------------------");
    lines.push(`${order.address.name}`);
    lines.push(`${order.address.line}`);
    lines.push(`${order.address.city}, ${order.address.state} ${order.address.pin}`);
    lines.push(`${order.address.phone}`);
    lines.push("");
    lines.push("Items");
    lines.push("------------------------------------");
    order.items.forEach((i: CartItem) => {
      lines.push(`${i.name.padEnd(34)} ${i.metal.padEnd(10)} x${i.qty}  ${formatINR(i.price * i.qty)}`);
    });
    lines.push("");
    lines.push("Totals");
    lines.push("------------------------------------");
    lines.push(`Subtotal       : ${formatINR(order.subtotal)}`);
    lines.push(`Shipping       : ${order.shipping === 0 ? "Free" : formatINR(order.shipping)}`);
    if (order.wrapping > 0) lines.push(`Gift Wrap      : ${formatINR(order.wrapping)}`);
    if (order.discount > 0) lines.push(`Discount${order.promo ? ` (${order.promo})` : ""}: -${formatINR(order.discount)}`);
    lines.push(`GST (3%)       : ${formatINR(order.tax)}`);
    lines.push(`TOTAL PAID     : ${formatINR(order.total)}`);
    lines.push("");
    lines.push("Thank you for choosing Aurélia.");
    lines.push("Lifetime exchange · Hallmark certified · Free re-polishing");

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `aurelia-receipt-${order.orderId}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 pt-28 pb-24 px-4 relative overflow-hidden">
        {/* Confetti */}
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -300 - Math.random() * 220],
              x: [(Math.random() - 0.5) * 80, (Math.random() - 0.5) * 600],
              scale: [0, 1, 0.5], rotate: Math.random() * 360,
            }}
            transition={{ duration: 2.4 + Math.random(), delay: 0.4 + i * 0.06, ease: "easeOut" }}
            className="absolute bottom-1/3 left-1/2 h-2 w-2 rounded-full"
            style={{ background: i % 2 === 0 ? "var(--gold)" : "#f3e6c4", boxShadow: "0 0 12px var(--gold)" }}
          />
        ))}

        <div className="relative mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass rounded-3xl p-8 sm:p-12 shadow-luxe text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
              className="mx-auto h-20 w-20 rounded-full bg-gold-gradient flex items-center justify-center relative shadow-luxe"
            >
              <Check className="h-10 w-10 text-[color:var(--charcoal)]" strokeWidth={3} />
              <motion.span
                animate={{ scale: [1, 1.6, 1.9], opacity: [0.6, 0.2, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[color:var(--gold)]/40"
              />
            </motion.div>

            <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-[color:var(--gold)]">Order Confirmed</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Thank You</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your Aurélia order has been placed. A confirmation has been sent to your inbox.
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-6 px-6 py-4 rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/[0.04]">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order ID</p>
                <p className="font-mono text-base text-foreground">{order.orderId}</p>
              </div>
              <div className="h-8 w-px bg-[color:var(--glass-border)] hidden sm:block" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Placed</p>
                <p className="text-sm">{order.placedAt}</p>
              </div>
              <div className="h-8 w-px bg-[color:var(--glass-border)] hidden sm:block" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Total Paid</p>
                <p className="font-display text-lg text-gold-gradient">{formatINR(order.total)}</p>
              </div>
            </div>
          </motion.div>

          {/* Itemized receipt */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 glass rounded-3xl p-6 sm:p-8 shadow-luxe text-left"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-display text-2xl">Receipt</h2>
              <button
                onClick={downloadReceipt}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-[0.2em] border border-[color:var(--gold)]/40 text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 transition"
              >
                <Download className="h-3.5 w-3.5" /> Download Receipt
              </button>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Shipping to</p>
                <p className="mt-1.5 font-medium">{order.address.name}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {order.address.line}<br />{order.address.city}, {order.address.state} {order.address.pin}<br />{order.address.phone}
                </p>
              </div>
              <div className="space-y-2">
                <SumRow k="Delivery" v={order.deliveryLabel} />
                <SumRow k="Payment" v={order.paymentLabel} />
                <SumRow k="Gift wrap" v={order.wrapLabel} />
                {order.giftMsg && <SumRow k="Gift message" v={`"${order.giftMsg}"`} />}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[color:var(--glass-border)] space-y-3">
              {order.items.map((i: CartItem) => (
                <div key={i.id} className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl overflow-hidden glass shrink-0">
                    <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display">{i.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{i.metal} · Qty {i.qty}</p>
                  </div>
                  <p className="text-sm">{formatINR(i.price * i.qty)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[color:var(--glass-border)] space-y-2 text-sm">
              <Row label="Subtotal" value={formatINR(order.subtotal)} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatINR(order.shipping)} />
              {order.wrapping > 0 && <Row label="Gift wrap" value={formatINR(order.wrapping)} />}
              {order.discount > 0 && (
                <Row label={`Discount${order.promo ? ` (${order.promo})` : ""}`} value={`−${formatINR(order.discount)}`} accent />
              )}
              <Row label="GST (3%)" value={formatINR(order.tax)} />
            </div>

            <div className="mt-4 pt-4 border-t border-[color:var(--glass-border)] flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Total Paid</span>
              <span className="font-display text-2xl text-gold-gradient">{formatINR(order.total)}</span>
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
                className="px-6 py-3 rounded-xl text-xs uppercase tracking-[0.25em] border border-[color:var(--glass-border)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SumRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground w-28 shrink-0 mt-0.5">{k}</span>
      <span className="text-sm">{v}</span>
    </div>
  );
}
