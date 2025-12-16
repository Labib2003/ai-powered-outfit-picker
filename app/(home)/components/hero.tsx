"use client";

import assets from "@/app/assets";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const categories = [
  { name: "Dresses", image: "/elegant-dress.png" },
  { name: "Blazers", image: "/premium-blazer.jpg" },
  { name: "Accessories", image: "/luxury-accessories.png" },
  { name: "Shoes", image: "/designer-shoes.jpg" },
  { name: "Bags", image: "/luxury-handbag.png" },
];

export default function Hero() {
  return (
    <section className="pb-12">
      {/* Hero Banner */}
      <div className="relative h-[80vh] bg-linear-to-br from-secondary via-background to-secondary overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={assets.images.heroBanner}
            alt="Hero Banner"
            className="h-full object-cover object-left"
            priority
          />
        </div>

        <div className="relative h-full flex flex-col items-start justify-center px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
          {/* Main heading with display font */}
          <h1 className="pt-16 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground text-balance leading-tight">
            Curated Style
          </h1>

          {/* Subtitle with regular font */}
          <p className="font-sans text-base sm:text-lg md:text-xl text-accent-foreground mb-4 max-w-2xl text-balance leading-relaxed">
            Discover premium fashion pieces
            <br />
            handpicked for your unique aesthetic
          </p>

          <div className="flex flex-col items-start gap-2">
            <button className="relative group">
              <div className="relative px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition text-sm sm:text-base">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                Consult a Stylist
              </div>
            </button>
            <p className="text-xs sm:text-sm ml-2 font-mono text-accent-foreground">
              Not sure what to get?
            </p>
          </div>
        </div>
      </div>

      {/* Category Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Shop by Category
        </h2>
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-secondary h-48 mb-3">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <h3 className="font-sans text-lg font-semibold text-foreground group-hover:text-primary transition">
                    {category.name}
                  </h3>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
