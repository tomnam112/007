# Next.js RBAC + CRUD + REST API (NextAuth v5 · Prisma · SQLite · Zod)

## เริ่มใช้งาน
```
npm install
npm run db:setup
npm run dev
```
เปิด http://localhost:3000

บัญชีทดสอบ (สร้างโดย seed): 
| Role  | Email             | Password |
|-------|-------------------|----------|
| ADMIN | admin@example.com | admin123 |
| STAFF | staff@example.com | staff123 |
| USER  | user@example.com  | user123  |

## คุณสมบัติ
1. **CRUD** สินค้า: `/products`, `/products/new`, `/products/[id]/edit`, ลบในหน้ารายการ
2. **Validation** ด้วย Zod (ฝั่งเซิร์ฟเวอร์ ใช้ร่วมกันทั้งฟอร์มและ API) รวมถึงหน้า Sign up
3. **Authentication / Authorization**: Email+Password, GitHub, JWT session, สิทธิ์ตาม role
4. **Search + Filter + Pagination**: ค้นหาชื่อ/รายละเอียด กรองหมวดหมู่และสถานะ
5. **REST API**: GET / POST / PUT / DELETE ที่ `/api/products` (ดูหน้า `/api-docs`)

## สิทธิ์
| การกระทำ | USER | STAFF | ADMIN |
|---|---|---|---|
| ดูรายการ/ค้นหา | ✔ | ✔ | ✔ |
| เพิ่ม/แก้ไข | ✘ | ✔ | ✔ |
| ลบ | ✘ | ✘ | ✔ |
| หน้า /admin | ✘ | ✘ | ✔ |

## API
| Method | Path | สิทธิ์ |
|---|---|---|
| GET | /api/products?q=&category=&status=&page=&pageSize= | login |
| POST | /api/products | ADMIN, STAFF |
| GET | /api/products/:id | login |
| PUT | /api/products/:id | ADMIN, STAFF |
| DELETE | /api/products/:id | ADMIN |

รหัสตอบกลับ: 200/201 สำเร็จ · 400 ข้อมูลไม่ผ่าน validation · 401 ยังไม่ login · 403 สิทธิ์ไม่พอ · 404 ไม่พบข้อมูล

ตัวอย่าง body (POST/PUT):
```json
{ "name": "หูฟังบลูทูธ", "description": "", "price": 1290, "stock": 25, "category": "อิเล็กทรอนิกส์", "status": "ACTIVE" }
```
API ใช้ session cookie จึงทดสอบง่ายที่สุดใน Console ของเบราว์เซอร์หลัง login:
```js
fetch("/api/products", { method: "POST", headers: {"Content-Type":"application/json"},
  body: JSON.stringify({ name:"ทดสอบ", price:100, stock:5, category:"อื่น ๆ", status:"ACTIVE" }) }).then(r=>r.json()).then(console.log)
```

## GitHub Login (ไม่บังคับ)
สร้าง OAuth App ที่ GitHub → Callback URL: `http://localhost:3000/api/auth/callback/github` แล้วใส่ `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` ใน `.env`

## คำสั่งอื่น
`npm run db:studio` ดู/แก้ข้อมูล · `npm run db:seed` seed ใหม่
