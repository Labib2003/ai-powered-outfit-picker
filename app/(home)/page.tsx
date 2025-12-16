"use client";

import { useState } from "react";
import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import CartSidebar from "./components/cart-sidebar";
import Footer from "./components/footer";
import ProductFilterInputs from "./components/ProductFilterInputs";
import { trpc } from "../_trpc/client";
import { useSearchParams } from "next/navigation";

export default function Home() {
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

  const { data: categories = [] } = trpc.category.list.useQuery();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const search = searchParams.get("search") ?? undefined;
  const filterCategories = searchParams.getAll("category");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const sort = searchParams.get("sort") ?? undefined;

  const { data: paginatedProducts } = trpc.product.list.useQuery({
    page,
    limit,
    search,
    category: filterCategories.length ? filterCategories : undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    sort: sort as any,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
      />
      <Hero categories={categories} />

      <main className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Sidebar */}
        <ProductFilterInputs categories={categories} />

        {/* Main Content */}
        <ProductGrid products={paginatedProducts?.data} />
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
