"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart/cart-context";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [done, setDone] = React.useState(false);

  /*
    Live cart/checkout API (commented while using demo data):

    const res = await nextFetch<CartData>("/cart", { method: "GET", cache: "no-store", tags: ["cart"] });
    await nextFetch("/orders", { method: "POST", body: payload });
  */

  if (items.length === 0 && !done) {
    return (
      <>
        <PageHero eyebrow="Checkout" title="Checkout" />
        <section className="py-14">
          <Container>
            <EmptyState
              title="Nothing to check out"
              body="Add a product from the shop first."
              actionLabel="Shop merch"
              actionHref="/shop"
            />
          </Container>
        </section>
      </>
    );
  }

  if (done) {
    return (
      <>
        <PageHero eyebrow="Checkout" title="Thank you" />
        <section className="py-14">
          <Container className="max-w-lg text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-forest" />
            <h2 className="mt-4 font-display text-3xl">Order received</h2>
            <p className="mt-3 text-mist">
              This is a demo checkout. No payment was processed.
            </p>
            <Button asChild className="mt-6">
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Complete your order"
        subtitle="Demo checkout — replace with the live payment flow later."
      />
      <section className="py-14">
        <Container className="grid gap-10 lg:grid-cols-12">
          <form
            className="space-y-4 rounded-2xl border border-hairline bg-white p-6 lg:col-span-7"
            onSubmit={(e) => {
              e.preventDefault();
              clearCart();
              setDone(true);
              toast.success("Demo order placed");
            }}
          >
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                Full name
              </Label>
              <Input required name="name" />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                Email
              </Label>
              <Input required type="email" name="email" />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                Shipping address
              </Label>
              <Input required name="address" />
            </div>
            <Button type="submit" className="w-full">
              Place demo order · {formatPrice(cartTotal)}
            </Button>
          </form>
          <aside className="h-fit rounded-2xl bg-sand-soft p-6 lg:col-span-5">
            <h2 className="font-display text-xl">Summary</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between border-t border-hairline pt-3 font-semibold">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
