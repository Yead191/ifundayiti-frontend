"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";

import type { ApparelProduct } from "@/helpers/next-fetch/shopActions";
import { getColorHex } from "../constants";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { QuickViewModal } from "./QuickViewModal";
import { useCart } from "@/components/cart/cart-context";

interface ProductCardProps {
  product: ApparelProduct;
  lang?: string;
  dict?: any;
}

export function ProductCard({ product, lang = "en", dict }: ProductCardProps) {
  const { addItem } = useCart();
  const [quickViewOpen, setQuickViewOpen] = React.useState(false);
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const cardT = dict?.ShopPage?.Card;
  const detailT = dict?.ShopPage?.Detail;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/images/placeholder.webp"];

  // Secondary hover image if available
  const frontImage = getImageUrl(images[0]) || images[0];
  const hoverImage =
    images.length > 1 ? getImageUrl(images[1]) || images[1] : frontImage;
  const currentImage =
    activeImageIdx > 0
      ? getImageUrl(images[activeImageIdx]) || images[activeImageIdx]
      : isHovered && images.length > 1
      ? hoverImage
      : frontImage;

  // Discount calculation
  const hasDiscount =
    !!product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  // Variants analysis
  const variants = product.variants || [];
  const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);
  const hasPreOrder = variants.some((v) => v.isPreOrder);
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));

  // Stock status text
  let stockBadge = {
    text: cardT?.InStockBadge || "In Stock",
    bg: "bg-forest/10 text-forest border-forest/20",
  };

  if (totalStock === 0 && hasPreOrder) {
    stockBadge = {
      text: cardT?.PreOrderBadge || "Pre-Order",
      bg: "bg-terracotta/10 text-terracotta border-terracotta/20",
    };
  } else if (totalStock === 0 && !hasPreOrder) {
    stockBadge = {
      text: cardT?.SoldOutBadge || "Sold Out",
      bg: "bg-sand-soft text-faint border-hairline",
    };
  } else if (totalStock > 0 && totalStock <= 5) {
    stockBadge = {
      text:
        cardT?.LowStockBadge?.replace("[count]", String(totalStock)) ||
        `Only ${totalStock} left`,
      bg: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    };
  }

  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.name
      : product.category || "Apparel";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If multiple variants or pre-orders exist, opening the Quick View modal is the best UX
    if (variants.length > 1) {
      setQuickViewOpen(true);
      return;
    }

    // Single variant quick add
    const firstVariant = variants[0];
    addItem({
      id: `${product._id}-${firstVariant?.color || "standard"}-${firstVariant?.size || "one-size"}`,
      productId: product._id,
      title: `${product.name}${firstVariant ? ` · ${firstVariant.color} / ${firstVariant.size}` : ""}`,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
      image: frontImage,
      slug: product._id,
      color: firstVariant?.color,
      size: firstVariant?.size,
      isPreOrder: firstVariant?.isPreOrder,
      expectedAvailableDate: firstVariant?.expectedAvailableDate || undefined,
    });
    toast.success(detailT?.AddedSuccess || "Added to your shopping bag");
  };

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-hairline bg-white/90 p-3 sm:p-4 shadow-xs backdrop-blur-xs transition-all duration-500 hover:-translate-y-1 hover:border-forest/30 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* IMAGE CONTAINER WITH ZOOM & SECONDARY HOVER EFFECT */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-sand-soft">
          <Link href={`/${lang}/shop/${product._id}`} className="block h-full w-full">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>

          {/* BADGES: Sale / Featured / Gender */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
            {hasDiscount && (
              <span className="inline-flex items-center rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                −{discountPercent}% {cardT?.SaleBadge || "OFF"}
              </span>
            )}
            {product.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-forest/20 bg-forest px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sand shadow-xs">
                <Sparkles className="h-3 w-3 text-sand" />
                <span>{cardT?.FeaturedBadge || "Featured"}</span>
              </span>
            )}
          </div>

          {/* STOCK BADGE */}
          <div className="absolute right-3 top-3 pointer-events-none">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md ${stockBadge.bg}`}
            >
              {stockBadge.text}
            </span>
          </div>

          {/* HOVER QUICK ACTION BAR */}
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/95 px-3 py-2.5 text-xs font-semibold text-forest-deep shadow-md backdrop-blur-md transition-colors hover:bg-forest hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{cardT?.QuickView || "Quick View"}</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label="Add to bag"
              className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-white shadow-md transition-colors hover:bg-forest/90"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CONTENT & METRICS */}
        <div className="mt-4 flex flex-1 flex-col justify-between">
          <div>
            {/* Category & Gender Pill */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-mist uppercase tracking-widest">
              <span>{categoryName}</span>
              <span className="text-forest/80 font-bold">{product.gender}</span>
            </div>

            {/* Garment Title */}
            <h3 className="mt-1 font-display text-base sm:text-lg font-semibold text-forest-deep transition-colors group-hover:text-forest line-clamp-1">
              <Link href={`/${lang}/shop/${product._id}`}>{product.name}</Link>
            </h3>

            {/* COLOR SWATCHES PREVIEW */}
            {colors.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5">
                {colors.slice(0, 5).map((c) => {
                  const hex = getColorHex(c);
                  return (
                    <span
                      key={c}
                      title={c}
                      className="h-3.5 w-3.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: hex }}
                    />
                  );
                })}
                {colors.length > 5 && (
                  <span className="text-[10px] font-medium text-mist">
                    +{colors.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* SIZE PILLS PREVIEW */}
            {sizes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {sizes.slice(0, 6).map((sz) => (
                  <span
                    key={sz}
                    className="rounded-md border border-hairline/80 bg-sand-soft/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-forest-deep"
                  >
                    {sz}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* PRICE & ACTION */}
          <div className="mt-4 flex items-baseline justify-between border-t border-hairline pt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-bold text-forest">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs font-medium text-faint line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {product.sold && product.sold > 0 ? (
              <span className="text-[11px] font-medium text-mist">
                {product.sold} sold
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        lang={lang}
        dict={dict}
      />
    </>
  );
}
