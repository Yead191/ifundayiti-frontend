"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Flame, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";

import type { ApparelProduct } from "@/helpers/next-fetch/shopActions";
import { getColorHex } from "../constants";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { QuickViewModal } from "./QuickViewModal";
import { addToCart } from "@/helpers/next-fetch/cartActions";
import getProfile from "@/helpers/next-fetch/getProfile";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";

interface ProductCardProps {
  product: ApparelProduct;
  lang?: string;
  dict?: any;
}

export function ProductCard({ product, lang = "en", dict }: ProductCardProps) {
  const router = useRouter();
  const [quickViewOpen, setQuickViewOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const cardT = dict?.ShopPage?.Card;
  const detailT = dict?.ShopPage?.Detail;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/images/placeholder.webp"];

  const frontImage = getImageUrl(images[0]) || images[0];
  const hoverImage =
    images.length > 1 ? getImageUrl(images[1]) || images[1] : frontImage;
  const currentImage = isHovered && images.length > 1 ? hoverImage : frontImage;

  // Discount calculation
  const hasDiscount =
    !!product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100,
      )
    : 0;

  // Variants analysis
  const variants = product.variants || [];
  const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);
  const hasPreOrder = variants.some((v) => v.isPreOrder);
  const colors = Array.from(
    new Set(variants.map((v) => v.color).filter(Boolean)),
  );
  const sizes = Array.from(
    new Set(variants.map((v) => v.size).filter(Boolean)),
  );

  // Stock status text
  let stockBadge = {
    text: cardT?.InStockBadge || "In Stock",
    bg: "bg-forest/10 text-forest border-forest/20",
  };

  if (totalStock === 0 && hasPreOrder) {
    stockBadge = {
      text: cardT?.PreOrderBadge || "Pre-Order",
      bg: "bg-amber-600/10 text-amber-700 border-amber-600/20",
    };
  } else if (totalStock === 0 && !hasPreOrder) {
    stockBadge = {
      text: cardT?.SoldOutBadge || "Sold Out",
      bg: "bg-sand-soft text-faint border-hairline",
    };
  } else if (totalStock > 0 && totalStock <= 3) {
    stockBadge = {
      text:
        cardT?.LowStockBadge?.replace("[count]", String(totalStock)) ||
        `Only ${totalStock} left`,
      bg: "bg-red-500/10 text-red-700 border-red-500/20",
    };
  }

  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.name
      : product.category || "Product";

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (variants.length > 1) {
      setQuickViewOpen(true);
      return;
    }

    const user = await getProfile();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const firstVariant = variants[0];
    try {
      const res = await addToCart({
        product: product._id,
        size: firstVariant?.size || "Standard",
        color: firstVariant?.color || "Standard",
        quantity: 1,
      });
      if (res.success) {
        toast.success(detailT?.AddedSuccess || "Added to your shopping bag");
        router.refresh();
      } else {
        toast.error(res.message || "Could not add product to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Network error while adding to cart");
    }
  };

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-hairline bg-white p-2.5 sm:p-4 shadow-2xs transition-all duration-500 hover:-translate-y-1 hover:border-forest/30 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* GARMENT IMAGE */}
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-sand-soft">
          <Link
            href={`/${lang}/shop/${product._id}`}
            className="block h-full w-full"
          >
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>

          {/* HIGH-CONTRAST DISCOUNT BADGE */}
          {hasDiscount && (
            <div className="absolute left-2.5 top-2.5 z-10">
              <span className="inline-flex items-center rounded-full bg-[#b91c1c] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-md border border-white/20">
                −{discountPercent}% {cardT?.SaleBadge || "OFF"}
              </span>
            </div>
          )}

          {/* FEATURED BADGE */}
          {product.featured && !hasDiscount && (
            <div className="absolute left-2.5 top-2.5 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border border-forest/30 bg-forest px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sand shadow-sm">
                <Sparkles className="h-3 w-3 text-sand" />
                <span>{cardT?.FeaturedBadge || "Featured"}</span>
              </span>
            </div>
          )}

          {/* STOCK BADGE */}
          <div className="absolute right-2.5 top-2.5 z-10">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] sm:text-[10px] font-bold backdrop-blur-md ${stockBadge.bg}`}
            >
              {stockBadge.text}
            </span>
          </div>

          {/* HOVER QUICK ACTION BAR (Desktop) */}
          <div className="hidden sm:flex absolute inset-x-3 bottom-3 items-center gap-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-bold text-forest-deep shadow-md backdrop-blur-md transition-colors hover:bg-forest hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{cardT?.QuickView || "Quick View"}</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label="Add to bag"
              className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white shadow-md transition-colors hover:bg-forest/90"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* METRICS & DETAILS */}
        <div className="mt-3 flex flex-1 flex-col justify-between">
          <div>
            {/* Category & Gender */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-mist">
              <span className="truncate pr-1">{categoryName}</span>
              <span className="shrink-0 text-forest/80">{product.gender}</span>
            </div>

            {/* Product Title */}
            <h3 className="mt-1 font-display text-sm sm:text-base font-semibold text-forest-deep leading-snug transition-colors group-hover:text-forest line-clamp-1">
              <Link href={`/${lang}/shop/${product._id}`}>{product.name}</Link>
            </h3>

            {/* COLOR SWATCHES */}
            {colors.length > 0 && (
              <div className="mt-2 flex items-center gap-1">
                {colors.slice(0, 4).map((c) => {
                  const hex = getColorHex(c);
                  return (
                    <span
                      key={c}
                      title={c}
                      className="h-3 w-3 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: hex }}
                    />
                  );
                })}
                {colors.length > 4 && (
                  <span className="text-[9px] font-semibold text-mist">
                    +{colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* PRICE & SOLD COUNT */}
          <div className="mt-3 pt-2 border-t border-hairline/70 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-display text-base sm:text-lg font-bold text-forest">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs font-medium text-faint line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Total Sold Indicator */}
            {typeof product.sold === "number" && product.sold > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-mist bg-sand-soft/80 px-2 py-0.5 rounded-full">
                <Flame className="h-3 w-3 text-terracotta" />
                <span>
                  {product.sold} {cardT?.UnitsSold || "sold"}
                </span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        lang={lang}
        dict={dict}
      />

      <AuthRequiredModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionTitle="add items to your shopping bag"
        lang={lang}
        dict={dict}
      />
    </>
  );
}
