"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems] = useState([
    {
      id: 1,
      name: "Classic White Tee",
      price: 29.99,
      quantity: 1,
      image: "/white-tshirt.png",
    },
    {
      id: 2,
      name: "Denim Jacket",
      price: 89.99,
      quantity: 1,
      image: "/denim-jacket.jpg",
    },
  ]);

  return (
    <>
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              Fusion Designs
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 hover:bg-muted rounded-lg transition"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
      />
    </>
  );
}
