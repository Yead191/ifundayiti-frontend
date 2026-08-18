"use client";

import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal } = useCart();

  return (
    <>
      <PageHero
        eyebrow="Cart"
        title="Your bag"
        subtitle="Demo cart stored in this browser. Live checkout APIs are commented out for now."
      />
      <section className="py-14">
        <Container>
          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              body="Browse IFundAyiti merch and add a piece when you are ready."
              actionLabel="Visit shop"
              actionHref="/shop"
            />
          ) : (
            <div className="grid gap-10 lg:grid-cols-12">
              <ul className="space-y-4 lg:col-span-8">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-hairline bg-white p-4"
                  >
                    <div className="relative h-24 w-20 overflow-hidden rounded-lg bg-sand-soft">
                      <Image src={item.image} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-medium text-forest-deep hover:underline"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-mist">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value) || 1)
                          }
                          className="h-10 w-16 rounded-lg border border-input px-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-mist hover:text-forest"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <aside className="h-fit rounded-2xl bg-sand-soft p-6 lg:col-span-4">
                <p className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </p>
                <Button asChild className="mt-6 w-full">
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </aside>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
