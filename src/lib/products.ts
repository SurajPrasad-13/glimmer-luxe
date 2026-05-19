import ring from "@/assets/product-ring.jpg";
import earrings from "@/assets/product-earrings.jpg";
import bangle from "@/assets/product-bangle.jpg";
import pendant from "@/assets/product-pendant.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  metal: "Gold" | "Silver" | "Platinum" | "Rose Gold";
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
};

export const products: Product[] = [
  { id: "aurelia-solitaire", name: "Aurelia Solitaire Ring", category: "Rings", metal: "Gold", price: 84500, originalPrice: 96000, image: ring, rating: 4.9, reviews: 218, badge: "Bestseller" },
  { id: "celeste-drops", name: "Celeste Diamond Drops", category: "Earrings", metal: "Platinum", price: 62300, image: earrings, rating: 4.8, reviews: 142, badge: "New" },
  { id: "noor-bangle", name: "Noor Filigree Bangle", category: "Bangles", metal: "Rose Gold", price: 128900, originalPrice: 145000, image: bangle, rating: 4.95, reviews: 89, badge: "Limited" },
  { id: "lumiere-pendant", name: "Lumière Solitaire Pendant", category: "Pendants", metal: "Gold", price: 39400, image: pendant, rating: 4.7, reviews: 326 },
  { id: "regalia-ring", name: "Regalia Halo Ring", category: "Rings", metal: "Platinum", price: 112000, image: ring, rating: 4.85, reviews: 64 },
  { id: "soiree-earrings", name: "Soirée Pear Drops", category: "Earrings", metal: "Gold", price: 58200, originalPrice: 68000, image: earrings, rating: 4.9, reviews: 198, badge: "-15%" },
  { id: "heritage-bangle", name: "Heritage Kada", category: "Bangles", metal: "Gold", price: 94500, image: bangle, rating: 4.8, reviews: 77 },
  { id: "etoile-pendant", name: "Étoile Diamond Pendant", category: "Pendants", metal: "Rose Gold", price: 47800, image: pendant, rating: 4.75, reviews: 152 },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
