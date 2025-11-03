"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ProductGrid from "@/components/product-grid";
import CartSidebar from "@/components/cart-sidebar";
import Footer from "@/components/footer";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
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
    <div className="min-h-screen bg-background">
      <Navbar
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
      />
      <Hero />

      <main className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="space-y-6 sticky top-24">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={"abc"}
                readOnly
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Categories</h3>
              <div className="space-y-2">
                {["Tops", "Bottoms", "Dresses", "Outerwear", "Accessories"].map(
                  (cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox id={cat} />
                      <label htmlFor={cat} className="text-sm cursor-pointer">
                        {cat}
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Price Range</h3>
              <Slider
                defaultValue={[0, 200]}
                max={500}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$0</span>
                <span>$500</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort Dropdown */}
          <div className="flex justify-end mb-6">
            <Select defaultValue="newest">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <ProductGrid />
        </div>
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
      />

      <Footer />
    </div>
  );
}
