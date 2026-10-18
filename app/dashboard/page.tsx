import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import Navbar from "@/app/components/Navbar";
import prisma from "@/app/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [total, active, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: { stock: { lt: 10 } } }),
  ]);

  const cards = [
    { label: "สินค้าทั้งหมด", value: total },
    { label: "พร้อมขาย", value: active },
    { label: "สต็อกต่ำ (< 10)", value: lowStock },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">Dashboard</h1>
        <p className="mb-6 text-gray-600">
          สวัสดี {session.user.name ?? session.user.email} ({session.user.role})
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl bg-white p-6 shadow">
              <div className="text-sm text-gray-500">{c.label}</div>
              <div className="mt-1 text-3xl font-bold">{c.value}</div>
            </div>
          ))}
        </div>

        <Link href="/products" className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700">
          จัดการสินค้า
        </Link>
      </main>
    </div>
  );
}
