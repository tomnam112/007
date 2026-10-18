import { z } from "zod";

export const CATEGORIES = [
  "อิเล็กทรอนิกส์",
  "เครื่องเขียน",
  "เครื่องใช้ในบ้าน",
  "อาหารและเครื่องดื่ม",
  "อื่น ๆ",
] as const;

export const STATUSES = ["ACTIVE", "INACTIVE"] as const;

export const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "พร้อมขาย",
  INACTIVE: "ปิดการขาย",
};

export const productSchema = z.object({
  name: z
    .string({ required_error: "กรุณากรอกชื่อสินค้า" })
    .trim()
    .min(2, "ชื่อสินค้าต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(100, "ชื่อสินค้ายาวเกิน 100 ตัวอักษร"),
  description: z
    .string()
    .trim()
    .max(500, "รายละเอียดยาวเกิน 500 ตัวอักษร")
    .optional()
    .default(""),
  price: z.coerce
    .number({ invalid_type_error: "กรุณากรอกราคาเป็นตัวเลข" })
    .min(0, "ราคาต้องไม่ติดลบ")
    .max(10_000_000, "ราคาสูงเกินกำหนด"),
  stock: z.coerce
    .number({ invalid_type_error: "กรุณากรอกจำนวนเป็นตัวเลข" })
    .int("จำนวนต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนต้องไม่ติดลบ")
    .max(1_000_000, "จำนวนสูงเกินกำหนด"),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "กรุณาเลือกหมวดหมู่" }),
  }),
  status: z.enum(STATUSES, {
    errorMap: () => ({ message: "สถานะไม่ถูกต้อง" }),
  }),
});

export type ProductInput = z.infer<typeof productSchema>;

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
      .max(60, "ชื่อยาวเกิน 60 ตัวอักษร"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("รูปแบบ Email ไม่ถูกต้อง"),
    password: z
      .string()
      .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
      .max(72, "รหัสผ่านยาวเกิน 72 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

/** แปลง FormData เป็น object (ช่องว่าง = undefined) */
export function formDataToObject(fd: FormData) {
  const o: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === "string") o[k] = v.trim() === "" ? undefined : v;
  }
  return o;
}
