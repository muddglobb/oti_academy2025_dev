export const classData: Record<
  string,
  {
    slug: string;
    image: string;
    teacher1: string;
    teacher2: string;
    teacher3: string; // ← properti baru
    desc: string;
    short: string;
    video: string;
  }
> = {
  "Web Development": {
    slug: "web-development",
    image: "/logo-perkelas/webdev.webp",
    teacher1: "/images/foto-orang/rehund.webp",
    teacher2: "",
    teacher3: "",
    desc: "Belajar membuat UI dari nol, mulai dari HTML, CSS, React, hingga Tailwind & MUI. Cocok untuk pemula yang ingin membangun halaman web responsif, memahami dasar komponen React, dan eksplorasi styling modern.",
    short: "Belajar UI dari nol: HTML, CSS, React, Tailwind, & MUI. Cocok untuk pemula yang ingin buat web responsif dan pahami komponen serta styling modern.",
    video: "https://drive.google.com/file/d/1ZEAkRfWSaQ3oRoexUeB2LSNo80LKssdu/preview",
  },
  "Software Engineering": {
    slug: "software-engineering",
    image: "/logo-perkelas/softeng.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/foto-orang/rehund.webp",
    teacher3: "",
    desc: "Kuasai pembuatan aplikasi web modern lengkap dari autentikasi hingga fitur CRUD lewat praktik langsung dan studi kasus nyata. Jadi developer full-stack handal dengan pengalaman yang keren.",
    short: "Kuasai aplikasi web modern dari autentikasi hingga CRUD lewat praktik dan studi kasus nyata. Jadi developer full-stack handal dengan pengalaman nyata.",
    video: "https://drive.google.com/file/d/1HKwlV2RODII0LSjIaqxJvP_6RcoMXutj/preview",
  },
  "Data Science & Artificial Intelligence": {
    slug: "data-science&artificial-intelligence",
    image: "/logo-perkelas/data.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/foto-orang/daffa.webp",
    teacher3: "",
    desc: "Belajar Data Science dan AI dari nol hingga siap ikut proyek dan kompetisi. DSAI Bootcamp membimbingmu step-by-step dari dasar hingga membangun model AI siap industri.",
    short: "Belajar Data Science & AI dari nol hingga siap ikut proyek dan kompetisi. DSAI Bootcamp bimbing step-by-step dari dasar hingga bangun model AI industri.",
    video: "https://drive.google.com/file/d/1wVwiwzpuOUOtqULb55bWJOKUuUwMiS-G/preview",
  },
  "UI/UX": {
    slug: "ui-ux",
    image: "/logo-perkelas/uiux.webp",
    teacher1: "/images/mentor-uiux.webp",
    teacher2: "/images/foto-orang/ken-bima.webp",
    teacher3: "",
    desc : "Mulai dari mengubah PRD jadi desain, membuat mock-up, wireframe, hingga memahami UX laws dan desain yang aksesibel. Belajar secara fleksibel lewat modul online, tugas, konsultasi, dan proyek akhir yang bisa jadi portofolio.",
    short: "Mulai dari mengubah PRD jadi desain, mock-up, wireframe, paham UX laws & desain aksesibel. Fleksibel lewat modul, konsultasi, & proyek akhir portofolio.",
    video: "https://drive.google.com/file/d/1yUSp-gbU83tUJAwUVKZSI00u1DNqf4tV/preview",
  },
  "Cyber Security": {
    slug: "cyber-security",
    image: "/logo-perkelas/cysec-inter.webp",
    teacher1: "/images/mentor-cysec.webp",
    teacher2: "/images/foto-orang/ahsan.webp",
    teacher3: "",
    desc: "Masuki dunia ethical hacking dan praktik langsung tahapan penetration testing, dari reconnaissance hingga post-exploitation, lengkap dengan penyusunan laporan uji keamanan secara profesional.",
    short: "Masuki dunia ethical hacking dan praktik langsung tahapan penetration testing, dari reconnaissance hingga post-exploitation, lengkap dengan penyusunan laporan uji keamanan secara profesional.",
    video: "https://drive.google.com/file/d/1UrVWt7Dje1q99sPh0zokoCIf6b8yNDmQ/preview",
  },
  "Basic Python": {
    slug: "basic-python",
    image: "/logo-perkelas/python.webp",
    teacher1: "/images/foto-orang/daffa.webp",
    teacher2: "",
    teacher3: "",
    desc: "Pelajari dasar-dasar pemrograman Python, mulai dari sintaks dasar hingga OOP dan struktur data. Materi disusun secara bertahap dan mudah diikuti cocok untuk pemula dengan studi kasus menarik.",
    short: "Pelajari dasar Python dari sintaks, OOP, hingga struktur data dengan materi bertahap dan studi kasus menarik, cocok untuk pemula.",
    video: "https://drive.google.com/file/d/1JMuaSdM4V_LDsbqdSGyMBQICOss9y98o/preview",
  },
  "Competitive Programming": {
    slug: "competitive-programming",
    image: "/logo-perkelas/cp.webp",
    teacher1: "/images/foto-orang/revy.webp",
    teacher2: "",
    teacher3: "",
    desc: "Mengenali dasar-dasar Competitive Programming secara bertahap mulai dari algoritma, struktur data, hingga graf. Dirancang ringkas dan menantang, cocok untuk pemula dan ditutup dengan konteks sebagai tugas akhir.",
    short: "Pelajari dasar-dasar Competitive Programming: algoritma, struktur data, graf. Materi ringkas, menantang, cocok pemula.",
    video: "https://drive.google.com/file/d/1RVWnPE0WI7b_Kx8bzlHqk-DqHWgMRPT0/preview",
  },
  "Game Development": {
    slug: "game-development",
    image: "/logo-perkelas/gamedev.webp",
    teacher1: "/images/foto-orang/thomas.webp",
    teacher2: "",
    teacher3: "",
    desc: "Menjelajahi dunia game development dari merancang ide, Game Design Document (GDD), hingga membangun prototype game dengan GDevelop. Materi lengkap dan mudah diikuti, cocok untuk pemula.",
    short: "Jelajahi game development dari ide, GDD, hingga buat prototype dengan GDevelop. Materi mudah diikuti dan cocok untuk pemula yang ingin mulai bikin game.",
    video: "https://drive.google.com/file/d/1d89cIoTb2j8GBg-0zrkZD9-S2Df4mo-x/preview",
  },
  "Fundamental Cyber Security": {
    slug: "fundamental-cyber-security",
    image: "/logo-perkelas/cysec-entry.webp",
    teacher1: "/images/foto-orang/ahsan.webp",
    teacher2: "",
    teacher3: "",
    desc: "Masuki dunia cybersecurity dengan materi praktis dan menyenangkan, mulai dari Linux, forensik, web exploitation, kriptografi, hingga OSINT. Ditutup dengan praktik langsung lewat picoCTF. Materi ringkas dan mudah dipahami, cocok untuk pemula. ",
    short: "Belajar cybersecurity dari Linux, forensik, web exploitation, kriptografi, hingga OSINT. Praktik langsung lewat picoCTF, cocok untuk pemula.",
    video: "https://drive.google.com/file/d/1WWdTnKm-cTmoxTSz2xYSwpo3RCHfZQ3P/preview",
  },
  "Graphic Design": {
    slug: "graphic-design",
    image: "/logo-perkelas/graphic.webp",
    teacher1: "/images/foto-orang/geradline.webp",
    teacher2: "",
    teacher3: "",
    desc: "Belajar dasar desain grafis mulai dari elemen visual, warna, hingga layout. Lewat studi kasus dan praktik di Figma, kamu akan buat berbagai konten secara terarah dan bermakna.",
    short: "Belajar dasar desain grafis: elemen visual, warna, dan layout. Praktik langsung di Figma lewat studi kasus untuk hasilkan konten yang rapi dan bermakna.",
    video: "https://drive.google.com/file/d/1utL8trWlsJO0w8vpM63QBFeTwIGrcoCM/preview",
  },
  "Bundle Web Development + Software Engineering": {
    slug: "web-development+software-engineering",
    image: "/logo-perkelas/webdev-softeng.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/foto-orang/rehund.webp",
    teacher3: "",
    desc: "Kuasai pembuatan UI dan aplikasi web modern dari basic hingga intermediate dengan React, Tailwind, dan MUI. Praktik langsung buat halaman responsif, autentikasi, dan fitur CRUD.",
    short: "Kuasai UI & web app modern dari basic hingga intermediate dengan React, Tailwind, dan MUI. Praktik bikin halaman responsif, autentikasi, dan fitur CRUD.",
    video: "https://drive.google.com/file/d/1BJhxffHqh-nfvjQbfeKhdqDga_1zXwIU/preview",
  },
  "Bundle Python + Data Science & Artificial Intelligence": {
    slug: "python+data-science&artificial-intelligence",
    image: "/logo-perkelas/python-dsai.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/foto-orang/daffa.webp",
    teacher3: "",
    desc: "Pelajari pemrograman Python dan Data Science & AI dari basic hingga intermediate. Mulai dari sintaks dasar, OOP, struktur data, hingga membangun model AI siap industri melalui studi kasus menarik dan bimbingan step-by-step untuk persiapan proyek dan kompetisi nyata.",
    short: "Kuasai Python, Data Science & AI dari nol hingga siap kerja. Pelajari sintaks, OOP, dan bangun model AI lewat studi kasus dan bimbingan proyek nyata.",
    video: "https://drive.google.com/file/d/142u_tMPQjmBVEBTJQOYJdY1LNI2YKNJ3/preview",
  },
  "Bundle Graphic Design + UI/UX": {
    slug: "graphic-design+ui-ux",
    image: "/logo-perkelas/gd-ui-ux.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/foto-orang/ken-bima.webp",
    teacher3: "/images/foto-orang/geradline.webp",
    desc: "Belajar desain dari basic hingga intermediate mulai dari elemen visual, warna, layout, hingga UX, wireframe, dan desain aksesibel. Praktik langsung di Figma, ubah PRD jadi desain, dan bangun portofolio lewat proyek akhir.",
    short: "Belajar desain dari basic hingga intermediate: elemen visual, UX, wireframe, dan aksesibilitas. Praktik di Figma, ubah PRD jadi desain, dan bangun portofolio.",
    video: "https://drive.google.com/file/d/1qaTUKyn9RvG_a33DHGWuydT6fzGLKmuv/preview",
  },
  "Bundle Fundamental Cyber Security + Cyber Security": {
    slug: "fundamental-cyber-security+cyber-security",
    image: "/logo-perkelas/cysec-entry-sysec.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/foto-orang/ahsan.webp",
    teacher3: "",
    desc: "Belajar cybersecurity dan ethical hacking dari basic hingga intermediate, mulai dari OSINT, forensik, web exploit, hingga penetration testing dan pembuatan laporan profesional.",
    short: "Belajar cybersecurity & ethical hacking dari basic hingga intermediate: OSINT, forensik, web exploit, hingga penetration testing dan laporan profesional.",
    video: "https://drive.google.com/file/d/1kJm2K5eqzQHsnZ8IaboL-aG7zYmCije0/preview",
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

export const getThirdTeacher = (title: string): string => {
  return classData[title]?.teacher3 || "";
};

export const getDescByTitle= (title: string): string => {
  return classData[title]?.desc || "";
};

export const getShortDescByTitle= (title: string): string => {
  return classData[title]?.short || "";
};

export const getVideoByTitle= (title: string): string => {
  return classData[title]?.video || "";
};