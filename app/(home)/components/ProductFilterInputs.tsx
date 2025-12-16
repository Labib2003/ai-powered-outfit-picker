"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/db/schema/category";
import { SearchIcon } from "lucide-react";
import { useCallback } from "react";

const ProductFilterInputs = ({ categories }: { categories: Category[] }) => {
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

  const search = searchParams.get("search") ?? "";
  const selectedCategories = searchParams.getAll("category");
  const priceMin = Number(searchParams.get("priceMin") ?? 0);
  const priceMax = Number(searchParams.get("priceMax") ?? 500);

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
    });
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
            onChange={(e) =>
              updateParams((params) => {
                if (e.target.value) params.set("search", e.target.value);
                else params.delete("search");
              })
            }
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
            value={[priceMin, priceMax]}
            max={500}
            step={10}
            onValueChange={([min, max]) =>
              updateParams((params) => {
                params.set("priceMin", String(min));
                params.set("priceMax", String(max));
              })
            }
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceMin}</span>
            <span>${priceMax}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductFilterInputs;
