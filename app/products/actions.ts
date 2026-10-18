"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import prisma from "@/app/lib/prisma";
import { canDelete, canWrite } from "@/app/lib/permissions";
import {
  formDataToObject,
  productSchema,
  type ProductFormState,
} from "@/app/lib/validations";

function readValues(fd: FormData) {
  const v: Record<string, string> = {};
  for (const [k, val] of fd.entries()) if (typeof val === "string") v[k] = val;
  return v;
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!canWrite(session.user.role)) return { error: "คุณไม่มีสิทธิ์เพิ่มสินค้า" };

  const parsed = productSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: readValues(formData),
    };
  }

  await prisma.product.create({ data: parsed.data });

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!canWrite(session.user.role)) return { error: "คุณไม่มีสิทธิ์แก้ไขสินค้า" };

  const parsed = productSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: readValues(formData),
    };
  }

  try {
    await prisma.product.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "ไม่พบสินค้า หรือบันทึกไม่สำเร็จ" };
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}

export async function deleteProduct(id: string, _formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!canDelete(session.user.role)) redirect("/unauthorized");

  await prisma.product.deleteMany({ where: { id } });

  revalidatePath("/products");
  revalidatePath("/dashboard");
}
