import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth.context";
import { adminRoutes } from "@/routes/home.routes";
import { LogOut } from "lucide-react";
import { sileo } from "sileo";

import { Link, useNavigate } from "react-router";

export function Navbar({ showRoutes = true }: { showRoutes?: boolean }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    sileo.info({ title: "Sesión cerrada" });
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky  top-0 z-20 bg-card/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.8" />
              <line
                x1="2"
                y1="10"
                x2="18"
                y2="10"
                stroke="white"
                strokeWidth="1.8"
              />
              <circle
                cx="10"
                cy="10"
                r="2.8"
                stroke="white"
                strokeWidth="1.8"
              />
            </svg>
          </div>
          <span className="font-bold text-foreground text-[0.95rem]">
            Book & Play
          </span>
        </div>
        {showRoutes ? (
          <nav className="flex">
            {adminRoutes.map((route) =>
              route.vissibleNavbar ? (
                <Link
                  key={route.path}
                  to={route.path}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                  replace
                >
                  <Button
                    key={route.path}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {route.icon}
                    <span className="ml-2">{route.label}</span>
                  </Button>
                </Link>
              ) : null,
            )}
          </nav>
        ) : null}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  );
}
