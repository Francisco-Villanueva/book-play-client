import { Navbar } from "@/components/common/Navbar";
import { useBusinessQuery } from "@/queries/business/get";
import { Navigate, Route, Routes } from "react-router";
import { CreateBusinessPage } from "../business/create/CreateBusinessPage";
import { BusinessPage } from "../business/BusinessPage";

export function HomePage() {
  const businessQuery = useBusinessQuery();

  if (businessQuery.data && businessQuery.data.length === 0)
    return <Navigate to={"/businesses/new"} replace />;
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/businesses/new" element={<CreateBusinessPage />} />
        <Route path="/businesses" element={<BusinessPage />} />
      </Routes>
    </div>
  );
}
