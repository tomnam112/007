import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import Navbar from "@/app/components/Navbar";
import DeleteButton from "@/app/components/DeleteButton";
import { queryProducts } from "@/app/lib/products";
import { canDelete, canWrite } from "@/app/lib/permissions";
import { CATEGORIES, STATUSES, STATUS_LABEL } from "@/app/lib/validations";
import { deleteProduct } from "@/app/products/actions";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  };

  const q = get("q");
  const category = get("category");
  const status = get("status");

  const data = await queryProducts({ q, category, status, page: Number(get("page")) || 1 });
  const role = session.user.role;

  const href = (page: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (category) p.set("category", category);
    if (status) p.set("status", status);
    p.set("page", String(page));
    return `/products?${p.toString()}`;
  };

  const inputCls = "rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">รายการสินค้า</h1>
          {canWrite(role) && (
            <Link href="/products/new" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              + เพิ่มสินค้า
            </Link>
          )}
        </div>

        {/* Search + Filter */}
        <form method="GET" className="mb-4 flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow">
          <input
            name="q"
            defaultValue={q}
            placeholder="ค้นหาชื่อหรือรายละเอียด..."
            className={`${inputCls} min-w-56 flex-1`}
          />
          <select name="category" defaultValue={category ?? ""} className={inputCls}>
            <option value="">ทุกหมวดหมู่</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select name="status" defaultValue={status ?? ""} className={inputCls}>
            <option value="">ทุกสถานะ</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <button className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">ค้นหา</button>
          <Link href="/products" className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100">
            ล้าง
          </Link>
        </form>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">ชื่อสินค้า</th>
                <th className="px-4 py-3">หมวดหมู่</th>
                <th className="px-4 py-3 text-right">ราคา</th>
                <th className="px-4 py-3 text-right">สต็อก</th>
                <th className="px-4 py-3">สถานะ</th>
                {canWrite(role) && <th className="px-4 py-3 text-right">จัดการ</th>}
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
              {data.items.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    {p.description && <div className="text-xs text-gray-500">{p.description}</div>}
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 text-right">
                    {p.price.toLocaleString("th-TH", { style: "currency", currency: "THB" })}
                  </td>
                  <td className={`px-4 py-3 text-right ${p.stock < 10 ? "font-semibold text-red-600" : ""}`}>
                    {p.stock}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        p.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </td>
                  {canWrite(role) && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link href={`/products/${p.id}/edit`} className="rounded bg-blue-50 px-3 py-1 text-blue-600 hover:bg-blue-100">
                          แก้ไข
                        </Link>
                        {canDelete(role) && <DeleteButton action={deleteProduct.bind(null, p.id)} />}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>ทั้งหมด {data.total} รายการ · หน้า {data.page}/{data.totalPages}</span>
          <div className="flex gap-2">
            {data.page > 1 && (
              <Link href={href(data.page - 1)} className="rounded border bg-white px-3 py-1 hover:bg-gray-100">
                ← ก่อนหน้า
              </Link>
            )}
            {data.page < data.totalPages && (
              <Link href={href(data.page + 1)} className="rounded border bg-white px-3 py-1 hover:bg-gray-100">
                ถัดไป →
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
