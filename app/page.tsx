import Link from "next/link";
import { auth, signOut } from "@/app/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Next.js RBAC Demo</h1>

        {session?.user ? (
          <>
            <p className="mb-1 text-gray-700">สวัสดี {session.user.name ?? session.user.email}</p>
            <p className="mb-6 text-sm text-gray-500">Role: {session.user.role}</p>
            <div className="flex justify-center gap-3">
              <Link href="/products" className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700">
                สินค้า
              </Link>
              <Link href="/dashboard" className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-100">
                Dashboard
              </Link>
              <Link href="/admin" className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-100">
                Admin
              </Link>
            </div>
            <form
              className="mt-4"
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="text-sm text-red-600 hover:underline">ออกจากระบบ</button>
            </form>
          </>
        ) : (
          <>
            <p className="mb-6 text-gray-600">กรุณาเข้าสู่ระบบ</p>
            <div className="flex justify-center gap-3">
              <Link href="/login" className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700">
                Login
              </Link>
              <Link href="/signup" className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-100">
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
