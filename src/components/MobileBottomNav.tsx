import { Link } from "@tanstack/react-router";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";

const items = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Search, label: "Shop", to: "/shop" },
  { icon: Heart, label: "Wishlist", to: "/" },
  { icon: ShoppingBag, label: "Bag", to: "/cart" },
  { icon: User, label: "Account", to: "/" },
];

export function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-3 inset-x-3 z-40 glass rounded-2xl shadow-luxe px-2 py-2">
      <ul className="flex items-center justify-around">
        {items.map(({ icon: Icon, label, to }) => (
          <li key={label}>
            <Link to={to} className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] text-foreground/70 hover:text-[color:var(--gold)]">
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
