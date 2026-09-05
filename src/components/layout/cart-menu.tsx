"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Minus, Package, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { CartData } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import {
  updateCartQuantity,
  removeCartItem,
} from "@/helpers/next-fetch/cartActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CartMenu({ cart }: { cart?: CartData | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/");
  const lang = segments[1] === "ht" ? "ht" : "en";

  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const items = cart?.cart ?? [];
  const breakdown = cart?.price_breakdown;
  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal =
    breakdown?.total_price ??
    items.reduce((sum, item) => sum + (item.total_price || item.unit_price * item.quantity), 0);
  const subtotal =
    breakdown?.subtotal ??
    items.reduce((sum, item) => sum + (item.total_price || item.unit_price * item.quantity), 0);

  async function handleQty(id: string, delta: 1 | -1) {
    setUpdatingId(id);
    try {
      const res = await updateCartQuantity(id, delta);
      if (res.success) {
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while updating quantity");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(id: string) {
    setUpdatingId(id);
    try {
      const res = await removeCartItem(id);
      if (res.success) {
        toast.success("Item removed from bag");
        router.refresh();
      } else {
        toast.error(res.message || "Could not remove item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while removing item");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Cart"
          className="relative grid h-9.5 w-9.5 place-items-center rounded-xl border border-hairline/80 bg-sand-soft/80 text-forest transition-all hover:bg-sand hover:text-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30"
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          {cartCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-forest px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50 duration-200">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-88 rounded-2xl border border-hairline/80 bg-white/98 p-0 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95"
      >
        {/* Header */}
        <DropdownMenuLabel className="flex items-center justify-between border-b border-hairline px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-forest" />
            <span className="font-bold text-forest-deep">Shopping Bag</span>
          </div>
          <span className="rounded-full bg-sand-soft px-2.5 py-0.5 text-xs font-semibold text-forest">
            {cartCount === 0
              ? "Empty"
              : `${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          </span>
        </DropdownMenuLabel>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sand-soft text-forest">
              <Package className="h-6 w-6 opacity-75" />
            </div>
            <div>
              <p className="text-sm font-semibold text-forest-deep">
                Your shopping bag is empty
              </p>
              <p className="mt-1 text-xs text-mist leading-relaxed max-w-xs">
                Browse our ethical apparel and mission merchandise to support local Haitian innovators.
              </p>
            </div>
            <Button asChild size="sm" className="mt-2 rounded-xl px-5 text-xs font-semibold">
              <Link href={`/${lang}/shop`}>Explore Collection</Link>
            </Button>
          </div>
        ) : (
          <div>
            {/* Scrollable Item List */}
            <div className="max-h-72 divide-y divide-hairline overflow-y-auto px-1 py-1">
              {items.map((item) => {
                const title =
                  item.product?.name || item.product?.title || "Merchandise";
                const rawImg =
                  item.product?.images?.[0] || item.product?.image || "";
                const img = getImageUrl(rawImg) || "/placeholder.png";
                const busy = updatingId === item._id;

                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 p-3 transition-colors hover:bg-sand-soft/50 rounded-xl"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-hairline bg-sand-soft">
                      {img && (
                        <Image
                          src={img}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/${lang}/shop/${item.product?._id || ""}`}
                        className="truncate block text-xs font-semibold text-forest-deep hover:text-forest transition-colors"
                      >
                        {title}
                      </Link>

                      {/* Variants */}
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-mist">
                        {item.size && (
                          <span className="rounded bg-sand-soft px-1.5 py-0.2 font-medium text-forest-deep">
                            {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="rounded bg-sand-soft px-1.5 py-0.2 font-medium text-forest-deep">
                            {item.color}
                          </span>
                        )}
                        <span>·</span>
                        <span className="font-semibold text-forest">
                          {formatPrice(item.unit_price)}
                        </span>
                      </div>

                      {/* Stepper & Line total */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-md border border-hairline bg-white">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleQty(item._id, -1)}
                            className="grid h-6 w-6 place-items-center text-forest transition-colors hover:bg-sand-soft disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            {busy ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : item.quantity <= 1 ? (
                              <Trash2 className="h-3 w-3 text-red-500" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-forest-deep">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleQty(item._id, 1)}
                            className="grid h-6 w-6 place-items-center text-forest transition-colors hover:bg-sand-soft disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            {busy ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </button>
                        </div>

                        <span className="text-xs font-bold text-forest-deep">
                          {formatPrice(item.total_price || item.unit_price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Icon */}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleRemove(item._id)}
                      className="text-mist transition-colors hover:text-red-500 p-1 self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Price breakdown summary */}
            <div className="border-t border-hairline bg-sand-soft/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-mist">
                <span>Subtotal</span>
                <span className="font-semibold text-forest-deep">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-mist">
                <span>Delivery</span>
                <span className="font-semibold text-forest-deep">
                  {breakdown?.delivery_charge
                    ? formatPrice(breakdown.delivery_charge)
                    : "$8.00"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-hairline/80 pt-2 text-sm font-bold text-forest-deep">
                <span>Total</span>
                <span className="text-forest text-base font-display">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-2 border-t border-hairline p-3 bg-white">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold"
              >
                <Link href={`/${lang}/cart`}>View Bag</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-xl text-xs font-semibold shadow-xs"
              >
                <Link href={`/${lang}/checkout`}>Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
