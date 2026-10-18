import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import Navbar from "@/app/components/Navbar";
import ProductForm from "@/app/components/ProductForm";
import { canWrite } from "@/app/lib/permissions";
import { createProduct } from "@/app/products/actions";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!canWrite(session.user.role)) redirect("/unauthorized");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="mb-6 text-2xl font-bold">เพิ่มสินค้า</h1>
          <ProductForm action={createProduct} submitLabel="บันทึก" />
        </div>
      </main>
    </div>
  );
}
