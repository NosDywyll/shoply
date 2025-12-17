import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

export default function HomePage() {
  // ✅ mảng cấu hình
  const NAV_ITEMS: NavItem[] = [
    { label: "Shop", href: "/shop" },
    { label: "Cart", href: "/cart" },
    { label: "Orders", href: "/orders" }, 
    { label: "Admin", href: "/admin" },
  ];

  return (
    <main className="py-10">
      <h1 className="text-3xl font-bold">Chào mừng đến Shoply</h1>
      <p className="mt-2 text-gray-600">Catalog, giỏ hàng, đơn hàng, admin CRUD.</p>
      
      <div className="mt-6 flex gap-4 underline">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
