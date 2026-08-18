"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CartMenu() {
  const { items, cartCount, cartTotal } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-xl bg-sand-soft text-forest transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 ? (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[10px] font-bold text-white">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="font-semibold text-forest-deep">Cart</span>
          <span className="text-xs text-mist">
            {cartCount === 0 ? "Empty" : `${cartCount} item${cartCount === 1 ? "" : "s"}`}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sand-soft text-forest">
              <Package className="h-5 w-5" />
            </span>
            <p className="text-sm text-mist">Your cart is empty</p>
            <Button asChild variant="outline" size="sm" className="mt-1">
              <Link href="/shop">Browse shop</Link>
            </Button>
          </div>
        ) : (
          <div className="max-h-72 overflow-auto py-2">
            {items.map((line) => (
              <Link
                key={line.id}
                href={`/product/${line.slug}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-sand-soft"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-sand-soft">
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-forest-deep">
                    {line.title}
                  </p>
                  <p className="text-xs text-mist">
                    {line.quantity} × {formatPrice(line.price)}
                  </p>
                </div>
              </Link>
            ))}
            <div className="flex items-center justify-between border-t border-hairline px-4 py-3">
              <span className="text-sm text-mist">Subtotal</span>
              <span className="text-sm font-semibold text-forest">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 pb-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/cart">View cart</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
