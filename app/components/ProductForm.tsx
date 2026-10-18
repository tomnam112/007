"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  CATEGORIES,
  STATUSES,
  STATUS_LABEL,
  type ProductFormState,
} from "@/app/lib/validations";

type Defaults = {
  name?: string;
  description?: string;
  price?: string | number;
  stock?: string | number;
  category?: string;
  status?: string;
};

type Props = {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  defaults?: Defaults;
  submitLabel: string;
};

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none";

export default function ProductForm({ action, defaults = {}, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {} as ProductFormState);

  const val = (k: keyof Defaults) =>
    (state.values?.[k] ?? defaults[k] ?? "").toString();
  const err = (k: string) => state.fieldErrors?.[k]?.[0];

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">ชื่อสินค้า</label>
        <input id="name" name="name" defaultValue={val("name")} className={inputCls} />
        {err("name") && <p className="mt-1 text-sm text-red-600">{err("name")}</p>}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">รายละเอียด</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={val("description")}
          className={inputCls}
        />
        {err("description") && <p className="mt-1 text-sm text-red-600">{err("description")}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">ราคา (บาท)</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={val("price")}
            className={inputCls}
          />
          {err("price") && <p className="mt-1 text-sm text-red-600">{err("price")}</p>}
        </div>

        <div>
          <label htmlFor="stock" className="mb-1 block text-sm font-medium">จำนวนในสต็อก</label>
          <input
            id="stock"
            name="stock"
            type="number"
            step="1"
            defaultValue={val("stock")}
            className={inputCls}
          />
          {err("stock") && <p className="mt-1 text-sm text-red-600">{err("stock")}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">หมวดหมู่</label>
          <select id="category" name="category" defaultValue={val("category")} className={inputCls}>
            <option value="">-- เลือกหมวดหมู่ --</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {err("category") && <p className="mt-1 text-sm text-red-600">{err("category")}</p>}
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">สถานะ</label>
          <select id="status" name="status" defaultValue={val("status") || "ACTIVE"} className={inputCls}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          {err("status") && <p className="mt-1 text-sm text-red-600">{err("status")}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "กำลังบันทึก..." : submitLabel}
        </button>
        <Link href="/products" className="rounded-lg border px-5 py-2.5 text-gray-700 hover:bg-gray-100">
          ยกเลิก
        </Link>
      </div>
    </form>
  );
}
