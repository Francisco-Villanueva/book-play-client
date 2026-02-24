import { Navbar } from "@/components/common/Navbar";
import { Route, Routes } from "react-router";
import { adminRoutes } from "@/routes/home.routes";

export function AdminPage() {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Routes>
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.relativePath}
              element={route.element}
            />
          ))}
        </Routes>
      </div>
    </div>
  );
}
