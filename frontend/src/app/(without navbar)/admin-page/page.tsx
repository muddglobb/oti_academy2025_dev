import ClassTracker from "@/components/admin-page/class-tracker";
import WelcomeCardz from "@/components/admin-page/welcome-cardz";
import TotalTracker from "@/components/admin-page/total-tracker";
export default function AdminPage() {
  return (
    <div className="px-14 py-7">
      <WelcomeCardz />
      <div className="flex gap-7 mt-6">
        <div className="w-120">
          <TotalTracker />
        </div>
        <ClassTracker />
      </div>
    </div>
  );
}
