export const canWrite = (role?: string) => role === "ADMIN" || role === "STAFF";
export const canDelete = (role?: string) => role === "ADMIN";
