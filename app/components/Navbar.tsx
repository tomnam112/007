import Link from "next/link";
import { auth, signOut } from "@/app/auth";

export default async function Navbar() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-5 text-sm font-medium text-gray-700">
          <Link href="/" className="text-base font-bold text-gray-900">
            RBAC Demo
          </Link>
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link href="/products" className="hover:text-blue-600">สินค้า</Link>
          {role === "ADMIN" && (
            <Link href="/admin" className="hover:text-blue-600">Admin</Link>
          )}
          <Link href="/api-docs" className="hover:text-blue-600">API</Link>
        </nav>

        {session?.user && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">
              {session.user.name ?? session.user.email}
              <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                {role}
              </span>
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="rounded border px-3 py-1 text-gray-700 hover:bg-gray-100">
                ออกจากระบบ
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
