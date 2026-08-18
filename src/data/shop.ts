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
  { slug: "accessories", label: "Accessories" },
  { slug: "hats", label: "Hats" },
  { slug: "tote-bags", label: "Tote Bags" },
] as const;

const merch = (
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=900&h=1100"
);
const hoodie =
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=900&h=1100";
const tote =
  "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=900&h=1100";
const hat =
  "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=900&h=1100";
const sweat =
  "https://images.unsplash.com/photo-1578587018452-892b043cd7af?auto=format&fit=crop&q=80&w=900&h=1100";
const pin =
  "https://images.unsplash.com/photo-1611652022419-a709be98e5c2?auto=format&fit=crop&q=80&w=900&h=1100";

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "prd-tee-forest",
    slug: "forest-green-mission-t-shirt",
    name: "Forest Green Mission T-Shirt",
    description:
      "Soft cotton tee in Forest Green with a quiet IFundAyiti wordmark. Built as everyday merch for the program.",
    category: "t-shirts",
    price: 32,
    images: [merch, merch],
    colors: ["Forest Green", "Warm Sand", "Cream"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 48,
    featured: true,
    rating: 4.8,
    reviews: 24,
    createdAt: "2026-03-01",
    details: "100% cotton. Unisex fit. Printed with water-based ink.",
    shipping: "Ships in 5–10 business days. Rates calculated at checkout.",
    returns: "Unused items may be returned within 30 days.",
  },
  {
    id: "prd-tee-sand",
    slug: "warm-sand-crest-t-shirt",
    name: "Warm Sand Crest T-Shirt",
    description:
      "Warm Sand cotton tee with a small leaf crest inspired by the IFundAyiti mark.",
    category: "t-shirts",
    price: 32,
    images: [merch],
    colors: ["Warm Sand", "Forest Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 36,
    featured: false,
    rating: 4.6,
    reviews: 11,
    createdAt: "2026-03-04",
    details: "100% cotton. Unisex fit.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items may be returned within 30 days.",
  },
  {
    id: "prd-hoodie-forest",
    slug: "forest-hoodie",
    name: "Forest Hoodie",
    description:
      "Heavyweight hoodie in Forest Green. A staple piece for cooler evenings and community events.",
    category: "hoodies",
    price: 68,
    salePrice: 58,
    images: [hoodie],
    colors: ["Forest Green", "Cream"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 22,
    featured: true,
    rating: 4.9,
    reviews: 18,
    createdAt: "2026-02-20",
    details: "Cotton-blend fleece. Kangaroo pocket. Drawstring hood.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items may be returned within 30 days.",
  },
  {
    id: "prd-hoodie-sand",
    slug: "sand-hoodie",
    name: "Warm Sand Hoodie",
    description: "A softer hoodie in Warm Sand with embroidered IFundAyiti type.",
    category: "hoodies",
    price: 68,
    images: [hoodie],
    colors: ["Warm Sand"],
    sizes: ["S", "M", "L", "XL"],
    stock: 14,
    featured: false,
    rating: 4.7,
    reviews: 9,
    createdAt: "2026-02-22",
    details: "Cotton-blend fleece.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items may be returned within 30 days.",
  },
  {
    id: "prd-sweat-cream",
    slug: "cream-crewneck",
    name: "Cream Crewneck Sweatshirt",
    description:
      "Relaxed crewneck in cream with a forest-green embroidered mark.",
    category: "sweatshirts",
    price: 54,
    images: [sweat],
    colors: ["Cream", "Forest Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 27,
    featured: true,
    rating: 4.5,
    reviews: 7,
    createdAt: "2026-01-18",
    details: "Midweight fleece. Ribbed cuffs.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items may be returned within 30 days.",
  },
  {
    id: "prd-cap",
    slug: "forest-field-cap",
    name: "Forest Field Cap",
    description: "Unstructured cap with a small IFundAyiti leaf stitch.",
    category: "hats",
    price: 28,
    images: [hat],
    colors: ["Forest Green", "Warm Sand"],
    sizes: ["One Size"],
    stock: 40,
    featured: false,
    rating: 4.4,
    reviews: 15,
    createdAt: "2026-04-02",
    details: "Adjustable strap. Cotton twill.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items may be returned within 30 days.",
  },
  {
    id: "prd-tote",
    slug: "canvas-mission-tote",
    name: "Canvas Mission Tote",
    description:
      "Heavy canvas tote for markets, books, and everyday carrying. Proceeds support the Program Fund when the shop is live.",
    category: "tote-bags",
    price: 24,
    images: [tote],
    colors: ["Cream", "Forest Green"],
    sizes: ["One Size"],
    stock: 55,
    featured: true,
    rating: 4.8,
    reviews: 21,
    createdAt: "2026-03-12",
    details: "12 oz canvas. Interior pocket.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items may be returned within 30 days.",
  },
  {
    id: "prd-pin",
    slug: "leaf-enamel-pin",
    name: "Leaf Enamel Pin",
    description: "Small enamel pin of the IFundAyiti leaf mark.",
    category: "accessories",
    price: 12,
    images: [pin],
    colors: ["Forest Green"],
    sizes: ["One Size"],
    stock: 80,
    featured: false,
    rating: 4.9,
    reviews: 30,
    createdAt: "2026-04-10",
    details: "Hard enamel. Rubber clasp.",
    shipping: "Ships in 5–10 business days.",
    returns: "Unused items may be returned within 30 days.",
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
