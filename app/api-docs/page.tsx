import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import Navbar from "@/app/components/Navbar";

const endpoints = [
  { method: "GET", path: "/api/products", who: "ทุกคนที่ login", desc: "รายการสินค้า รองรับ ?q= &category= &status= &page= &pageSize=" },
  { method: "POST", path: "/api/products", who: "ADMIN, STAFF", desc: "เพิ่มสินค้า (JSON body)" },
  { method: "GET", path: "/api/products/:id", who: "ทุกคนที่ login", desc: "ดูสินค้าตาม id" },
  { method: "PUT", path: "/api/products/:id", who: "ADMIN, STAFF", desc: "แก้ไขสินค้า (JSON body เต็ม)" },
  { method: "DELETE", path: "/api/products/:id", who: "ADMIN", desc: "ลบสินค้า" },
];

const color: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
};

export default async function ApiDocsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">API Documentation</h1>
        <p className="mb-6 text-gray-600">
          ทุก endpoint ต้อง login ก่อน (ใช้ session cookie) ถ้าไม่ login จะได้ 401 ถ้าสิทธิ์ไม่พอจะได้ 403
        </p>

        <div className="space-y-3">
          {endpoints.map((e) => (
            <div key={e.method + e.path} className="rounded-xl bg-white p-4 shadow">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${color[e.method]}`}>{e.method}</span>
                <code className="font-mono text-sm">{e.path}</code>
                <span className="ml-auto text-xs text-gray-500">สิทธิ์: {e.who}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{e.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">ตัวอย่าง JSON (POST / PUT)</h2>
          <pre className="overflow-x-auto rounded bg-gray-900 p-4 text-xs text-gray-100">{`{
  "name": "หูฟังบลูทูธ",
  "description": "หูฟังไร้สาย",
  "price": 1290,
  "stock": 25,
  "category": "อิเล็กทรอนิกส์",
  "status": "ACTIVE"
}`}</pre>
          <p className="mt-3 text-sm text-gray-600">
            ทดสอบได้ที่ Console ของเบราว์เซอร์ (หลัง login):
          </p>
          <pre className="mt-1 overflow-x-auto rounded bg-gray-900 p-4 text-xs text-gray-100">{`fetch("/api/products?q=เมาส์").then(r => r.json()).then(console.log)`}</pre>
        </div>
      </main>
    </div>
  );
}
