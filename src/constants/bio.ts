// Bio-data som kan uppdateras online senare
export const bio = {
  name: "Fredrik Wiking",
  tagline: "Fullstack Developer & Open Source Enthusiast",
  shortPitch: "Jag bygger moderna webbapplikationer med fokus på användarvänlighet, prestanda och ren kod.",
  
  about: [
    "Hej! Jag är en passionerad utvecklare som älskar att skapa lösningar som gör skillnad. Med en stark grund i både frontend och backend skapar jag kompletta applikationer från ide till produktion.",
    "Mitt fokus ligger på att skriva ren, underhållbar kod och att alltid lära mig nya teknologier. Jag tror på att dela med sig av kunskap genom open source och tekniska blogginlägg.",
    "När jag inte kodar hittar du mig antingen i naturen eller experimenterande med nya verktyg och ramverk."
  ],

  contact: {
    email: "wikingfredrik@gmail.com",
    github: "https://github.com/wajkie",
    linkedin: "https://linkedin.com/in/fredrik-wiking",
  },

  skills: {
    frontend: [
      { name: "React", icon: "⚛️", color: "blue" },
      { name: "Next.js", icon: "▲", color: "slate" },
      { name: "TypeScript", icon: "TS", color: "blue" },
      { name: "Tailwind CSS", icon: "💨", color: "cyan" },
      { name: "HTML/CSS", icon: "🎨", color: "orange" },
    ],
    backend: [
      { name: "Node.js", icon: "🟢", color: "green" },
      { name: "PostgreSQL", icon: "🐘", color: "blue" },
      { name: "Kysely", icon: "🔍", color: "purple" },
      { name: "REST APIs", icon: "🔌", color: "indigo" },
      { name: "GraphQL", icon: "◈", color: "pink" },
    ],
    tools: [
      { name: "Git", icon: "📦", color: "orange" },
      { name: "Docker", icon: "🐳", color: "blue" },
      { name: "VS Code", icon: "💻", color: "blue" },
      { name: "Vercel", icon: "▲", color: "slate" },
      { name: "npm", icon: "📦", color: "red" },
    ],
  },

  values: [
    {
      title: "Clean Code",
      description: "Läsbar, underhållbar kod som andra utvecklare förstår",
      icon: "✨"
    },
    {
      title: "Accessibility",
      description: "Webb för alla - WCAG 2.1 AA-standard i fokus",
      icon: "♿"
    },
    {
      title: "Performance",
      description: "Snabba laddningstider och optimerad användarupplevelse",
      icon: "⚡"
    },
    {
      title: "Continuous Learning",
      description: "Alltid nyfiken på nya teknologier och best practices",
      icon: "📚"
    }
  ]
};

export type BioData = typeof bio;
