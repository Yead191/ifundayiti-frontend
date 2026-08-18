"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import {
  SHOP_CATEGORIES,
  SHOP_PRODUCTS,
  type ShopProduct,
} from "@/data/shop";

export interface ShopFilters {
  category: string;
  search: string;
  sort: string;
}

function buildHref(filters: ShopFilters) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort && filters.sort !== "featured") params.set("sort", filters.sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function ShopExperience({ filters }: { filters: ShopFilters }) {
  const router = useRouter();

  let products = SHOP_PRODUCTS.filter((p) => {
    const cat = !filters.category || p.category === filters.category;
    const q = filters.search.trim().toLowerCase();
    const search =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return cat && search;
  });

  if (filters.sort === "price-low") products = [...products].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  if (filters.sort === "price-high") products = [...products].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  if (filters.sort === "newest") products = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest">
          Categories
        </p>
        <ul className="mt-3 space-y-1">
          <li>
            <Link
              href={buildHref({ ...filters, category: "" })}
              className={`block rounded-lg px-3 py-2 text-sm ${
                !filters.category ? "bg-sand-soft font-semibold text-forest" : "text-mist hover:bg-sand-soft"
              }`}
            >
              All products
            </Link>
          </li>
          {SHOP_CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={buildHref({ ...filters, category: cat.slug })}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  filters.category === cat.slug
                    ? "bg-sand-soft font-semibold text-forest"
                    : "text-mist hover:bg-sand-soft"
                }`}
              >
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <Input
              className="pl-9"
              defaultValue={filters.search}
              placeholder="Search merch"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(
                    buildHref({
                      ...filters,
                      search: (e.target as HTMLInputElement).value,
                    }),
                  );
                }
              }}
            />
          </div>
          <select
            className="h-12 rounded-xl border border-input bg-white px-3 text-sm"
            value={filters.sort || "featured"}
            onChange={(e) =>
              router.push(buildHref({ ...filters, sort: e.target.value }))
            }
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No products in this category"
              body="No products available in this category. Try another filter or clear search."
              actionLabel="View all"
              actionHref="/shop"
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: ShopProduct }) {
  const price = product.salePrice ?? product.price;
  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-sand-soft">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-forest">
        {product.category.replace("-", " ")}
      </p>
      <h3 className="font-medium text-forest-deep">{product.name}</h3>
      <p className="text-sm text-mist">
        {product.salePrice ? (
          <>
            <span className="font-semibold text-forest">{formatPrice(price)}</span>{" "}
            <span className="line-through">{formatPrice(product.price)}</span>
          </>
        ) : (
          formatPrice(price)
        )}
      </p>
    </Link>
  );
}
