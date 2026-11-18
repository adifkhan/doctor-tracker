import { LayoutDashboard, Stethoscope, Users } from "lucide-react";

// export const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

// Must match the cookie name the API sets
export const AUTH_COOKIE = "dt_token";

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const MAX_SELECT_DOCTORS = 50;

export const GENDERS = ["male", "female", "other"] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patients", label: "Patients", icon: Users },
] as const;
