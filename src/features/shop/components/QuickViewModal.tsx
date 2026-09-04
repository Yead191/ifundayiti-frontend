"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";

import type { ApparelProduct, ProductVariant } from "@/helpers/next-fetch/shopActions";
import { getColorHex } from "../constants";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { useCart } from "@/components/cart/cart-context";

interface QuickViewModalProps {
  product: ApparelProduct | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
  dict?: any;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  lang = "en",
  dict,
}: QuickViewModalProps) {
  const { addItem } = useCart();
  const t = dict?.ShopPage?.Detail;
  const cardT = dict?.ShopPage?.Card;

  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState("");
  const [selectedSize, setSelectedSize] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);

  // Extract distinct colors from variants
  const colors = React.useMemo(() => {
    if (!product?.variants) return [];
    const set = new Set<string>();
    product.variants.forEach((v) => {
      if (v.color) set.add(v.color);
    });
    return Array.from(set);
  }, [product]);

  // Extract sizes available for currently selected color
  const sizesForColor = React.useMemo(() => {
    if (!product?.variants) return [];
    const filtered = selectedColor
      ? product.variants.filter((v) => v.color.toLowerCase() === selectedColor.toLowerCase())
      : product.variants;
    return filtered;
  }, [product, selectedColor]);

  // Sync state when product opens
  React.useEffect(() => {
    if (product && product.variants?.length) {
      setActiveImageIdx(0);
      setQuantity(1);
      const firstColor = product.variants[0]?.color || "";
      setSelectedColor(firstColor);
      const sizesForFirst = product.variants.filter(
        (v) => v.color.toLowerCase() === firstColor.toLowerCase()
      );
      setSelectedSize(sizesForFirst[0]?.size || "");
    }
  }, [product]);

  // When color changes, ensure selected size is valid for that color
  const handleColorChange = (c: string) => {
    setSelectedColor(c);
    if (!product?.variants) return;
    const available = product.variants.filter(
      (v) => v.color.toLowerCase() === c.toLowerCase()
    );
    if (available.length > 0) {
      const match = available.find((v) => v.size === selectedSize);
      if (!match) {
        setSelectedSize(available[0]?.size || "");
      }
    }
  };

  // Selected variant resolution
  const activeVariant: ProductVariant | undefined = React.useMemo(() => {
    if (!product?.variants) return undefined;
    return product.variants.find(
      (v) =>
        v.color.toLowerCase() === selectedColor.toLowerCase() &&
        v.size.toLowerCase() === selectedSize.toLowerCase()
    );
  }, [product, selectedColor, selectedSize]);

  const isPreOrder = activeVariant?.isPreOrder ?? false;
  const inStock = (activeVariant?.stock ?? 0) > 0;
  const maxQty = isPreOrder ? 10 : Math.max(1, activeVariant?.stock ?? 1);

  const images = product?.images && product.images.length > 0 ? product.images : ["/images/placeholder.webp"];
  const activeImage = getImageUrl(images[activeImageIdx]) || images[0];

  const hasDiscount = !!product?.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product!.compareAtPrice! - product!.price) / product!.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
    if (!inStock && !isPreOrder) {
      toast.error(t?.SoldOutNotice || "Out of stock in this size & color");
      return;
    }

    const lineId = `${product._id}-${selectedColor}-${selectedSize}`;
    addItem({
      id: lineId,
      productId: product._id,
      title: `${product.name} · ${selectedColor} / ${selectedSize}`,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity,
      image: activeImage,
      slug: product._id,
      color: selectedColor,
      size: selectedSize,
      isPreOrder,
      expectedAvailableDate: activeVariant?.expectedAvailableDate || undefined,
    });

    toast.success(t?.AddedSuccess || "Added to your shopping bag");
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-forest-deep/60 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-hairline bg-white shadow-2xl transition-all animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-sand-soft/80 text-mist transition-colors hover:bg-sand hover:text-forest-deep"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery preview */}
          <div className="flex flex-col bg-sand-soft/30 p-5 sm:p-6">
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-sand-soft shadow-inner">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {hasDiscount && (
                <div className="absolute left-3 top-3 z-10">
                  <span className="inline-flex items-center rounded-full bg-[#b91c1c] px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md border border-white/20">
                    −{discountPercent}% {cardT?.SaleBadge || "OFF"}
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => {
                  const resolved = getImageUrl(img) || img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        activeImageIdx === idx
                          ? "border-forest shadow-xs ring-2 ring-forest/20"
                          : "border-hairline opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={resolved}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Info & Variant selector */}
          <div className="flex flex-col p-6 sm:p-8 justify-between">
            <div>
              {/* Category, Gender & Sold */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-forest">
                  {typeof product.category === "object" ? product.category.name : product.category}
                </span>
                <span className="text-[10px] text-faint">·</span>
                <span className="rounded-full bg-sand-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-forest-deep border border-hairline/60">
                  {product.gender}
                </span>
                {typeof product.sold === "number" && product.sold > 0 && (
                  <span className="text-[10px] font-bold text-forest-deep bg-sand-soft/80 px-2 py-0.5 rounded-full">
                    🔥 {product.sold} {t?.TotalSold || "sold"}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-forest-deep leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-2xl font-bold text-forest">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-medium text-faint line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
              </div>

              {/* Color Swatches */}
              {colors.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-forest-deep">
                    <span>{t?.Color || "Color:"}</span>
                    <span className="font-normal text-mist capitalize">{selectedColor}</span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-2.5">
                    {colors.map((c) => {
                      const hex = getColorHex(c);
                      const isSelected = selectedColor.toLowerCase() === c.toLowerCase();
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleColorChange(c)}
                          title={c}
                          className={`group relative flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                            isSelected
                              ? "ring-2 ring-forest ring-offset-2 scale-110"
                              : "hover:scale-105 opacity-85 hover:opacity-100"
                          }`}
                        >
                          <span
                            className="h-full w-full rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: hex }}
                          />
                          {isSelected && (
                            <Check
                              className={`h-3.5 w-3.5 absolute ${
                                hex === "#ffffff" || hex.includes("#e") || hex.includes("#f")
                                  ? "text-forest-deep"
                                  : "text-white"
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {sizesForColor.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-forest-deep">
                    <span>{t?.Size || "Size:"}</span>
                    <span className="font-normal text-mist uppercase">{selectedSize}</span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {sizesForColor.map((v) => {
                      const isSelected = selectedSize.toLowerCase() === v.size.toLowerCase();
                      const out = v.stock === 0 && !v.isPreOrder;
                      return (
                        <button
                          key={v.size}
                          type="button"
                          disabled={out}
                          onClick={() => setSelectedSize(v.size)}
                          className={`relative min-w-10 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-forest text-white shadow-xs"
                              : out
                              ? "bg-sand-soft/50 text-faint line-through cursor-not-allowed border border-hairline/40"
                              : "bg-sand-soft/80 text-forest-deep hover:bg-sand border border-hairline"
                          }`}
                        >
                          {v.size}
                          {v.isPreOrder && (
                            <span className="ml-1 text-[9px] text-terracotta">●</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock / Pre-Order Notice with Exact Stock Count */}
              <div className="mt-4">
                {isPreOrder ? (
                  <div className="flex items-center gap-2 rounded-xl bg-terracotta/10 border border-terracotta/20 px-3 py-2 text-xs font-semibold text-terracotta">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {t?.PreOrderNotice?.replace(
                        "[date]",
                        activeVariant?.expectedAvailableDate
                          ? new Date(activeVariant.expectedAvailableDate).toLocaleDateString()
                          : "Soon"
                      ) || "Pre-Order Available"}
                    </span>
                  </div>
                ) : inStock ? (
                  (activeVariant?.stock ?? 0) <= 3 ? (
                    <p className="text-xs font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
                      {t?.LowStockNotice?.replace("[count]", String(activeVariant?.stock ?? 0)) ||
                        `Only ${activeVariant?.stock} left in stock!`}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-forest bg-forest/10 border border-forest/20 px-3 py-2 rounded-xl">
                      {t?.StockAvailable?.replace("[count]", String(activeVariant?.stock ?? 0)) ||
                        `${activeVariant?.stock} units in stock`} — {t?.InStockNotice || "Ships in 24–48 hours"}
                    </p>
                  )
                ) : (
                  <p className="text-xs font-medium text-faint bg-sand-soft px-3 py-2 rounded-xl">
                    {t?.SoldOutNotice || "Out of stock"}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-hairline">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-xl border border-hairline bg-sand-soft/50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="grid h-8 w-8 place-items-center rounded-lg text-mist hover:bg-sand disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-forest-deep">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    className="grid h-8 w-8 place-items-center rounded-lg text-mist hover:bg-sand disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock && !isPreOrder}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    {isPreOrder
                      ? t?.PreOrderBtn || "Pre-Order Now"
                      : t?.AddBtn || "Add to Bag"}
                  </span>
                </button>
              </div>

              {/* View Full Product Details Link */}
              <div className="mt-3 text-center">
                <Link
                  href={`/${lang}/shop/${product._id}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-forest hover:underline"
                >
                  {cardT?.ViewDetails || "View Full Garment Details"} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
