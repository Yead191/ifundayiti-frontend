"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";

import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { ProductCard } from "@/components/shop/shop-experience";
import {
  getCategoryLabel,
  getRelatedProducts,
  type ShopProduct,
} from "@/data/shop";


export function ProductDetail({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const [color, setColor] = React.useState(product.colors[0] ?? "");
  const [size, setSize] = React.useState(product.sizes[0] ?? "");
  const [qty, setQty] = React.useState(1);
  const [active, setActive] = React.useState(0);
  const [zoomOpen, setZoomOpen] = React.useState(false);
  const [infoTab, setInfoTab] = React.useState<
    "details" | "shipping" | "returns"
  >("details");

  const related = getRelatedProducts(product);
  const price = product.salePrice ?? product.price;
  const onSale = typeof product.salePrice === "number";
  const inStock = product.stock > 0;
  const images = product.images;
  const activeSrc = images[active] ?? images[0];

  const goPrev = React.useCallback(() => {
    setActive((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = React.useCallback(() => {
    setActive((i) => (i + 1) % images.length);
  }, [images.length]);

  function handleAddToCart() {
    if (!inStock) return;
    addItem({
      id: `${product.id}-${color}-${size}`,
      title: `${product.name} · ${color} / ${size}`,
      price,
      quantity: qty,
      image: images[0],
      slug: product.slug,
    });
    toast.success("Added to cart");
  }

  React.useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoomOpen, goPrev, goNext]);

  return (
    <div className="bg-cream pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-mist">
          <Link href="/shop" className="transition-colors hover:text-forest">
            Shop
          </Link>
          <span className="mx-2 text-faint">/</span>
          <span className="text-forest-deep">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="flex gap-3 md:gap-4">
              <div className="hidden w-20 shrink-0 flex-col gap-2.5 sm:flex">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    className={cn(
                      "relative aspect-3/4 overflow-hidden rounded-xl bg-sand-soft transition-all",
                      active === i
                        ? "ring-2 ring-forest ring-offset-2 ring-offset-cream"
                        : "opacity-70 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>

              <div className="relative min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="group relative block aspect-3/4 w-full overflow-hidden rounded-[1.5rem] bg-sand-soft text-left"
                  aria-label="Open zoom view"
                >
                  <Image
                    src={activeSrc}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-3.5 w-3.5" />
                    Zoom
                  </span>
                </button>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-hairline bg-white/90 text-forest shadow-sm backdrop-blur-sm transition hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-hairline bg-white/90 text-forest shadow-sm backdrop-blur-sm transition hover:bg-white"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="mt-3 flex gap-2 overflow-x-auto sm:hidden">
                  {images.map((src, i) => (
                    <button
                      key={`${src}-m-${i}`}
                      type="button"
                      onClick={() => setActive(i)}
                      className={cn(
                        "relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sand-soft",
                        active === i && "ring-2 ring-forest",
                      )}
                    >
                      <Image src={src} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
              {getCategoryLabel(product.category)}
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-forest-deep sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="font-display text-2xl font-semibold text-forest">
                {formatPrice(price)}
                {onSale && (
                  <span className="ml-2 text-base font-normal text-faint line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-sand-soft px-2.5 py-1 text-xs font-medium text-forest-deep">
                <Star className="h-3 w-3 fill-forest text-forest" />
                {product.rating.toFixed(1)} · {product.reviews} reviews
              </span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-mist">
              {product.description}
            </p>

            <p
              className={cn(
                "mt-3 text-sm font-medium",
                inStock ? "text-forest" : "text-red-700",
              )}
            >
              {inStock
                ? product.stock <= 10
                  ? `Only ${product.stock} left`
                  : "In stock"
                : "Out of stock"}
            </p>

            <fieldset className="mt-8">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">
                Color — {color}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      color === c
                        ? "border-forest bg-forest text-white"
                        : "border-hairline bg-white text-forest-deep hover:border-forest/40",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">
                Size
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-12 rounded-full border px-4 py-2 text-sm transition-colors",
                      size === s
                        ? "border-forest bg-forest text-white"
                        : "border-hairline bg-white text-forest-deep hover:border-forest/40",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 flex items-center gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">
                Qty
              </p>
              <div className="inline-flex items-center rounded-full border border-hairline bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="grid h-11 w-11 place-items-center text-forest disabled:opacity-40"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-semibold text-forest-deep">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="grid h-11 w-11 place-items-center text-forest disabled:opacity-40"
                  disabled={qty >= product.stock}
                  onClick={() =>
                    setQty((q) => Math.min(product.stock, q + 1))
                  }
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                size="lg"
                className="flex-1 rounded-xl"
              >
                Add to cart
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex-1 rounded-xl"
              >
                <Link href="/checkout">Buy now</Link>
              </Button>
            </div>

            <ul className="mt-8 space-y-3 border-t border-hairline pt-8">
              {[
                { icon: Truck, text: "Ships in 5–10 business days" },
                { icon: RotateCcw, text: "30-day returns on unused items" },
                {
                  icon: ShieldCheck,
                  text: "Secure checkout · supports the Program Fund",
                },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-sm text-mist"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-sand-soft text-forest">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <div className="flex gap-1 border-b border-hairline">
                {(
                  [
                    ["details", "Details"],
                    ["shipping", "Shipping"],
                    ["returns", "Returns"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setInfoTab(key)}
                    className={cn(
                      "px-4 py-3 text-sm font-semibold transition-colors",
                      infoTab === key
                        ? "border-b-2 border-forest text-forest"
                        : "text-mist hover:text-forest-deep",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                {infoTab === "details" && product.details}
                {infoTab === "shipping" && product.shipping}
                {infoTab === "returns" && product.returns}
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24 border-t border-hairline pt-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Continue browsing</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep">
                  You may also like
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden text-sm font-semibold text-forest hover:underline sm:inline"
              >
                View shop
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {zoomOpen && (
        <ProductImageZoom
          images={images}
          active={active}
          productName={product.name}
          onClose={() => setZoomOpen(false)}
          onSelect={setActive}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}

function ProductImageZoom({
  images,
  active,
  productName,
  onClose,
  onSelect,
  onPrev,
  onNext,
}: {
  images: string[];
  active: number;
  productName: string;
  onClose: () => void;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [scale, setScale] = React.useState(1);
  const [origin, setOrigin] = React.useState({ x: 50, y: 50 });
  const src = images[active] ?? images[0];

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (scale <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} image zoom`}
      className="fixed inset-0 z-200 flex flex-col bg-forest-deep/95 backdrop-blur-md"
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <p className="text-sm font-medium text-sand/90">
          {productName}
          <span className="ml-2 text-sand/50">
            {active + 1} / {images.length}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(1, s - 0.5))}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white hover:bg-white/10"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(3, s + 0.5))}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white hover:bg-white/10"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white hover:bg-white/10"
            aria-label="Close zoom"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                setScale(1);
                onPrev();
              }}
              className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:left-6"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => {
                setScale(1);
                onNext();
              }}
              className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:right-6"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div
          className="relative h-full max-h-[78vh] w-full max-w-3xl cursor-zoom-in overflow-hidden rounded-2xl"
          onMouseMove={handleMove}
          onClick={() => setScale((s) => (s === 1 ? 2 : 1))}
        >
          <Image
            src={src}
            alt={productName}
            fill
            className="object-contain transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
            sizes="90vw"
            priority
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 px-4 pb-6">
          {images.map((img, i) => (
            <button
              key={`${img}-z-${i}`}
              type="button"
              onClick={() => {
                setScale(1);
                onSelect(i);
              }}
              className={cn(
                "relative h-14 w-12 overflow-hidden rounded-lg",
                active === i ? "ring-2 ring-sand" : "opacity-60 hover:opacity-100",
              )}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
