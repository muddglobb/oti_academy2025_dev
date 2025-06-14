import React from "react";

type PrerequisitesProps = {
  courseTitle: string;
};
function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

const PrerequisitesData: Record<string, string> = {
  "Data Science & Artificial Intelligence": `- PC/Laptop dengan spesifikasi apapun
- Sudah punya akun Kaggle
`,
  "UI/UX": `1. Prior understanding of the concept of UI/UX
- Understanding basic knowledge of User Experience (UX)
- Understanding basic knowledge of User Interface (UI)
- Difference between UI and UX

2. Design Thinking familiarity
- Understanding basic knowledge of design thinking
- Familiarity with some frameworks of design thinking (double diamond, triple diamond, etc)

3. Figma familiarity
- Familiar with the concept of low-fidelity wireframe
- Familiar with Design System

4. Have already done with UI project, at least once
`,
  "Software Engineering": `- Sudah install VSCode atau IDE lainnya
- Sudah install NodeJS
- Sudah install Docker (opsional)
`,
  "Cyber Security": "-",
  "Competitive Programming": `1. Pelajari C++ Dasar (rekomendasi: https://tlx.toki.id/courses/basic-cpp)

  2. Punya Teks Editor dan Compiler (jika belum ada install VS Code saja karena umum, lalu set up C++: https://code.visualstudio.com/docs/languages/cpp)
`,
  "Basic Python": `- Vscode
- Windows 10 (64-bit)
- macOS 10.11+
`,
  "Graphic Design": `- Bisa menggunakan Figma secara basic
`,
  "Game Development": `- Sudah download GDevelop`,
};

const Prerequisites = ({ courseTitle }: PrerequisitesProps) => {
  const Prerequisites = PrerequisitesData[courseTitle] || "";
  return (
    <div className="w-full rounded-[20px] border-solid border-2 border-neutral-500 p-5">
      <div className="">
        <p className="text-lg text-neutral-50 font-display border-b-2 border-neutral-500 pb-3 font-bold">
          Prasyarat
        </p>
        <p className="text-xs mt-4" style={{ whiteSpace: "pre-line" }}>
          {linkify(Prerequisites)}
        </p>
      </div>
    </div>
  );
};

export default Prerequisites;
