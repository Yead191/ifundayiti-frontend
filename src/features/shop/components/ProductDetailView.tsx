"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ApparelProduct, ProductVariant } from "@/helpers/next-fetch/shopActions";
import { ProductGallery } from "./ProductGallery";
import { ProductInfoSection } from "./ProductInfoSection";
import { ProductStoryTabs } from "./ProductStoryTabs";
import { ProductCard } from "./ProductCard";
import { SizeChartModal } from "./SizeChartModal";
import { useCart } from "@/components/cart/cart-context";
import { Container } from "@/components/shared/container";
import { getImageUrl } from "@/lib/getImageUrl";

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

  const [sizeModalOpen, setSizeModalOpen] = React.useState(false);

  // Variants & Color/Size Selection
  const variants = product.variants || [];
  const initialColor = variants[0]?.color || "";
  const [selectedColor, setSelectedColor] = React.useState(initialColor);

  const sizesForColor = React.useMemo(() => {
    if (!variants.length) return [];
    return selectedColor
      ? variants.filter(
          (v) => v.color.toLowerCase() === selectedColor.toLowerCase()
        )
      : variants;
  }, [variants, selectedColor]);

  const [selectedSize, setSelectedSize] = React.useState(
    sizesForColor[0]?.size || ""
  );
  const [quantity, setQuantity] = React.useState(1);

  // When color changes, select matching size
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

  // Active variant resolution
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

  // Images resolution
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/images/placeholder.webp"];

  // Distinct colors
  const distinctColors = React.useMemo(() => {
    return Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));
  }, [variants]);

  // Pricing & Discounts
  const hasDiscount =
    !!product.compareAtPrice && product.compareAtPrice > product.price;
  const discountSavings = hasDiscount
    ? product.compareAtPrice! - product.price
    : 0;
  const discountPercent = hasDiscount
    ? Math.round((discountSavings / product.compareAtPrice!) * 100)
    : 0;

  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.name
      : product.category || "Product";

  // Cart Add Handler
  const handleAddToCart = (redirectAfter = false) => {
    if (!inStock && !isPreOrder) {
      toast.error(t?.SoldOutNotice || "Out of stock in this size & color");
      return;
    }

    const firstImage = getImageUrl(images[0]) || images[0];
    const lineId = `${product._id}-${selectedColor}-${selectedSize}`;
    addItem({
      id: lineId,
      productId: product._id,
      title: `${product.name} · ${selectedColor} / ${selectedSize}`,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity,
      image: firstImage,
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
          {/* Breadcrumb Navigation */}
          <nav className="mb-8 flex items-center gap-2 text-xs font-semibold text-mist">
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
            <span className="text-forest-deep font-bold truncate max-w-xs">
              {product.name}
            </span>
          </nav>

          {/* Main 2-Column Product Layout */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Image Gallery & Fullscreen Zoom Lightbox */}
            <div className="lg:col-span-7">
              <ProductGallery
                productName={product.name}
                images={images}
                hasDiscount={hasDiscount}
                discountPercent={discountPercent}
                saleBadgeText={cardT?.SaleBadge || "OFF"}
              />
            </div>

            {/* Right Column: Garment Info, Variants & Buy CTAs */}
            <div className="lg:col-span-5">
              <ProductInfoSection
                product={product}
                categoryName={categoryName}
                hasDiscount={hasDiscount}
                discountSavings={discountSavings}
                distinctColors={distinctColors}
                selectedColor={selectedColor}
                onSelectColor={handleColorSelect}
                sizesForColor={sizesForColor}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                activeVariant={activeVariant}
                quantity={quantity}
                onQuantityChange={setQuantity}
                maxQty={maxQty}
                inStock={inStock}
                isPreOrder={isPreOrder}
                onAddToCart={handleAddToCart}
                onOpenSizeChart={() => setSizeModalOpen(true)}
                dict={dict}
              />
            </div>
          </div>

          {/* Product Specifications & Impact Story Tabs */}
          <ProductStoryTabs
            product={product}
            onOpenSizeChart={() => setSizeModalOpen(true)}
            dict={dict}
          />

          {/* Related Products Section ("Complete the Look") */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 sm:mt-32 border-t border-hairline pt-14">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-forest">
                    {t?.RelatedSubtitle ||
                      "Ethical products curated to match your style"}
                  </p>
                  <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-forest-deep">
                    {t?.RelatedTitle || "Complete the Look"}
                  </h2>
                </div>
                <Link
                  href={`/${lang}/shop`}
                  className="text-xs font-bold text-forest hover:underline"
                >
                  Explore All Products →
                </Link>
              </div>

              {/* Responsive Grid: 2 columns on mobile, 4 columns on desktop */}
              <div className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4">
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

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        dict={dict}
      />
    </>
  );
}
