import { Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth.context";
import { LoginPage } from "@/pages/auth/login/LoginPage";
import { RegisterPage } from "@/pages/auth/register/RegisterPage";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { RequiresBusinessRoute } from "./components/routes/RequiresBusinessRoute";
import { NewAccountRoute } from "./components/routes/NewAccountRoute";
import { AdminPage } from "./pages/admin/AdminPage";
import { CreateBusinessPage } from "./pages/admin/business/components/create/CreateBusinessPage";
import { Navbar } from "./components/common/Navbar";
import { PublicBookingPage } from "./pages/public/PublicBookingPage";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RequiresBusinessRoute>
              <AdminPage />
            </RequiresBusinessRoute>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<PublicBookingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/new-account"
        element={
          <ProtectedRoute>
            <NewAccountRoute>
              <Navbar showRoutes={false} />
              <CreateBusinessPage />
            </NewAccountRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}
