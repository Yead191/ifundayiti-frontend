"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Flame,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import type {
  ApparelProduct,
  ProductVariant,
} from "@/helpers/next-fetch/shopActions";
import { getColorHex } from "../constants";
import { formatPrice } from "@/lib/utils";

interface ProductInfoSectionProps {
  product: ApparelProduct;
  categoryName: string;
  hasDiscount: boolean;
  discountSavings: number;
  distinctColors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  sizesForColor: ProductVariant[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  activeVariant?: ProductVariant;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  maxQty: number;
  inStock: boolean;
  isPreOrder: boolean;
  onAddToCart: (redirectAfterCheckout?: boolean) => void;
  onOpenSizeChart: () => void;
  dict?: any;
}

export function ProductInfoSection({
  product,
  categoryName,
  hasDiscount,
  discountSavings,
  distinctColors,
  selectedColor,
  onSelectColor,
  sizesForColor,
  selectedSize,
  onSelectSize,
  activeVariant,
  quantity,
  onQuantityChange,
  maxQty,
  inStock,
  isPreOrder,
  onAddToCart,
  onOpenSizeChart,
  dict,
}: ProductInfoSectionProps) {
  const t = dict?.ShopPage?.Detail;
  const cardT = dict?.ShopPage?.Card;
  const currentStock = activeVariant?.stock ?? 0;

  return (
    <div className="flex flex-col justify-between">
      <div>
        {/* Category, Gender, Spotlight & Sold Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-forest/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-forest">
            {categoryName}
          </span>
          <span className="rounded-full bg-sand-soft px-3 py-1 text-[11px] font-bold uppercase text-forest-deep border border-hairline/80">
            {product.gender}
          </span>
          {product.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[11px] font-bold text-sand shadow-2xs">
              <Sparkles className="h-3 w-3 text-sand" />
              <span>{cardT?.FeaturedBadge || "Featured"}</span>
            </span>
          )}
          {typeof product.sold === "number" && product.sold > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sand-soft/90 px-3 py-1 text-[11px] font-bold text-forest-deep border border-hairline/80">
              <Flame className="h-3.5 w-3.5 text-terracotta" />
              <span>
                {product.sold} {t?.TotalSold || "units sold"}
              </span>
            </span>
          )}
        </div>

        {/* Product Title */}
        <h1 className="mt-4 font-display text-3xl sm:text-4xl font-semibold leading-tight text-forest-deep">
          {product.name}
        </h1>

        {/* Pricing & Savings */}
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="font-display text-3xl sm:text-4xl font-bold text-forest">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg font-medium text-faint line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
              <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-bold text-terracotta border border-terracotta/20">
                {t?.Save || "Save"} {formatPrice(discountSavings)}
              </span>
            </>
          )}
        </div>

