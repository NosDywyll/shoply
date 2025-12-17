import { apiFetch } from "@/lib/api";

export type CreateOrderInput = {
  customerName: string;
  customerPhone?: string;
  customerAddress: string;
  paymentMethod: "cod" | "banking" | "momo";
  note?: string;
  items: { productId: string; quantity: number }[];
};

// Định nghĩa cấu trúc đơn hàng trả về (Sửa lỗi any)
export interface Order {
  _id: string;
  customerName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  // Thêm các trường khác giống như trong Database của bạn
}

export function createOrder(input: CreateOrderInput) {
  // Thay thế 'order: any' bằng 'order: Order'
  return apiFetch<{ ok: boolean; order: Order }>("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}