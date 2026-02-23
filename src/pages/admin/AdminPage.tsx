import { Navbar } from "@/components/common/Navbar";
import { useBusinessQuery } from "@/queries/business/get";
import { Navigate, Route, Routes } from "react-router";
import { homeRoutes } from "@/routes/home.routes";

export function AdminPage() {
  const businessQuery = useBusinessQuery();

  if (businessQuery.data && businessQuery.data.length === 0)
    return <Navigate to={"/businesses/new"} replace />;
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <Routes>
          {homeRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </div>
  );
}
