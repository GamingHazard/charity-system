export const roles = ["admin", "blogger", "viewer"] as const;

export type UserRole = (typeof roles)[number];

export type Permission =
  | "dashboard.view"
  | "children.view"
  | "children.manage"
  | "sponsorships.view"
  | "sponsorships.manage"
  | "staff.view"
  | "staff.manage"
  | "blogs.view"
  | "blogs.manage"
  | "events.view"
  | "events.manage"
  | "gallery.view"
  | "gallery.manage"
  | "content.view"
  | "content.manage"
  | "data.export"
  | "users.manage";

const rolePermissions: Record<UserRole, readonly Permission[]> = {
  admin: [
    "dashboard.view",
    "children.view",
    "children.manage",
    "sponsorships.view",
    "sponsorships.manage",
    "staff.view",
    "staff.manage",
    "blogs.view",
    "blogs.manage",
    "events.view",
    "events.manage",
    "gallery.view",
    "gallery.manage",
    "content.view",
    "content.manage",
    "data.export",
    "users.manage",
  ],
  blogger: [
    "dashboard.view",
    "blogs.view",
    "blogs.manage",
    "events.view",
    "events.manage",
    "gallery.view",
    "gallery.manage",
    "data.export",
  ],
  viewer: [
    "dashboard.view",
    "children.view",
    "sponsorships.view",
    "staff.view",
    "blogs.view",
    "events.view",
    "gallery.view",
    "content.view",
    "data.export",
  ],
};

export function normalizeRole(value: unknown): UserRole | null {
  const role = String(value || "").toLowerCase();
  return roles.includes(role as UserRole) ? (role as UserRole) : null;
}

export function hasPermission(
  role: UserRole | string | null | undefined,
  permission: Permission,
) {
  const normalizedRole = normalizeRole(role);
  return normalizedRole
    ? rolePermissions[normalizedRole].includes(permission)
    : false;
}
