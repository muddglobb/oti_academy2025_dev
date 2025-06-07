export const classData: Record<
  string,
  {
    slug: string;
    image: string;
    teacher1: string;
    teacher2: string;
    desc: string;
  }
> = {
  "Web Development": {
    slug: "web-development",
    image: "/logo-perkelas/webdev.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Belajar membuat UI dari nol, mulai dari HTML, CSS, React, hingga Tailwind & MUI. Cocok untuk pemula yang ingin membangun halaman web responsif, memahami dasar komponen React, dan eksplorasi styling modern.",
  },
  "Software Engineering": {
    slug: "software-engineering",
    image: "/logo-perkelas/softeng.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Kuasai pembuatan aplikasi web modern lengkap dari autentikasi hingga fitur CRUD lewat praktik langsung dan studi kasus nyata. Jadi developer full-stack handal dengan pengalaman yang keren.",
  },
  "Data Science & Artificial Intelligence": {
    slug: "data-science&artificial-intelligence",
    image: "/logo-perkelas/data.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Belajar Data Science dan AI dari nol hingga siap ikut proyek dan kompetisi. DSAI Bootcamp membimbingmu step-by-step dari dasar hingga membangun model AI siap industri.",
  },
  "UI/UX": {
    slug: "ui-ux",
    image: "/logo-perkelas/uiux.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "",
    desc : "Mulai dari mengubah PRD jadi desain, membuat mock-up, wireframe, hingga memahami UX laws dan desain yang aksesibel. Belajar secara fleksibel lewat modul online, tugas, konsultasi, dan proyek akhir yang bisa jadi portofolio.",
  },
  "Cyber Security": {
    slug: "cyber-security",
    image: "/logo-perkelas/cysec-inter.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Masuki dunia ethical hacking dan praktik langsung tahapan penetration testing, dari reconnaissance hingga post-exploitation, lengkap dengan penyusunan laporan uji keamanan secara profesional.",
  },
  "Basic Python": {
    slug: "basic-python",
    image: "/logo-perkelas/python.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "",
    desc: "Pelajari dasar-dasar pemrograman Python, mulai dari sintaks dasar hingga OOP dan struktur data. Materi disusun secara bertahap dan mudah diikuti cocok untuk pemula dengan studi kasus menarik.",
  },
  "Competitive Programming": {
    slug: "competitive-programming",
    image: "/logo-perkelas/cp.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Mengenali dasar-dasar Competitive Programming secara bertahap mulai dari algoritma, struktur data, hingga graf. Dirancang ringkas dan menantang, cocok untuk pemula dan ditutup dengan konteks sebagai tugas akhir.",
  },
  "Game Development": {
    slug: "game-development",
    image: "/logo-perkelas/gamedev.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Menjelajahi dunia game development dari merancang ide, Game Design Document (GDD), hingga membangun prototype game dengan GDevelop. Materi lengkap dan mudah diikuti, cocok untuk pemula.",
  },
  "Fundamental Cyber Security": {
    slug: "fundamental-cyber-security",
    image: "/logo-perkelas/cysec-entry.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Masuki dunia cybersecurity dengan materi praktis dan menyenangkan, mulai dari Linux, forensik, web exploitation, kriptografi, hingga OSINT. Ditutup dengan praktik langsung lewat picoCTF. Materi ringkas dan mudah dipahami, cocok untuk pemula. ",
  },
  "Graphic Design": {
    slug: "graphic-design",
    image: "/logo-perkelas/graphic.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Belajar dasar desain grafis mulai dari elemen visual, warna, hingga layout. Lewat studi kasus dan praktik di Figma, kamu akan buat berbagai konten secara terarah dan bermakna.",
  },
  "Bundle Web Development + Software Engineering": {
    slug: "web-development+software-engineering",
    image: "/logo-perkelas/graphic.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Kuasai pembuatan UI dan aplikasi web modern dari basic hingga intermediate dengan React, Tailwind, dan MUI. Praktik langsung buat halaman responsif, autentikasi, dan fitur CRUD.",
  },
  "Bundle Python + Data Science & Artificial Intelligence": {
    slug: "python+data-science&artificial-intelligence",
    image: "/logo-perkelas/graphic.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Pelajari pemrograman Python dan Data Science & AI dari basic hingga intermediate. Mulai dari sintaks dasar, OOP, struktur data, hingga membangun model AI siap industri melalui studi kasus menarik dan bimbingan step-by-step untuk persiapan proyek dan kompetisi nyata.",
  },
  "Bundle Graphic Design + UI/UX": {
    slug: "graphic-design+ui-ux",
    image: "/logo-perkelas/graphic.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Belajar desain dari basic hingga intermediate mulai dari elemen visual, warna, layout, hingga UX, wireframe, dan desain aksesibel. Praktik langsung di Figma, ubah PRD jadi desain, dan bangun portofolio lewat proyek akhir.",
  },
  "Bundle Fundamental Cyber Security + Cyber Security": {
    slug: "fundamental-cyber-security+cyber-security",
    image: "/logo-perkelas/graphic.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
    desc: "Belajar cybersecurity dan ethical hacking dari basic hingga intermediate, mulai dari OSINT, forensik, web exploit, hingga penetration testing dan pembuatan laporan profesional.",
  }
};

export const getSlugByTitle = (title: string): string => {
  return classData[title]?.slug || "";
};

export const getImageByTitle = (title: string): string => {
  return classData[title]?.image || "/person-placeholder.jpeg";
};

export const getFirstTeacher = (title: string): string => {
  return classData[title]?.teacher1 || "";
};

export const getSecTeacher = (title: string): string => {
  return classData[title]?.teacher2 || "";
};

export const getDescByTitle= (title: string): string => {
  return classData[title]?.desc || "";
};