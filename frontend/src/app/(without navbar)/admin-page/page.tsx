export const dynamic = 'force-dynamic';
import ClassTracker from "@/components/admin-page/class-tracker";
import WelcomeCardz from "@/components/admin-page/welcome-cardz";
import TotalTracker from "@/components/admin-page/total-tracker";
import GetAllEnrollments from "@/components/admin-page/get-all-enrollments";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch (err) {
    if ((err as Error).message === "NO_TOKEN") {
      redirect("/login");
    }
    redirect("/");
  }
  return (
    <div className="px-14 py-7">
      <WelcomeCardz />
      <div className="flex gap-7 mt-6 ">
        <div className="w-120">
          <TotalTracker />
        </div>
        <ClassTracker />
      </div>
      <div className="mt-6 ">
        <GetAllEnrollments />
      </div>
    </div>
  );
}
