export const classData: Record<
  string,
  {
    slug: string;
    image: string;
    teacher1: string;
    teacher2: string;
  }
> = {
  "Web Development": {
    slug: "web-development",
    image: "/logo-perkelas/webdev.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
  },
  "Software Engineering": {
    slug: "software-engineering",
    image: "/logo-perkelas/softeng.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
  },
  "Data Science & Artificial Intelligence": {
    slug: "data-science&artificial-intelligence",
    image: "/logo-perkelas/data.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
  },
  "UI/UX": {
    slug: "ui-ux",
    image: "/logo-perkelas/uiux.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
  },
  "Cyber Security": {
    slug: "cyber-security",
    image: "/logo-perkelas/cysec-inter.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
  },
  "Basic Python": {
    slug: "basic-python",
    image: "/logo-perkelas/python.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/",
  },
  "Competitive Programming": {
    slug: "competitive-programming",
    image: "/logo-perkelas/cp.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
  },
  "Game Development": {
    slug: "game-development",
    image: "/logo-perkelas/gamedev.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
  },
  "Fundamental Cyber Security": {
    slug: "fundamental-cyber-security",
    image: "/logo-perkelas/cysec-entry.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
  },
  "Graphic Design": {
    slug: "graphic-design",
    image: "/logo-perkelas/graphic.webp",
    teacher1: "/images/mentor-coming-soon.webp",
    teacher2: "/images/mentor-coming-soon.webp",
  },
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

