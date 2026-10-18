import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const accounts = [
    { name: "Admin", email: "admin@example.com", password: "admin123", role: "ADMIN" },
    { name: "Staff", email: "staff@example.com", password: "staff123", role: "STAFF" },
    { name: "User", email: "user@example.com", password: "user123", role: "USER" },
  ];

  for (const a of accounts) {
    const passwordHash = await bcrypt.hash(a.password, 12);
    await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: { name: a.name, email: a.email, passwordHash, role: a.role },
    });
    console.log(`✔ ${a.role}: ${a.email} / ${a.password}`);
  }

  if ((await prisma.product.count()) === 0) {
    const products = [
      ["หูฟังบลูทูธ", "หูฟังไร้สาย ตัดเสียงรบกวน", 1290, 25, "อิเล็กทรอนิกส์", "ACTIVE"],
      ["เมาส์ไร้สาย", "เมาส์ 2.4GHz แบตอึด", 390, 60, "อิเล็กทรอนิกส์", "ACTIVE"],
      ["คีย์บอร์ดเมคานิคอล", "สวิตช์บลู ไฟ RGB", 1590, 8, "อิเล็กทรอนิกส์", "ACTIVE"],
      ["สายชาร์จ USB-C", "ยาว 1 เมตร ชาร์จเร็ว", 129, 200, "อิเล็กทรอนิกส์", "ACTIVE"],
      ["ปากกาเจล 0.5", "หมึกดำ แพ็ก 10 ด้าม", 79, 150, "เครื่องเขียน", "ACTIVE"],
      ["สมุดโน้ต A5", "กระดาษ 80 แกรม 100 แผ่น", 59, 5, "เครื่องเขียน", "ACTIVE"],
      ["แฟ้มสันห่วง", "ขนาด A4 สีน้ำเงิน", 45, 0, "เครื่องเขียน", "INACTIVE"],
      ["หม้อหุงข้าวดิจิทัล", "ความจุ 1.8 ลิตร", 1890, 12, "เครื่องใช้ในบ้าน", "ACTIVE"],
      ["พัดลมตั้งโต๊ะ", "ปรับได้ 3 ระดับ", 590, 30, "เครื่องใช้ในบ้าน", "ACTIVE"],
      ["กาต้มน้ำไฟฟ้า", "ความจุ 1.7 ลิตร ตัดไฟอัตโนมัติ", 690, 3, "เครื่องใช้ในบ้าน", "ACTIVE"],
      ["กาแฟคั่วบด", "อาราบิก้า 250 กรัม", 220, 40, "อาหารและเครื่องดื่ม", "ACTIVE"],
      ["ชาเขียวญี่ปุ่น", "กล่อง 20 ซอง", 150, 0, "อาหารและเครื่องดื่ม", "INACTIVE"],
    ];
    for (const [name, description, price, stock, category, status] of products) {
      await prisma.product.create({ data: { name, description, price, stock, category, status } });
    }
    console.log(`✔ สร้างสินค้าตัวอย่าง ${products.length} รายการ`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
