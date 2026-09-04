"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";

import type { ApparelProduct, ProductVariant } from "@/helpers/next-fetch/shopActions";
import { getColorHex } from "../constants";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { SizeChartModal } from "./SizeChartModal";
import { ProductCard } from "./ProductCard";
import { useCart } from "@/components/cart/cart-context";
import { Container } from "@/components/shared/container";

interface ProductDetailViewProps {
  product: ApparelProduct;
  relatedProducts?: ApparelProduct[];
  lang?: string;
  dict?: any;
}

export function ProductDetailView({
  product,
  relatedProducts = [],
  lang = "en",
  dict,
}: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const t = dict?.ShopPage?.Detail;
  const cardT = dict?.ShopPage?.Card;

  // Active Gallery Image
  const [activeImgIdx, setActiveImgIdx] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [sizeModalOpen, setSizeModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"specs" | "impact" | "fit">("specs");

  // Selection states
  const variants = product.variants || [];
  const initialColor = variants[0]?.color || "";
  const [selectedColor, setSelectedColor] = React.useState(initialColor);

  const sizesForColor = React.useMemo(() => {
    if (!variants.length) return [];
    return selectedColor
      ? variants.filter((v) => v.color.toLowerCase() === selectedColor.toLowerCase())
      : variants;
  }, [variants, selectedColor]);

  const [selectedSize, setSelectedSize] = React.useState(
    sizesForColor[0]?.size || ""
  );
  const [quantity, setQuantity] = React.useState(1);

  // When color changes, verify selected size
  const handleColorSelect = (c: string) => {
    setSelectedColor(c);
    const available = variants.filter(
      (v) => v.color.toLowerCase() === c.toLowerCase()
    );
    if (available.length > 0) {
      const match = available.find((v) => v.size === selectedSize);
      if (!match) {
        setSelectedSize(available[0]?.size || "");
      }
    }
  };

  // Resolve current active variant
  const activeVariant: ProductVariant | undefined = React.useMemo(() => {
    return variants.find(
      (v) =>
        v.color.toLowerCase() === selectedColor.toLowerCase() &&
        v.size.toLowerCase() === selectedSize.toLowerCase()
    );
  }, [variants, selectedColor, selectedSize]);

  const isPreOrder = activeVariant?.isPreOrder ?? false;
  const inStock = (activeVariant?.stock ?? 0) > 0;
  const currentStock = activeVariant?.stock ?? 0;
  const maxQty = isPreOrder ? 10 : Math.max(1, currentStock);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/images/placeholder.webp"];
  const activeImage = getImageUrl(images[activeImgIdx]) || images[0];

  // Distinct colors
  const distinctColors = React.useMemo(() => {
    return Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));
  }, [variants]);

  // Pricing & Discounts
  const hasDiscount =
    !!product.compareAtPrice && product.compareAtPrice > product.price;
  const discountSavings = hasDiscount ? product.compareAtPrice! - product.price : 0;
  const discountPercent = hasDiscount
    ? Math.round((discountSavings / product.compareAtPrice!) * 100)
    : 0;

  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.name
      : product.category || "Apparel";

  // Lightbox keyboard controls
  const prevImage = React.useCallback(() => {
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = React.useCallback(() => {
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  }, [images.length]);

  React.useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, prevImage, nextImage]);

  // Cart Handlers
  const handleAddToCart = (redirectAfter = false) => {
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

    if (redirectAfter) {
      router.push(`/${lang}/checkout`);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-cream pt-28 pb-24 md:pt-32 md:pb-32">
        <Container>
          {/* BREADCRUMBS */}
          <nav className="mb-8 flex items-center gap-2 text-xs font-medium text-mist">
            <Link
              href={`/${lang}`}
              className="transition-colors hover:text-forest-deep"
            >
              {t?.Home || "Home"}
            </Link>
            <span className="text-faint">/</span>
            <Link
              href={`/${lang}/shop`}
              className="transition-colors hover:text-forest-deep"
            >
              {t?.Shop || "Shop"}
            </Link>
            <span className="text-faint">/</span>
            <span className="capitalize">{categoryName}</span>
            <span className="text-faint">/</span>
            <span className="text-forest-deep font-semibold truncate max-w-xs">
              {product.name}
            </span>
          </nav>

          {/* MAIN 2-COLUMN VIEW */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            {/* LEFT COLUMN: Image Gallery & Lightbox Trigger */}
            <div className="lg:col-span-7">
              <div className="flex flex-col-reverse gap-4 sm:flex-row">
                {/* Thumbnails strip */}
                {images.length > 1 && (
                  <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[560px] scrollbar-none py-1">
                    {images.map((img, idx) => {
                      const resolved = getImageUrl(img) || img;
                      const isSelected = activeImgIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImgIdx(idx)}
                          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                            isSelected
                              ? "border-forest shadow-md ring-2 ring-forest/20 scale-105"
                              : "border-hairline/80 opacity-70 hover:opacity-100 hover:border-forest/40"
                          }`}
                        >
                          <Image
                            src={resolved}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Hero Viewport */}
                <div className="relative aspect-3/4 flex-1 overflow-hidden rounded-3xl border border-hairline bg-sand-soft shadow-md group">
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />

                  {/* Zoom Hint Trigger */}
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    aria-label="Zoom image"
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-2xl bg-white/90 text-forest-deep shadow-md backdrop-blur-md transition-colors hover:bg-forest hover:text-white"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>

                  {/* Sale Pill */}
                  {hasDiscount && (
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center rounded-full bg-terracotta px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                        −{discountPercent}% {cardT?.SaleBadge || "OFF"}
                      </span>
                    </div>
                  )}

                  {/* Nav Chevrons */}
                  {images.length > 1 && (
                    <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                      <button
                        type="button"
                        onClick={prevImage}
                        aria-label="Previous"
                        className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/80 text-forest-deep shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        aria-label="Next"
                        className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/80 text-forest-deep shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Garment Selection, Pricing & Buy CTAs */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Category, Gender & Spotlight */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-forest/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-forest">
                    {categoryName}
                  </span>
                  <span className="rounded-full bg-sand-soft px-3 py-1 text-[11px] font-semibold uppercase text-forest-deep border border-hairline/80">
                    {product.gender}
                  </span>
                  {product.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[11px] font-semibold text-sand">
                      <Sparkles className="h-3 w-3" />
                      <span>{cardT?.FeaturedBadge || "Featured"}</span>
                    </span>
                  )}
                </div>

                {/* Garment Title */}
                <h1 className="mt-4 font-display text-3xl sm:text-4xl font-semibold leading-tight text-forest-deep">
                  {product.name}
                </h1>

                {/* Pricing & Savings */}
                <div className="mt-4 flex flex-wrap items-baseline gap-3">
                  <span className="font-display text-3xl font-bold text-forest">
                    {formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg font-medium text-faint line-through">
                        {formatPrice(product.compareAtPrice!)}
                      </span>
                      <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 text-xs font-bold text-terracotta">
                        {t?.Save || "Save"} {formatPrice(discountSavings)}
                      </span>
                    </>
                  )}
                </div>

                {/* COLOR SELECTION */}
                {distinctColors.length > 0 && (
                  <div className="mt-6 border-t border-hairline pt-6">
                    <div className="flex items-center justify-between text-xs font-semibold text-forest-deep">
                      <span>{t?.Color || "Color:"}</span>
                      <span className="font-normal text-mist capitalize">
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
                            onClick={() => handleColorSelect(c)}
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
                    <div className="flex items-center justify-between text-xs font-semibold text-forest-deep">
                      <div className="flex items-center gap-1.5">
                        <span>{t?.Size || "Size:"}</span>
                        <span className="font-normal text-mist uppercase">
                          {selectedSize}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSizeModalOpen(true)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
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
                            onClick={() => setSelectedSize(v.size)}
                            className={`relative flex flex-col items-center justify-center rounded-2xl py-3 px-2 text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-forest text-white shadow-md ring-2 ring-forest/20"
                                : out
                                ? "bg-sand-soft/40 text-faint line-through cursor-not-allowed border border-hairline/40"
                                : "bg-white text-forest-deep hover:bg-sand-soft border border-hairline"
                            }`}
                          >
                            <span>{v.size}</span>
                            {v.isPreOrder ? (
                              <span className="mt-0.5 text-[9px] font-semibold text-terracotta">
                                Pre-order
                              </span>
                            ) : isLow ? (
                              <span className="mt-0.5 text-[9px] font-semibold text-amber-700">
                                {v.stock} left
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* REAL-TIME DYNAMIC STOCK CALLOUT BANNER */}
                <div className="mt-6">
                  {isPreOrder ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-terracotta/10 border border-terracotta/20 p-4 text-xs font-semibold text-terracotta">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>
                        {t?.PreOrderNotice?.replace(
                          "[date]",
                          activeVariant?.expectedAvailableDate
                            ? new Date(
                                activeVariant.expectedAvailableDate
                              ).toLocaleDateString()
                            : "Fall 2026"
                        ) || "Pre-Order Available — Ships as soon as restocked"}
                      </span>
                    </div>
                  ) : inStock ? (
                    <div className="flex items-center gap-2.5 rounded-2xl bg-forest/10 border border-forest/20 p-3.5 text-xs font-semibold text-forest">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>{t?.InStockNotice || "✓ In Stock — Ships within 24–48 hours"}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 rounded-2xl bg-sand-soft border border-hairline p-3.5 text-xs font-semibold text-mist">
                      <span>{t?.SoldOutNotice || "Out of stock in this size & color"}</span>
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
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
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
                        onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                        disabled={quantity >= maxQty}
                        className="grid h-10 w-10 place-items-center rounded-xl text-mist hover:bg-sand-soft disabled:opacity-30 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Main CTA */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(false)}
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

                  {/* Buy Now instant checkout */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    disabled={!inStock && !isPreOrder}
                    className="w-full flex items-center justify-center rounded-2xl border-2 border-forest-deep/20 bg-white py-3 px-6 text-sm font-bold text-forest-deep shadow-xs transition-colors hover:bg-sand-soft hover:border-forest disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>{t?.BuyNowBtn || "Instant Checkout"}</span>
                  </button>
                </div>

                {/* VALUE PROPOSITION BADGES */}
                <div className="mt-8 space-y-2.5 rounded-3xl border border-hairline/80 bg-white/80 p-4 backdrop-blur-xs">
                  <div className="flex items-center gap-3 text-xs text-forest-deep">
                    <Truck className="h-4 w-4 shrink-0 text-forest" />
                    <span>{t?.FreeShipping || "Free shipping on orders over $75"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-forest-deep">
                    <RotateCcw className="h-4 w-4 shrink-0 text-forest" />
                    <span>{t?.ReturnsGuarantee || "Easy 30-day hassle-free returns & exchanges"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-forest-deep">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-forest" />
                    <span>{t?.EthicalCrafted || "Ethically crafted with 100% organic cotton"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT SPECS & SOCIAL IMPACT TABS */}
          <div className="mt-16 sm:mt-24 border-t border-hairline pt-12">
            {/* Tab navigation headers */}
            <div className="flex items-center gap-3 border-b border-hairline pb-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
                  activeTab === "specs"
                    ? "bg-forest text-white shadow-xs"
                    : "text-mist hover:bg-sand-soft hover:text-forest-deep"
                }`}
              >
                {t?.Tabs?.Description || "Fabric & Specifications"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("impact")}
                className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
                  activeTab === "impact"
                    ? "bg-forest text-white shadow-xs"
                    : "text-mist hover:bg-sand-soft hover:text-forest-deep"
                }`}
              >
                {t?.Tabs?.Impact || "The Social Impact"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fit")}
                className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
                  activeTab === "fit"
                    ? "bg-forest text-white shadow-xs"
                    : "text-mist hover:bg-sand-soft hover:text-forest-deep"
                }`}
              >
                {t?.Tabs?.SizeFit || "Size & Fit Guide"}
              </button>
            </div>

            {/* Tab 1: Fabric & Specifications (Renders HTML description from editor) */}
            {activeTab === "specs" && (
              <div className="mt-8 max-w-4xl animate-in fade-in">
                {product.description ? (
                  <div
                    className="prose prose-stone max-w-none text-mist leading-relaxed text-sm sm:text-base [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>h1]:text-2xl [&>h1]:font-display [&>h1]:font-bold [&>h1]:text-forest-deep [&>h2]:text-xl [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-forest-deep [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-forest-deep [&>strong]:text-forest-deep [&>a]:text-forest [&>a]:underline"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="text-mist text-sm">
                    100% combed ringspun organic cotton. Pre-shrunk for a structured, comfortable fit. High-density embroidered accents. Machine wash cold, tumble dry low.
                  </p>
                )}

                {/* Tag Pills */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-hairline">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-sand-soft/80 border border-hairline/80 px-3 py-1 text-xs font-medium text-forest-deep"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: The Social Impact */}
            {activeTab === "impact" && (
              <div className="mt-8 max-w-3xl animate-in fade-in space-y-4">
                <div className="rounded-3xl border border-forest/20 bg-sand-soft/40 p-6 sm:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
                    <Heart className="h-3.5 w-3.5 fill-forest" />
                    <span>100% Non-Profit Proceeds</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-forest-deep">
                    Wear the mission. Power grassroots Haitian independence.
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-mist">
                    {t?.ImpactStory ||
                      "100% of store profits from this garment directly fund community grants, solar power installations, and clean water projects across Haiti. By wearing this piece, you're directly fueling local sustainable independence."}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Size & Fit Guide */}
            {activeTab === "fit" && (
              <div className="mt-8 max-w-3xl animate-in fade-in space-y-4">
                <p className="text-sm sm:text-base leading-relaxed text-mist">
                  {t?.ModelStats ||
                    "Model is 6'1\" wearing size Large in a relaxed fit. Pre-shrunk organic cotton ensures consistent fit after washing."}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSizeModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-forest/90"
                  >
                    <Ruler className="h-4 w-4" />
                    <span>View Measurements Table</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RELATED PRODUCTS SECTION */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 sm:mt-32 border-t border-hairline pt-14">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-forest">
                    {t?.RelatedSubtitle || "Ethical apparel curated to match your style"}
                  </p>
                  <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-forest-deep">
                    {t?.RelatedTitle || "Complete the Look"}
                  </h2>
                </div>
                <Link
                  href={`/${lang}/shop`}
                  className="text-xs font-bold text-forest hover:underline"
                >
                  Explore All Garments →
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((rel) => (
                  <ProductCard
                    key={rel._id}
                    product={rel}
                    lang={lang}
                    dict={dict}
                  />
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* FULL-BLEED LIGHTBOX GALLERY MODAL */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/95 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute right-6 top-6 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-h-[85vh] max-w-[85vw] aspect-3/4 overflow-hidden rounded-3xl">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="85vw"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous"
                className="absolute left-6 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next"
                className="absolute right-6 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}

      {/* SIZE CHART MODAL */}
      <SizeChartModal
        isOpen={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        dict={dict}
      />
    </>
  );
}
