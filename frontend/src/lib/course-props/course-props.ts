export const classData: Record<string, { icon: string; slug: string }> = {
  "Web Development": {
    icon: "/images/class-profile/hako.jpg",
    slug: "web-development",
  },
  "Software Engineering": {
    icon: "/images/class-profile/hako.jpg",
    slug: "software-engineering",
  },
  "Data Science & Artificial Intelligence": {
    icon: "/images/class-profile/hako.jpg",
    slug: "data-science&artificial-intelligence",
  },
  "UI/UX": {
    icon: "/images/class-profile/hako.jpg",
    slug: "ui-ux",
  },
  "Cyber Security": {
    icon: "/images/class-profile/hako.jpg",
    slug: "cyber-security",
  },
  "Basic Python": {
    icon: "/images/class-profile/hako.jpg",
    slug: "basic-python",
  },
  "Competitive Programming": {
    icon: "/images/class-profile/hako.jpg",
    slug: "competitive-programming",
  },
  "Game Development": {
    icon: "/images/class-profile/hako.jpg",
    slug: "game-development",
  },
  "Fundamental Cyber Security": {
    icon: "/images/class-profile/hako.jpg",
    slug: "fundamental-cyber-security",
  },
  "Graphic Design": {
    icon: "/images/class-profile/hako.jpg",
    slug: "graphic-design",
  },
};

export const getIcons = (title: string): string => {
  return classData[title]?.icon || "/person-placeholder.jpeg";
};

export const getSlugByTitle = (title: string): string => {
  return classData[title]?.slug || "";
};
