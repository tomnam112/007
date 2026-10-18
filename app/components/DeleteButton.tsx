"use client";

export default function DeleteButton({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("ยืนยันการลบสินค้านี้?")) e.preventDefault();
      }}
    >
      <button className="rounded bg-red-50 px-3 py-1 text-red-600 hover:bg-red-100">
        ลบ
      </button>
    </form>
  );
}
