import SideBar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';
import WelcomeCard from '@/components/dashboard/welcome-card';
import SecondContent from '@/components/dashboard/second-content';

const userData = {
  name: "Regina Joan Medea Jati Laksono",
  avatar: "/images/teacher/faris.jpg"
};
const enrolledClassData = [
  {
    id: 1,
    name: "Intermediate dan I Entry data I Bundle",
    status: "incomplete",
    message: "Hmm, daftar kelasmu masih kosong nih!",
    description: "Gimana kalo kita isi sekarang? Ada banyak kelas keren yang bisa kamu pilih!"
  },
  {
    id: 2,
    name: "Satu lagi biar komplit!",
    status: "incomplete",
    message: "Masih ada slot kosong nih, isi sekarang biar makin mantap!",
    description: ""
  }
];

export default function Dashboard() {
  return (
    <div className="flex bg-gray-900 text-white">
      {/* Sidebar - fixed */}
      <SideBar />
      <div className="flex-grow ml-48">
        <DashboardHeader data={userData}/>
        <main className="p-6 min-h-screen">
          <WelcomeCard data={userData}/>
          <SecondContent data={enrolledClassData}/>
        </main>
      </div>
    </div>
  );
}