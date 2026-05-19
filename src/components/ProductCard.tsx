import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { type Product, formatINR } from "@/lib/products";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: "easeOut" }}
      className="group relative"
    >
      <Link to="/products/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl glass shadow-luxe">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest bg-gold-gradient text-[color:var(--charcoal)] font-medium">
              {product.badge}
            </span>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <button
              onClick={(e) => { e.preventDefault(); toast.success("Added to wishlist"); }}
              className="h-9 w-9 rounded-full glass flex items-center justify-center hover:text-[color:var(--gold)]"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="h-9 w-9 rounded-full glass flex items-center justify-center hover:text-[color:var(--gold)]"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <button
              onClick={(e) => { e.preventDefault(); toast.success(`${product.name} added to bag`); }}
              className="w-full rounded-xl bg-gold-gradient py-2.5 text-xs uppercase tracking-[0.25em] font-medium text-[color:var(--charcoal)] hover:opacity-90 transition"
            >
              Add to Bag
            </button>
          </div>
        </div>

        <div className="mt-4 px-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{product.metal} · {product.category}</p>
          <h3 className="mt-1 font-display text-lg text-foreground/95 group-hover:text-[color:var(--gold)] transition-colors">
            {product.name}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm text-foreground/90">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs line-through text-muted-foreground">{formatINR(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
