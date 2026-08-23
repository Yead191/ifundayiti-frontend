export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
  details: string;
  shipping: string;
  returns: string;
}

export const SHOP_CATEGORIES = [
  { slug: "t-shirts", label: "T-Shirts" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "sweatshirts", label: "Sweatshirts" },
  { slug: "hats", label: "Hats" },
  { slug: "tote-bags", label: "Tote Bags" },
  { slug: "accessories", label: "Accessories" },
] as const;

/** Shared image sets — multiple angles for gallery + zoom */
const TEE = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1576566588028-4147f3842fbf?auto=format&fit=crop&q=80&w=1200&h=1500",
];
const HOODIE = [
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1578587018452-892b043db7af?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1200&h=1500",
];
const SWEAT = [
  "https://images.unsplash.com/photo-1578587018452-892b043db7af?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?auto=format&fit=crop&q=80&w=1200&h=1500",
];
const HAT = [
  "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&q=80&w=1200&h=1500",
];
const TOTE = [
  "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1590874103328-eac38a67437e?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&q=80&w=1200&h=1500",
];
const PIN = [
  "https://images.unsplash.com/photo-1611652022419-a709be98e5c2?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1200&h=1500",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200&h=1500",
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "prd-tee-forest",
    slug: "forest-green-mission-tee",
    name: "Forest Green Mission Tee",
    description:
      "Soft cotton tee in Forest Green with a quiet IFundAyiti wordmark — made for everyday wear that still carries the mission.",
    category: "t-shirts",
    price: 32,
    images: TEE,
    colors: ["Forest Green", "Warm Sand", "Cream"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 48,
    featured: true,
    rating: 4.8,
    reviews: 24,
    createdAt: "2026-03-01",
    details: "100% cotton. Unisex fit. Water-based ink print. Pre-shrunk.",
    shipping: "Ships in 5–10 business days. Rates calculated at checkout.",
    returns: "Unused items in original condition may be returned within 30 days.",
  },
  {
    id: "prd-tee-sand",
    slug: "warm-sand-crest-tee",
    name: "Warm Sand Crest Tee",
    description:
      "Warm Sand cotton tee with a small leaf crest inspired by the IFundAyiti mark.",
    category: "t-shirts",
    price: 32,
    images: [TEE[1], TEE[0], TEE[2], TEE[3]],
    colors: ["Warm Sand", "Forest Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 36,
    featured: false,
    rating: 4.6,
    reviews: 11,
    createdAt: "2026-03-04",
    details: "100% cotton. Unisex fit. Soft hand feel.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items in original condition may be returned within 30 days.",
  },
  {
    id: "prd-hoodie-forest",
    slug: "forest-hoodie",
    name: "Forest Hoodie",
    description:
      "Heavyweight hoodie in Forest Green — a staple for cooler evenings and community gatherings.",
    category: "hoodies",
    price: 68,
    salePrice: 58,
    images: HOODIE,
    colors: ["Forest Green", "Cream"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 22,
    featured: true,
    rating: 4.9,
    reviews: 18,
    createdAt: "2026-02-20",
    details: "Cotton-blend fleece. Kangaroo pocket. Drawstring hood.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items in original condition may be returned within 30 days.",
  },
  {
    id: "prd-hoodie-sand",
    slug: "warm-sand-hoodie",
    name: "Warm Sand Hoodie",
    description:
      "A softer hoodie in Warm Sand with embroidered IFundAyiti type along the chest.",
    category: "hoodies",
    price: 68,
    images: [HOODIE[1], HOODIE[0], HOODIE[2], HOODIE[3]],
    colors: ["Warm Sand"],
    sizes: ["S", "M", "L", "XL"],
    stock: 14,
    featured: false,
    rating: 4.7,
    reviews: 9,
    createdAt: "2026-02-22",
    details: "Cotton-blend fleece. Embroidered mark. Midweight.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items in original condition may be returned within 30 days.",
  },
  {
    id: "prd-sweat-cream",
    slug: "cream-crewneck",
    name: "Cream Crewneck Sweatshirt",
    description:
      "Relaxed cream crewneck with a forest-green embroidered mark at the chest.",
    category: "sweatshirts",
    price: 54,
    images: SWEAT,
    colors: ["Cream", "Forest Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 27,
    featured: true,
    rating: 4.5,
    reviews: 7,
    createdAt: "2026-01-18",
    details: "Midweight fleece. Ribbed cuffs and hem.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items in original condition may be returned within 30 days.",
  },
  {
    id: "prd-cap",
    slug: "forest-field-cap",
    name: "Forest Field Cap",
    description:
      "Unstructured field cap with a small IFundAyiti leaf stitch on the front panel.",
    category: "hats",
    price: 28,
    images: HAT,
    colors: ["Forest Green", "Warm Sand"],
    sizes: ["One Size"],
    stock: 40,
    featured: false,
    rating: 4.4,
    reviews: 15,
    createdAt: "2026-04-02",
    details: "Adjustable strap. Cotton twill. Unstructured crown.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items in original condition may be returned within 30 days.",
  },
  {
    id: "prd-tote",
    slug: "canvas-mission-tote",
    name: "Canvas Mission Tote",
    description:
      "Heavy canvas tote for markets, books, and everyday carrying — proceeds support the Program Fund.",
    category: "tote-bags",
    price: 24,
    images: TOTE,
    colors: ["Cream", "Forest Green"],
    sizes: ["One Size"],
    stock: 55,
    featured: true,
    rating: 4.8,
    reviews: 21,
    createdAt: "2026-03-12",
    details: "12 oz canvas. Interior pocket. Reinforced handles.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items in original condition may be returned within 30 days.",
  },
  {
    id: "prd-pin",
    slug: "leaf-enamel-pin",
    name: "Leaf Enamel Pin",
    description:
      "A small hard-enamel pin of the IFundAyiti leaf — made to travel on jackets, bags, and caps.",
    category: "accessories",
    price: 12,
    images: PIN,
    colors: ["Forest Green"],
    sizes: ["One Size"],
    stock: 80,
    featured: false,
    rating: 4.9,
    reviews: 30,
    createdAt: "2026-04-10",
    details: "Hard enamel. Rubber clasp. Approx. 25 mm.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items in original condition may be returned within 30 days.",
  },
];

export function getProductBySlug(slug: string) {
  return SHOP_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedProducts(product: ShopProduct, limit = 4) {
  return SHOP_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, limit);
}

export function getCategoryLabel(slug: string) {
  return SHOP_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
