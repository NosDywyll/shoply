"use client";

import { useCart } from "@/features/cart/cart-context";
import { formatVND } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createOrder, Order } from "@/services/orders";

type PM = "cod" | "banking" | "momo";

export default function CartPage() {
  const router = useRouter();
  const { state, dispatch, subtotal, hydrated: cartHydrated } = useCart();
  
  // 1. Tránh Hydration Mismatch: Chỉ render nội dung sau khi mount thành công
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // State cho Form thanh toán
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState<PM>("cod");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Chờ cả Cart Context và Component đều đã sẵn sàng trên Client
  if (!mounted || !cartHydrated) {
    return (
      <div className="flex justify-center p-20 font-medium">
        Đang tải giỏ hàng...
      </div>
    );
  }

  const items = state.items;
  const shipping = items.length ? 15000 : 0;
  const total = subtotal + shipping;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!items.length) { setError("Giỏ hàng trống."); return; }
    if (!name || !addr) { setError("Vui lòng nhập đầy đủ thông tin."); return; }
    
    setSubmitting(true);
    try {
      const payload = {
        customerName: name,
        customerPhone: phone,
        customerAddress: addr,
        paymentMethod: pm,
        note,
        items: items.map(it => ({ productId: it.productId, quantity: it.quantity })),
      };

      const res = await createOrder(payload);
      setResult(res.order);
      dispatch({ type: "CLEAR" }); // Xóa giỏ hàng khi thành công
    } catch (err: any) {
      setError(err.message || "Đặt hàng thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="py-8 max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6">Chi tiết giỏ hàng</h1>

      {result ? (
        <div className="border rounded-xl p-10 bg-green-50 text-center space-y-4">
          <h2 className="text-2xl font-bold text-green-700">Đặt hàng thành công!</h2>
          <p>Mã đơn hàng: <b>{result._id}</b></p>
          <button 
            onClick={() => router.push("/shop")}
            className="px-6 py-2 bg-black text-white rounded-md"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">
          Giỏ hàng trống. <Link className="underline" href="/shop">Mua sắm ngay →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PHẦN DANH SÁCH & FORM */}
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              {items.map((it) => (
                <div key={it.productId} className="flex gap-4 border rounded-xl p-3 bg-white">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={it.image || "/placeholder.png"}
                      alt={it.title}
                      fill
                      className="rounded-md border object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <Link href={`/shop/${it.slug}`} className="font-medium hover:underline">{it.title}</Link>
                      <button 
                        onClick={() => dispatch({ type: "REMOVE", payload: { productId: it.productId } })}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{formatVND(it.price)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">Số lượng:</span>
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => dispatch({ type: "SET_QTY", payload: { productId: it.productId, quantity: Number(e.target.value) || 1 } })}
                        className="w-16 h-8 border rounded px-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="border-t pt-8">
              <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
              <form id="order-form" onSubmit={onSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input placeholder="Họ tên *" className="border p-2 rounded" value={name} onChange={e => setName(e.target.value)} required />
                  <input placeholder="Số điện thoại" className="border p-2 rounded" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <textarea placeholder="Địa chỉ giao hàng *" className="border p-2 rounded w-full h-20" value={addr} onChange={e => setAddr(e.target.value)} required />
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Phương thức thanh toán</p>
                  <div className="flex gap-4">
                    {(["cod", "banking", "momo"] as PM[]).map((type) => (
                      <label key={type} className="flex items-center gap-2 border px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:border-black">
                        <input type="radio" name="pm" checked={pm === type} onChange={() => setPM(type)} />
                        <span className="uppercase text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </section>
          </div>

          {/* SIDEBAR TỔNG TIỀN */}
          <aside>
            <div className="border rounded-xl p-6 bg-gray-50 sticky top-4">
              <h2 className="font-semibold text-lg mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-2 text-sm border-b pb-4">
                <div className="flex justify-between"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
                <div className="flex justify-between"><span>Phí vận chuyển</span><span>{formatVND(shipping)}</span></div>
              </div>
              <div className="flex justify-between font-bold text-xl py-4 text-red-600">
                <span>Tổng cộng</span>
                <span>{formatVND(total)}</span>
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button 
                form="order-form"
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white h-12 rounded-lg font-medium disabled:bg-gray-400"
              >
                {submitting ? "Đang xử lý..." : "Đặt hàng ngay"}
              </button>

              <button 
                onClick={() => dispatch({ type: "CLEAR" })}
                className="w-full mt-4 text-sm text-gray-500 hover:text-red-500 underline"
              >
                Xóa giỏ hàng
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}