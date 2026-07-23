import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAdminStats } from "@/lib/adminData";
import { AdminLoginForm } from "./AdminLoginForm";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminAuthenticated()) {
    return <AdminLoginForm />;
  }

  const stats = await getAdminStats();
  return <AdminDashboard stats={stats} />;
}
