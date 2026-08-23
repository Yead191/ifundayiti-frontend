"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Check, ChevronDown, Search, Star } from "lucide-react";

import { cn, formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SHOP_CATEGORIES,
  SHOP_PRODUCTS,
  getCategoryLabel,
  type ShopProduct,
} from "@/data/shop";

export interface ShopFilters {
  category: string;
  search: string;
  sort: string;
}

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

function buildHref(filters: ShopFilters) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort && filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function unitPrice(p: ShopProduct) {
  return p.salePrice ?? p.price;
}

export function ShopExperience({ filters }: { filters: ShopFilters }) {
  const router = useRouter();

  let products = SHOP_PRODUCTS.filter((p) => {
    const catOk = !filters.category || p.category === filters.category;
    const q = filters.search.trim().toLowerCase();
    const searchOk =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return catOk && searchOk;
  });

  if (filters.sort === "price-low") {
    products = [...products].sort((a, b) => unitPrice(a) - unitPrice(b));
  } else if (filters.sort === "price-high") {
    products = [...products].sort((a, b) => unitPrice(b) - unitPrice(a));
  } else if (filters.sort === "newest") {
    products = [...products].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  } else {
    products = [...products].sort(
      (a, b) => Number(b.featured) - Number(a.featured),
    );
  }

  const currentSortOption =
    SORT_OPTIONS.find((o) => o.value === (filters.sort || "featured")) ||
    SORT_OPTIONS[0];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
      <aside className="lg:col-span-3">
        <div className="sticky top-28 space-y-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
              Categories
            </p>
            <ul className="mt-4 space-y-1">
              <li>
                <Link
                  href={buildHref({ ...filters, category: "" })}
                  scroll={false}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors",
                    !filters.category
                      ? "bg-forest font-semibold text-white"
                      : "text-mist hover:bg-sand-soft hover:text-forest-deep",
                  )}
                >
                  All products
                  <span className="text-xs opacity-70">
                    {SHOP_PRODUCTS.length}
                  </span>
                </Link>
              </li>
              {SHOP_CATEGORIES.map((cat) => {
                const count = SHOP_PRODUCTS.filter(
                  (p) => p.category === cat.slug,
                ).length;
                return (
                  <li key={cat.slug}>
                    <Link
                      href={buildHref({ ...filters, category: cat.slug })}
                      scroll={false}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors",
                        filters.category === cat.slug
                          ? "bg-forest font-semibold text-white"
                          : "text-mist hover:bg-sand-soft hover:text-forest-deep",
                      )}
                    >
                      {cat.label}
                      <span className="text-xs opacity-70">{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden rounded-2xl border border-hairline bg-sand-soft/50 p-5 lg:block">
            <p className="font-display text-lg font-semibold text-forest-deep">
              Mission merch
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              Every piece is designed in the IFundAyiti palette — purchases help
              keep the Program Fund moving.
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <Input
              className="h-12 rounded-xl border-hairline bg-white pl-10"
              defaultValue={filters.search}
              placeholder="Search the collection"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(
                    buildHref({
                      ...filters,
                      search: (e.target as HTMLInputElement).value,
                    }),
                    { scroll: false },
                  );
                }
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-mist sm:block">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-xl border border-hairline bg-white px-4 text-sm font-medium text-forest-deep shadow-xs transition-all hover:border-forest/30 hover:bg-sand-soft/50 focus:outline-none focus:ring-2 focus:ring-forest/15 data-[state=open]:border-forest/40 data-[state=open]:bg-sand-soft/60"
                  aria-label="Sort products"
                >
                  <ArrowUpDown className="h-4 w-4 text-mist transition-colors group-hover:text-forest" />
                  <span className="hidden text-mist font-normal sm:inline">
                    Sort:
                  </span>
                  <span className="font-semibold text-forest-deep">
                    {currentSortOption.label}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 text-mist transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-2xl border border-hairline bg-white/95 p-1.5 shadow-xl backdrop-blur-xl"
              >
                {SORT_OPTIONS.map((option) => {
                  const isSelected =
                    (filters.sort || "featured") === option.value;
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        router.push(
                          buildHref({ ...filters, sort: option.value }),
                          { scroll: false },
                        )
                      }
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                        isSelected
                          ? "bg-sand-soft text-forest font-semibold"
                          : "text-forest-deep hover:bg-sand-soft/60 hover:text-forest",
                      )}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-forest" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="mt-16 rounded-[1.5rem] border border-dashed border-hairline bg-sand-soft/30 px-8 py-16 text-center">
            <p className="font-display text-2xl text-forest-deep">
              No pieces match
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
              Try another category or clear your search to browse the full
              collection.
            </p>
            <Link
              href="/shop"
              scroll={false}
              className="mt-6 inline-flex text-sm font-semibold text-forest hover:underline"
            >
              View all products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12">
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
  const price = unitPrice(product);
  const onSale = typeof product.salePrice === "number";

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-sand-soft">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 50vw, 28vw"
        />
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-forest px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sand">
            Sale
          </span>
        )}
        {product.featured && !onSale && (
          <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest backdrop-blur-sm">
            Featured
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-forest/90 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-sand opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View details
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-forest/70">
          {getCategoryLabel(product.category)}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-forest-deep transition-colors group-hover:text-forest">
          {product.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-sm">
            {onSale ? (
              <>
                <span className="font-semibold text-forest">
                  {formatPrice(price)}
                </span>{" "}
                <span className="text-faint line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-forest-deep">
                {formatPrice(price)}
              </span>
            )}
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-mist">
            <Star className="h-3 w-3 fill-current text-forest/50" />
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
