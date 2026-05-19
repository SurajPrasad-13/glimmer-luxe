import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  { label: "Women", to: "/shop" },
  { label: "Men", to: "/shop" },
  { label: "Bridal", to: "/shop" },
  { label: "Diamonds", to: "/shop" },
  { label: "Gold", to: "/shop" },
  { label: "Collections", to: "/shop" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-luxe" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            <button
              className="lg:hidden text-foreground"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-center gap-2 mx-auto lg:mx-0">
              <span className="font-display text-2xl lg:text-3xl tracking-[0.18em] text-gold-gradient">
                AURÉLIA
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-9">
              {nav.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  className="relative text-[12px] uppercase tracking-[0.22em] text-foreground/80 hover:text-[color:var(--gold)] transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-[color:var(--gold)] after:transition-all hover:after:w-full"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-3">
              <button onClick={() => setSearchOpen(true)} className="p-2 hover:text-[color:var(--gold)] transition" aria-label="Search">
                <Search className="h-[18px] w-[18px]" />
              </button>
              <button className="hidden sm:block p-2 hover:text-[color:var(--gold)] transition" aria-label="Account">
                <User className="h-[18px] w-[18px]" />
              </button>
              <button className="p-2 hover:text-[color:var(--gold)] transition" aria-label="Wishlist">
                <Heart className="h-[18px] w-[18px]" />
              </button>
              <Link to="/cart" className="relative p-2 hover:text-[color:var(--gold)] transition" aria-label="Cart">
                <ShoppingBag className="h-[18px] w-[18px]" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gold-gradient text-[10px] font-medium text-[color:var(--charcoal)] flex items-center justify-center">
                  2
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="absolute left-0 top-0 h-full w-[78%] max-w-sm glass p-6 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl tracking-[0.2em] text-gold-gradient">AURÉLIA</span>
                <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link key={n.label} to={n.to} onClick={() => setOpen(false)}
                    className="py-3 text-lg font-display border-b border-[color:var(--glass-border)] hover:text-[color:var(--gold)]">
                    {n.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] glass flex items-start justify-center pt-28 px-4"
          >
            <button className="absolute top-6 right-6" onClick={() => setSearchOpen(false)}>
              <X className="h-6 w-6" />
            </button>
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-3 border-b border-[color:var(--gold)]/40 pb-4">
                <Search className="h-5 w-5 text-[color:var(--gold)]" />
                <input
                  autoFocus
                  placeholder="Search for rings, earrings, diamonds…"
                  className="w-full bg-transparent outline-none text-xl font-display placeholder:text-muted-foreground"
                />
              </div>
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Trending</p>
                <div className="flex flex-wrap gap-2">
                  {["Solitaire Ring", "Bridal Set", "Mangalsutra", "Diamond Pendant", "Gold Bangles", "Men's Chain"].map((t) => (
                    <button key={t} className="px-4 py-2 rounded-full border border-[color:var(--glass-border)] text-sm hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
