import { BusinessPage } from "@/pages/admin/business/BusinessPage";
import { CreateBusinessPage } from "@/pages/admin/business/components/create/CreateBusinessPage";
import { HomePage } from "@/pages/admin/home/HomePage";

import { Building, Home } from "lucide-react";
import type { JSX } from "react";

export type TRoute = {
  path: string;
  label: string;
  icon?: JSX.Element;
  element: JSX.Element;
  rolesAccess?: string[];
  vissibleNavbar: boolean;
};
export const homeRoutes: TRoute[] = [
  {
    path: "/",
    label: "Inicio",
    element: <HomePage />,
    icon: <Home />,
    vissibleNavbar: true,
  },
  {
    path: "/businesses",
    label: "Negocio",
    element: <BusinessPage />,
    icon: <Building />,
    vissibleNavbar: true,
  },
  {
    path: "/businesses/new",
    label: "Nuevo Negocio",
    element: <CreateBusinessPage />,
    vissibleNavbar: false,
  },
];
