import type { Product } from "@/types/product";

const COLORS = ["Đen", "Trắng", "Xanh", "Be", "Nâu"];
const SIZES = ["S", "M", "L", "XL"];
const BRANDS = ["Acme", "Contoso", "Umbra", "Nova"];

// 👉 Danh sách 10 ảnh có sẵn
const IMAGES = Array.from({ length: 10 }, (_, i) => `/images/p${i + 1}.jpg`);

export const PRODUCTS: Product[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;

  // 👉 Chọn ngẫu nhiên 1 ảnh trong danh sách
  const randomImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  return {
    _id: `p${n}`,
    title: `Sản phẩm #${n}`,
    slug: `san-pham-${n}`,
    price: 39000 + n * 10000,
    images: [randomImage],
    stock: n % 7 === 0 ? 0 : ((n * 3) % 21) + 1,
    rating: (n % 5) + 1,
    brand: BRANDS[n % BRANDS.length],
    variants: [
      {
        color: COLORS[n % COLORS.length],
        size: SIZES[n % SIZES.length],
      },
    ],
    description: "Mô tả ngắn cho sản phẩm.",
    category: n % 2 ? "fashion" : "accessories",
  } satisfies Product;
});