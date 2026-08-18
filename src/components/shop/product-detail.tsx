"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { ProductCard } from "@/components/shop/shop-experience";
import {
  getRelatedProducts,
  type ShopProduct,
} from "@/data/shop";

export function ProductDetail({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const [color, setColor] = React.useState(product.colors[0]);
  const [size, setSize] = React.useState(product.sizes[0]);
  const [qty, setQty] = React.useState(1);
  const [active, setActive] = React.useState(0);
  const related = getRelatedProducts(product);
  const price = product.salePrice ?? product.price;
  const inStock = product.stock > 0;

  function addToCart() {
    addItem({
      id: `${product.id}-${color}-${size}`,
      title: `${product.name} · ${color} / ${size}`,
      price,
      quantity: qty,
      image: product.images[0],
      slug: product.slug,
    });
    toast.success("Added to cart");
  }

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-sand-soft">
            <Image
              src={product.images[active] ?? product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg ${
                    active === i ? "ring-2 ring-forest" : ""
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-forest">
            {product.category.replace("-", " ")}
          </p>
          <h1 className="mt-2 font-display text-4xl text-forest-deep">
            {product.name}
          </h1>
          <p className="mt-3 text-xl font-semibold text-forest">
            {formatPrice(price)}
            {product.salePrice && (
              <span className="ml-2 text-base font-normal text-mist line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </p>
          <p className="mt-4 leading-relaxed text-mist">{product.description}</p>
          <p className="mt-2 text-sm text-mist">
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <fieldset className="mt-6">
            <legend className="text-xs font-semibold uppercase tracking-wider text-forest">
              Color
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    color === c
                      ? "border-forest bg-forest text-white"
                      : "border-hairline"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-xs font-semibold uppercase tracking-wider text-forest">
              Size
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    size === s
                      ? "border-forest bg-forest text-white"
                      : "border-hairline"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 flex items-center gap-3">
            <label className="text-sm text-mist" htmlFor="qty">
              Quantity
            </label>
            <input
              id="qty"
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="h-11 w-20 rounded-xl border border-input px-3 text-sm"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={addToCart} disabled={!inStock} className="flex-1">
              Add to cart
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/cart">Buy now</Link>
            </Button>
          </div>

          <div className="mt-10 space-y-4 text-sm text-mist">
            <p>
              <strong className="text-forest-deep">Details. </strong>
              {product.details}
            </p>
            <p>
              <strong className="text-forest-deep">Shipping. </strong>
              {product.shipping}
            </p>
            <p>
              <strong className="text-forest-deep">Returns. </strong>
              {product.returns}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl text-forest-deep">Related products</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
