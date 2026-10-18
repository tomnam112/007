import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/auth";
import Navbar from "@/app/components/Navbar";
import ProductForm from "@/app/components/ProductForm";
import prisma from "@/app/lib/prisma";
import { canWrite } from "@/app/lib/permissions";
import { updateProduct } from "@/app/products/actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!canWrite(session.user.role)) redirect("/unauthorized");

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="mb-6 text-2xl font-bold">แก้ไขสินค้า</h1>
          <ProductForm
            action={updateProduct.bind(null, product.id)}
            defaults={product}
            submitLabel="บันทึกการแก้ไข"
          />
        </div>
      </main>
    </div>
  );
}
