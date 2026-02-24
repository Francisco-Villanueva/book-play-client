import { BusinessPage } from "@/pages/admin/business/BusinessPage";
import { BusinessDetailPage } from "@/pages/admin/business/detail/BusinessDetailPage";
import { CreateBusinessPage } from "@/pages/admin/business/components/create/CreateBusinessPage";
import { HomePage } from "@/pages/admin/home/HomePage";
import { BookingsPage } from "@/pages/admin/bookings/BookingsPage";

import { Building, CalendarDays, Home } from "lucide-react";
import type { JSX } from "react";

export type TRoute = {
  path: string;
  relativePath: string;
  label: string;
  icon?: JSX.Element;
  element: JSX.Element;
  rolesAccess?: string[];
  vissibleNavbar: boolean;
};
export const adminRoutes: TRoute[] = [
  {
    path: "/admin",
    relativePath: "/",
    label: "Inicio",
    element: <HomePage />,
    icon: <Home />,
    vissibleNavbar: true,
  },
  {
    path: "/admin/bookings",
    relativePath: "/bookings",
    label: "Reservas",
    element: <BookingsPage />,
    icon: <CalendarDays />,
    vissibleNavbar: true,
  },
  {
    path: "/admin/businesses",
    relativePath: "/businesses",
    label: "Negocio",
    element: <BusinessPage />,
    icon: <Building />,
    vissibleNavbar: true,
  },
  {
    path: "/admin/businesses/new",
    relativePath: "/businesses/new",
    label: "Nuevo Negocio",
    element: <CreateBusinessPage />,
    vissibleNavbar: false,
  },
  {
    path: "/admin/businesses/:businessId",
    relativePath: "/businesses/:businessId",
    label: "Detalle del negocio",
    element: <BusinessDetailPage />,
    vissibleNavbar: false,
  },
];
