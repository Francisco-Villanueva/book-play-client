import { Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth.context";
import { LoginPage } from "@/pages/auth/login/LoginPage";
import { RegisterPage } from "@/pages/auth/register/RegisterPage";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { AdminPage } from "./pages/admin/AdminPage";
import { CreateBusinessPage } from "./pages/admin/business/components/create/CreateBusinessPage";
import { Navbar } from "./components/common/Navbar";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/new-account"
        element={
          <ProtectedRoute>
            <Navbar showRoutes={false} />
            <CreateBusinessPage />
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
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
