import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/mock/products";

// 1. Định nghĩa lại kiểu dữ liệu: params bây giờ là một Promise
type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: NextRequest, { params }: Props) {
  // 2. Bắt buộc phải dùng 'await' để lấy slug ra từ params
  const { slug } = await params;

  const product = PRODUCTS.find((p) => p.slug === slug);
  
  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}