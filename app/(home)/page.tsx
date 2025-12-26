import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import ProductFilterInputs from "./components/ProductFilterInputs";
import { serverTrpc } from "../_trpc/serverTrpc";

export default async function Home() {
  const categories = (await serverTrpc.category.list()) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero categories={categories} />
      <main className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto">
        <ProductFilterInputs categories={categories} />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
