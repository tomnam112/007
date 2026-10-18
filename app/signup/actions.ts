"use server";

import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";
import { signUpSchema } from "@/app/lib/validations";

export type SignUpState = {
  error?: string;
  success?: boolean;
};

export async function signUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
    confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email นี้ถูกใช้งานแล้ว" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    // ผู้สมัครใหม่เป็น USER เสมอ
    data: { name, email, passwordHash, role: "USER" },
  });

  return { success: true };
}