        {/* COLOR SELECTION */}
        {distinctColors.length > 0 && (
          <div className="mt-6 border-t border-hairline pt-6">
            <div className="flex items-center justify-between text-xs font-bold text-forest-deep">
              <span>{t?.Color || "Color:"}</span>
              <span className="font-semibold text-mist capitalize">
                {selectedColor}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {distinctColors.map((c) => {
                const hex = getColorHex(c);
                const isSelected =
                  selectedColor.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onSelectColor(c)}
                    title={c}
                    className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? "ring-2 ring-forest ring-offset-2 scale-110 shadow-sm"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span
                      className="h-full w-full rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: hex }}
                    />
                    {isSelected && (
                      <Check
                        className={`h-4 w-4 absolute ${
                          hex === "#ffffff" ||
                          hex.includes("#e") ||
                          hex.includes("#f")
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

        {/* SIZE SELECTION & SIZE CHART LINK */}
        {sizesForColor.length > 0 && (
          <div className="mt-6 border-t border-hairline pt-6">
            <div className="flex items-center justify-between text-xs font-bold text-forest-deep">
              <div className="flex items-center gap-1.5">
                <span>{t?.Size || "Size:"}</span>
                <span className="font-semibold text-mist uppercase">
                  {selectedSize}
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenSizeChart}
                className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline"
              >
                <Ruler className="h-3.5 w-3.5" />
                <span>{t?.SizeGuide || "Size Guide"}</span>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
              {sizesForColor.map((v) => {
                const isSelected =
                  selectedSize.toLowerCase() === v.size.toLowerCase();
                const out = v.stock === 0 && !v.isPreOrder;
                const isLow = v.stock > 0 && v.stock <= 3;
                return (
                  <button
                    key={v.size}
                    type="button"
                    disabled={out}
                    onClick={() => onSelectSize(v.size)}
                    className={`relative flex flex-col items-center justify-center rounded-2xl py-3 px-2 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-forest text-white shadow-md ring-2 ring-forest/20"
                        : out
                          ? "bg-sand-soft/40 text-faint line-through cursor-not-allowed border border-hairline/40"
                          : "bg-white text-forest-deep hover:bg-sand-soft border border-hairline shadow-2xs"
                    }`}
                  >
                    <span>{v.size}</span>
                    {v.isPreOrder ? (
                      <span className="mt-0.5 text-[9px] font-bold text-terracotta">
                        Pre-order
                      </span>
                    ) : isLow ? (
                      <span className="mt-0.5 text-[9px] font-bold text-amber-700">
                        {v.stock} left
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* REAL-TIME DYNAMIC STOCK AMOUNT CALLOUT BANNER */}
        <div className="mt-6">
          {isPreOrder ? (
            <div className="flex items-center gap-3 rounded-2xl bg-terracotta/10 border border-terracotta/20 p-4 text-xs font-semibold text-terracotta">
              <Clock className="h-4 w-4 shrink-0" />
              <div>
                <p className="font-bold">
                  {t?.PreOrderNotice?.replace(
                    "[date]",
                    activeVariant?.expectedAvailableDate
                      ? new Date(
                          activeVariant.expectedAvailableDate,
                        ).toLocaleDateString()
                      : "Soon",
                  ) || "Pre-Order Available"}
                </p>
                {currentStock > 0 && (
                  <p className="mt-0.5 text-[11px] opacity-85">
                    {currentStock} units currently incoming in this variant
                  </p>
                )}
              </div>
            </div>
          ) : inStock ? (
            currentStock <= 3 ? (
              <div className="flex items-center gap-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs font-bold text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
                <span>
                  {t?.LowStockNotice?.replace(
                    "[count]",
                    String(currentStock),
                  ) ||
                    `Only ${currentStock} units remaining in stock — order soon!`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-2xl bg-forest/10 border border-forest/20 p-3.5 text-xs font-bold text-forest">
                <Check className="h-4 w-4 shrink-0" />
                <span>
                  {t?.StockAvailable?.replace(
                    "[count]",
                    String(currentStock),
                  ) || `${currentStock} units in stock`}{" "}
                  — {t?.InStockNotice || "Ships in 24–48 hours"}
                </span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2.5 rounded-2xl bg-sand-soft border border-hairline p-3.5 text-xs font-bold text-mist">
              <span>
                {t?.SoldOutNotice || "Out of stock in this size & color"}
              </span>
            </div>
          )}
        </div>

        {/* QUANTITY & ACTIONS */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            {/* Quantity bounds counter */}
            <div className="flex items-center rounded-2xl border border-hairline bg-white p-1 shadow-xs">
              <button
                type="button"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="grid h-10 w-10 place-items-center rounded-xl text-mist hover:bg-sand-soft disabled:opacity-30 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-forest-deep">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(Math.min(maxQty, quantity + 1))}
                disabled={quantity >= maxQty}
                className="grid h-10 w-10 place-items-center rounded-xl text-mist hover:bg-sand-soft disabled:opacity-30 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Main Add to Bag / Pre-Order CTA */}
            <button
              type="button"
              onClick={() => onAddToCart(false)}
              disabled={!inStock && !isPreOrder}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-forest py-3.5 px-6 text-sm font-bold text-white shadow-lg transition-all hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                {isPreOrder
                  ? t?.PreOrderBtn || "Pre-Order Now"
                  : t?.AddBtn || "Add to Bag"}
              </span>
            </button>
          </div>

          {/* Instant Checkout CTA */}
          <button
            type="button"
            onClick={() => onAddToCart(true)}
            disabled={!inStock && isPreOrder}
            className="w-full flex items-center justify-center rounded-2xl border-2 border-forest-deep/20 bg-white py-3 px-6 text-sm font-bold text-forest-deep shadow-xs transition-colors hover:bg-sand-soft hover:border-forest disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{t?.BuyNowBtn || "Instant Checkout"}</span>
          </button>
        </div>

        {/* VALUE PROPOSITION GUARANTEE BADGES */}
        <div className="mt-8 space-y-2.5 rounded-3xl border border-hairline/80 bg-white/80 p-4 backdrop-blur-xs">
          <div className="flex items-center gap-3 text-xs font-semibold text-forest-deep">
            <Truck className="h-4 w-4 shrink-0 text-forest" />
            <span>
              {t?.FreeShipping || "Free shipping on orders over $150"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-forest-deep">
            <RotateCcw className="h-4 w-4 shrink-0 text-forest" />
            <span>{t?.ReturnsGuarantee || "30-day exchange"}</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-forest-deep">
            <ShieldCheck className="h-4 w-4 shrink-0 text-forest" />
            <span>
              {t?.EthicalCrafted ||
                "Ethically crafted with 100% organic cotton"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
