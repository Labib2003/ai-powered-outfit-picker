"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback } from "react";
import { trpc } from "@/app/_trpc/client";
import { HandlePagination } from "@/components/custom/HandlePagination";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 9);

  const search = searchParams.get("search") ?? undefined;
  const filterCategories = searchParams.getAll("category");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const sort = searchParams.get("sort") ?? "newest";

  const { data: paginatedProducts, isLoading } = trpc.product.list.useQuery({
    page,
    limit,
    search,
    category: filterCategories.length ? filterCategories : undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    sort: sort as any,
  });

  const updateParams = useCallback(
    (mutator: (params: URLSearchParams) => void, resetPage?: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (resetPage) params.set("page", "1");
      mutator(params);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex-1">
      <div className="flex justify-end mb-6">
        {/* Sort order */}
        <Select
          value={sort}
          onValueChange={(value) =>
            updateParams((params) => {
              if (value === "newest") params.delete("sort");
              else params.set("sort", value);
            }, true)
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
        {isLoading ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : (
          paginatedProducts?.data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {paginatedProducts && (
        <div className="mt-10 flex justify-center">
          <HandlePagination
            page={paginatedProducts.pagination.page}
            totalPages={paginatedProducts.pagination.totalPages}
          />
        </div>
      )}
    </div>
  );
}
