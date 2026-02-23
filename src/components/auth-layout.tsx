import { type ReactNode } from "react";
import { Check } from "lucide-react";

// Overhead football pitch — the signature element unique to this product.
// Rendered as subtle white geometry on the brand panel.
const PitchDecoration = () => (
  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 pointer-events-none select-none">
    <svg
      width="340"
      height="500"
      viewBox="0 0 300 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-[0.14]"
    >
      {/* Outer boundary */}
      <rect x="20" y="10" width="260" height="430" rx="4" stroke="white" strokeWidth="2.5" />
      {/* Halfway line */}
      <line x1="20" y1="225" x2="280" y2="225" stroke="white" strokeWidth="2" />
      {/* Center circle */}
      <circle cx="150" cy="225" r="52" stroke="white" strokeWidth="2" />
      {/* Center spot */}
      <circle cx="150" cy="225" r="4" fill="white" />
      {/* Top penalty area */}
      <rect x="80" y="10" width="140" height="68" stroke="white" strokeWidth="1.5" />
      {/* Top 6-yard box */}
      <rect x="112" y="10" width="76" height="27" stroke="white" strokeWidth="1.5" />
      {/* Bottom penalty area */}
      <rect x="80" y="372" width="140" height="68" stroke="white" strokeWidth="1.5" />
      {/* Bottom 6-yard box */}
      <rect x="112" y="413" width="76" height="27" stroke="white" strokeWidth="1.5" />
      {/* Penalty spots */}
      <circle cx="150" cy="60" r="3.5" fill="white" />
      <circle cx="150" cy="390" r="3.5" fill="white" />
    </svg>
  </div>
);

// Logomark: overhead court — circle boundary, halfway line, center circle.
// Works as an icon because it IS the product's world.
const LogoMark = () => (
  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" />
      <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.8" stroke="white" strokeWidth="1.5" />
    </svg>
  </div>
);

const FEATURES = [
  "Reservas en línea sin WhatsApp",
  "Turnos y canchas en un panel",
  "Tu complejo abierto las 24 horas",
];

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* ── Brand panel ── hidden on mobile */}
      <div
        className="hidden lg:flex flex-col shrink-0 w-[440px] xl:w-[520px] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(155deg, oklch(0.52 0.18 148) 0%, oklch(0.30 0.13 152) 60%, oklch(0.19 0.09 158) 100%)",
        }}
      >
        <PitchDecoration />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-white font-bold text-xl tracking-tight">
              Book & Play
            </span>
          </div>

          {/* Main copy — anchored to the bottom third */}
          <div className="mt-auto">
            <p className="text-emerald-300 text-sm font-semibold uppercase tracking-widest mb-4">
              Gestión deportiva
            </p>
            <h1 className="text-[2.6rem] xl:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-5">
              Tu complejo,
              <br />
              en un solo lugar
            </h1>
            <p className="text-emerald-100/80 text-lg leading-relaxed mb-10">
              Canchas, turnos y reservas gestionados de forma simple y
              profesional.
            </p>

            {/* Feature list */}
            <ul className="space-y-3.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-emerald-100 text-sm font-medium">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom credit */}
          <p className="text-emerald-400/60 text-xs mt-12">
            © 2026 Book & Play
          </p>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Mobile-only top bar */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.8" />
              <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="1.8" />
              <circle cx="10" cy="10" r="2.8" stroke="white" strokeWidth="1.8" />
            </svg>
          </div>
          <span className="font-bold text-foreground">Book & Play</span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
          <div className="w-full max-w-[360px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
