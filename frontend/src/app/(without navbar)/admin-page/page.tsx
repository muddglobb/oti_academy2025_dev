import ClassTracker from "@/components/admin-page/class-tracker"
import WelcomeCardz from "@/components/admin-page/welcome-cardz"
export default function AdminPage() {
  return (
    <div className="px-14 py-7">
      <WelcomeCardz />
      <ClassTracker />
    </div>
  )
}
