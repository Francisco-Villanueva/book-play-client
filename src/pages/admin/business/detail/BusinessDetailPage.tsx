import { useParams } from "react-router";

import { BusinessDetail } from "../components/BusinessDetail";

// ── Main page ─────────────────────────────────────────────────────────────────
export function BusinessDetailPage() {
  const { businessId } = useParams<{ businessId: string }>();

  return <BusinessDetail businessId={businessId!} />;
}
