"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/db/schema/category";
import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

const ProductFilterInputs = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [price, setPrice] = useState<[number, number]>([
    Number(searchParams.get("priceMin") ?? 0),
    Number(searchParams.get("priceMax") ?? 500),
  ]);
  const debouncedSearch = useDebounce(search, 300);
  const debouncedPrice = useDebounce(price, 300);

  const updateParams = useCallback(
    (mutator: (params: URLSearchParams) => void, resetPage?: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (resetPage) params.set("page", "1");
      mutator(params);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    updateParams((params) => {
      if (debouncedSearch) params.set("search", debouncedSearch);
      else params.delete("search");

      params.set("priceMin", String(debouncedPrice[0]));
      params.set("priceMax", String(debouncedPrice[1]));
    }, true);
  }, [debouncedSearch, debouncedPrice]);

  const selectedCategories = searchParams.getAll("category");

  const toggleCategory = (id: string) => {
    updateParams((params) => {
      const existing = params.getAll("category");

      params.delete("category");
      existing
        .filter((c) => c !== id)
        .forEach((c) => params.append("category", c));

      if (!existing.includes(id)) {
        params.append("category", id);
      }
    }, true);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="space-y-6 sticky top-24">
        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <label htmlFor={category.id} className="text-sm cursor-pointer">
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Price Range</h3>
          <Slider
            value={price}
            max={500}
            step={10}
            onValueChange={([min, max]) => setPrice([min, max])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${price[0]}</span>
            <span>${price[1]}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductFilterInputs;
