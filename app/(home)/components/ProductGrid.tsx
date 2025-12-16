"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/db/schema/product";
import { useCallback } from "react";

export default function ProductGrid({ products }: { products?: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (mutator: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutator(params);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );
  const sort = searchParams.get("sort") ?? "newest";

  return (
    <div className="flex-1">
      <div className="flex justify-end mb-6">
        {/* Sort order */}
        <Select
          value={sort}
          onValueChange={(value) =>
            updateParams((params) => {
              if (value === "newest") {
                params.delete("sort");
              } else {
                params.set("sort", value);
              }
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition group"
          >
            <div className="relative overflow-hidden bg-muted h-64">
              <img
                src={product.imageUrl || undefined}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
            </div>

            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  ${product.price}
                </span>
                <Button
                  size="sm"
                  className="bg-linear-to-r from-primary to-accent hover:opacity-90"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
