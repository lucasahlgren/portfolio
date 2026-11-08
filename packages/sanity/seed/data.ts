export type SeedProject = {
  slug: string;
  title: string;
  subtitle: string;
  kind?: "school" | "personal";
  category: string;
  year: number;
  featured?: boolean;
  accentColor?: string;
  cover: string;
  gallery?: string[];
  videoUrl?: string;
  excerpt: string;
  paragraphs: string[];
  team?: string[];
  tools: string[];
  links: { label: string; url: string }[];
};

export const settings = {
  name: "Lucas Ahlgren",
  role: "Media engineer",
  headline: "Media engineer crafting digital products at the intersection of *code* and *design*.",
  intro:
    "M.Sc. in interactive media technology from KTH Royal Institute of Technology. I build for the web and mobile, visualise data and tell stories with photography and motion.",
  location: "Jönköping, Sweden",
  email: "lucas.ahlgren1@gmail.com",
  availableForWork: false,
  portrait: { file: "profile4.jpg", alt: "Portrait of Lucas Ahlgren" },
  bio: [
    "I'm Lucas, a media engineer with a master's degree in interactive media technology from KTH Royal Institute of Technology, and I am based in Jönköping, Sweden. I have a passion for photography and app development, and I spend a lot of time exploring these topics — not just at work but in my spare time too.",
    "I'm a creative person who likes to express that side through photography, graphic design and motion graphics. Besides photography, my interests are sports and travelling. In my teens I played floorball in division 1 for Skillingaryds Innebandyklubb, which taught me the importance of teamwork — in sports and in life.",
    "I have done projects in web development, interaction design, information visualisation, AR, sound, video and motion graphics. Feel free to check out my work and don't hesitate to get in touch if you want to collaborate or just say hi.",
  ],
  skills: [
    "TypeScript",
    "JavaScript",
    "React",
    "React Native",
    "Next.js",
    "Node.js",
    "D3.js",
    "HTML",
    "CSS",
    "C#",
    "SQL",
    "Unity",
    "Figma",
    "Photoshop",
    "After Effects",
    "Premiere Pro",
    "Illustrator",
    "Cinema 4D",
  ],
  socials: [
    { platform: "linkedin", url: "https://www.linkedin.com/in/lucas-ahlgren-a2750167/" },
    { platform: "github", url: "https://github.com/lucasahlgren" },
    { platform: "instagram", url: "https://www.instagram.com/lucasahlgren/" },
    { platform: "500px", url: "https://500px.com/LucasAhlgren" },
  ],
};

export const projects: SeedProject[] = [
  {
    slug: "tco-calculator",
    title: "Total cost of ownership as a tool for the public",
    subtitle: "Master thesis",
    category: "research",
    year: 2020,
    featured: true,
    accentColor: "#22C55E",
    cover: "tco-kalkylatorn.jpg",
    gallery: ["tco-kalkylatorn_montage.jpg"],
    excerpt:
      "An exploratory study and web tool that helps car buyers calculate and visualise the total cost of owning a battery electric vehicle.",
    paragraphs: [
      "Sustainability and the role of battery electric vehicles (BEVs) in the shift to more sustainable transportation are gaining more and more attention. Yet only 4.3% of new passenger car registrations in Sweden were BEVs in 2019. High purchase prices are considered a major barrier — but the purchase price alone does not reflect what the consumer pays for owning a vehicle. From a Total Cost of Ownership (TCO) perspective, BEVs can be cheaper than internal combustion engine vehicles, and a lack of knowledge about TCO can lead to uneconomical purchase decisions.",
      "The thesis reports on an exploratory research process including the development and user study of a TCO tool aimed at the public. Based on an iterative design process, a web application was developed to help car consumers calculate and visualise the TCO of new passenger cars. It was then used in a user study with think-aloud evaluations and semi-structured interviews.",
      "The study suggests that a TCO tool can make users aware of the cost benefits of owning a BEV. More research is needed to understand whether this realisation is enough to affect BEV purchases.",
    ],
    tools: ["React", "Redux", "JavaScript", "HTML", "CSS", "Bootstrap"],
    links: [
      { label: "Application", url: "https://tco-kalkylatorn.firebaseapp.com/" },
      {
        label: "Thesis (PDF)",
        url: "https://kth.diva-portal.org/smash/record.jsf?pid=diva2:1466823",
      },
    ],
  },
  {
    slug: "world-values-survey",
    title: "World Values Survey",
    subtitle: "Information visualisation",
    category: "dataviz",
    year: 2019,
    featured: true,
    accentColor: "#3B82F6",
    cover: "infoviz.jpg",
    excerpt:
      "An interactive map visualising what people around the world think is important in life, built with D3.js.",
    paragraphs: [
      "An individual project from the course Information Visualization (DH2321) at KTH, covering the information visualisation pipeline from data structuring to visual mapping, as well as human perception.",
      "The visualisation uses data from the World Values Survey and Gapminder about what people think is important in life — religion, work, family and more. Each category is encoded with a colour; when a category is selected, each country's fill updates to show the share of people who consider it important for the chosen period. More saturated colour means a higher percentage. The design leans on preattentive features such as colour, position and size to help users gain insights faster.",
      "The application is designed for desktop browsers.",
    ],
    tools: ["D3.js", "JavaScript", "jQuery", "HTML", "CSS", "Bootstrap"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/lucasahlgren/DH2321-Information-Visualization/tree/master/project2",
      },
      { label: "Application", url: "https://ivis19project2.firebaseapp.com/" },
    ],
  },
  {
    slug: "snowball-war",
    title: "Snowball War",
    subtitle: "Multiplayer game",
    category: "game",
    year: 2018,
    featured: true,
    accentColor: "#06B6D4",
    cover: "snowball_war.jpg",
    gallery: ["snowball_war_montage.jpg"],
    excerpt:
      "A third-person, battle-royale style multiplayer snowball fight built in Unity — the first game we ever made.",
    paragraphs: [
      "Snowball War is a third-person multiplayer game created during the course Computer Graphics and Interaction (DH2323) at KTH. As the name suggests it simulates a snowball war, based on the battle-royale format where the last surviving player wins.",
      "Players move with W, A, S and D and jump with the spacebar to dodge incoming snowballs. Right-click picks up a snowball, left-click throws it — the longer you hold, the harder the throw.",
      "One player hosts a session and acts as the server; others join with the host's IP address. The game was built with Unity and the UNet networking API, with assets from the Unity Asset Store, Adobe Mixamo, Pexels and Storyblocks.",
      "I was responsible for the networking — the lobby, the game manager that switches game states, and syncing players and snowballs over the network. I also created the graphics and the user interface for the menus and the game.",
    ],
    team: ["Lucas Ahlgren", "Johannes Karlsson"],
    tools: ["Unity", "C#"],
    links: [
      {
        label: "Download (Windows)",
        url: "https://drive.google.com/file/d/1a9TSZeFaMiy6t3rX-ybtwwhnpwLOW0-v/view?usp=sharing",
      },
    ],
  },
  {
    slug: "meat-o-meter",
    title: "Meat-O-Meter",
    subtitle: "Sustainability and meat production",
    category: "motion",
    year: 2019,
    featured: true,
    accentColor: "#EF4444",
    cover: "meatometer.jpg",
    videoUrl: "https://www.youtube.com/watch?v=RBcyiDI2Vnw",
    excerpt:
      "A physical design installation that uses a medical metaphor to shed light on the hidden costs of meat production.",
    paragraphs: [
      "A group project from the Advanced Project Course in Interactive Media Technology (DM2799) at KTH, where we worked with researchers on Meat-O-Meter — a project aiming to shed light on the meat production system and its hidden costs.",
      "We built a physical installation based on a medical metaphor: a sick Earth (“meat sickness”) lies in a bed connected to an “ECOG-monitor”. The monitor plays an animation covering greenhouse gas emissions, land use and water use, inspired by a real ECG monitor but adapted with graphics and graphs to make the information easier to take in.",
      "I was responsible for the monitor animation, created in After Effects and Premiere Pro.",
    ],
    team: [
      "Lucas Ahlgren",
      "Hedvig Fahlstedt",
      "Patric Hjorth",
      "Johannes Karlsson",
      "Alessandro Salutari",
    ],
    tools: ["After Effects", "Premiere Pro"],
    links: [
      { label: "Video demo", url: "https://youtu.be/RBcyiDI2Vnw" },
      { label: "ECOG animation", url: "https://youtu.be/f2kIIkuJJZA" },
    ],
  },
  {
    slug: "labtrino",
    title: "Labtrino",
    subtitle: "Water consumption visualisation",
    category: "dataviz",
    year: 2019,
    cover: "labtrino.jpg",
    videoUrl: "https://www.youtube.com/watch?v=zuv5xfDzQe4",
    excerpt:
      "A dashboard helping property managers understand water consumption, made with the startup Labtrino.",
    paragraphs: [
      "A group project from the course Information Visualization (DH2321) at KTH, made in collaboration with the startup Labtrino AB, which develops smart water meter systems for residential property owners.",
      "The web application helps property managers in their daily work through a set of visualisations that give insight into water consumption in their properties.",
      "I set up the React project for development and deployment, built functionality such as date filtering that updates every visualisation, and created the line chart showing hot and cold water consumption.",
    ],
    team: [
      "Lucas Ahlgren",
      "Ibrahim Asfadai",
      "Evelina Hedberg",
      "Filippa Bång",
      "Axel Karlsson",
      "Johannes Karlsson",
    ],
    tools: ["React", "D3.js", "JavaScript", "HTML", "CSS", "Bootstrap"],
    links: [
      { label: "GitHub", url: "https://github.com/axol123/iVis19Labtrino" },
      { label: "Application", url: "https://infovis-838ec.firebaseapp.com" },
    ],
  },
  {
    slug: "gronsakshjalpen",
    title: "Grönsakshjälpen",
    subtitle: "Environmental impact of vegetables",
    category: "web",
    year: 2019,
    cover: "gronsakshjalpen.jpg",
    gallery: ["gronsakshjalpen_montage.jpg"],
    excerpt:
      "A web tool for comparing the environmental impact and nutrition of 21 different vegetables.",
    paragraphs: [
      "A group project from the Individual Course in Media Technology (DM2905) at KTH, a project course where students explore their own interests.",
      "Grönsakshjälpen lets users learn about the environmental impact of 21 vegetables and compare them. Besides data such as greenhouse gas emissions, users can look up nutrition data and calculate impact per gram of carbohydrates, protein or fat, or per Swedish krona.",
      "I set up the application for development and deployment with React, Redux and Firebase, gathered and processed the data, and helped design and build the visualisations and graphics.",
    ],
    team: ["Lucas Ahlgren", "Johannes Karlsson"],
    tools: ["React", "Redux", "D3.js", "JavaScript", "HTML", "CSS", "Bootstrap", "Firebase"],
    links: [
      { label: "GitHub", url: "https://github.com/johanneskarlsson/veg-o-meter" },
      { label: "Application", url: "https://gronsakshjalpen.firebaseapp.com/" },
    ],
  },
  {
    slug: "mixar",
    title: "MixAR",
    subtitle: "AR 3D sound experience",
    category: "xr",
    year: 2018,
    accentColor: "#A855F7",
    cover: "mixar.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ge9gzYqq_Pc",
    excerpt:
      "A smartphone AR app that lets you experience spatial 3D sound from virtual musical instruments.",
    paragraphs: [
      "MixAR is the result of a group project in Multimodal Interaction and Interfaces (DT2140) at KTH, a course introducing new interaction techniques such as gesture recognition, augmented reality, voice control and haptics.",
      "Tangible image cards place AR instruments in the room; tapping an instrument turns it on or off. Moving around the room changes how the instruments sound — direction and distance both matter — and a selectable reverb simulates different room acoustics.",
      "I set up the Unity project and version control, created the image markers, coded parts of the app such as marker tracking in C#, and produced the video demo.",
    ],
    team: ["Lucas Ahlgren", "Carl Svedhag", "Thelma Svenns", "Gustav Bergman"],
    tools: ["Unity", "C#", "Vuforia", "Android"],
    links: [{ label: "Video demo", url: "https://www.youtube.com/watch?v=ge9gzYqq_Pc" }],
  },
  {
    slug: "change-detection-test",
    title: "Change Detection Test",
    subtitle: "Colour perception test on the web",
    category: "research",
    year: 2019,
    cover: "perception.jpg",
    excerpt:
      "A web experiment studying how colour affects visual working memory in user interfaces.",
    paragraphs: [
      "Created during Human Perception for Information Technology (DM2350) at KTH, a course covering vision, hearing and touch in relation to IT.",
      "The group project studied how colour affects Visual Working Memory (VWM) in web user interfaces. The application consists of five change detection tasks with multiple-choice questions asking what changed between two layouts.",
      "I built the web application with React and Bootstrap, responsive across screen sizes and connected to a Google Form to store results.",
    ],
    team: [
      "Lucas Ahlgren",
      "Angie Melissa Marin Puentes",
      "Erna Guðrún Sigurðardóttir",
      "Arjun Menon",
    ],
    tools: ["React", "JavaScript", "HTML", "CSS", "Bootstrap"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/lucasahlgren/DM2350-Human-Perception-for-Information-Technology",
      },
      { label: "Application", url: "http://change-detection-game.firebaseapp.com" },
    ],
  },
  {
    slug: "skillingaryds-ibk",
    kind: "personal",
    title: "Skillingaryds Innebandyklubb",
    subtitle: "Creative work for the local sports team",
    category: "design",
    year: 2019,
    accentColor: "#F59E0B",
    cover: "sik.jpg",
    gallery: ["sik_montage.jpg"],
    excerpt:
      "Photography, graphic design and motion graphics for my former floorball team's social channels.",
    paragraphs: [
      "In my spare time I help my local sports team, Skillingaryds Innebandyklubb, with their social media channels — primarily Facebook and Instagram.",
      "The work spans everything from photographing games to graphic design and motion graphics. It's a great way to help my former team, stay creative and keep sharpening my skills.",
    ],
    tools: ["Photoshop", "Illustrator", "After Effects", "Premiere Pro"],
    links: [
      { label: "Facebook", url: "https://www.facebook.com/SkillingarydsIK/" },
      { label: "Instagram", url: "https://www.instagram.com/sik_herr/" },
    ],
  },
  {
    slug: "shapping",
    title: "shAPPing",
    subtitle: "Shopping with Bluetooth beacons",
    category: "mobile",
    year: 2018,
    cover: "shapping.jpg",
    gallery: ["shapping_montage.jpg"],
    excerpt: "A hybrid mobile shopping app that scans products in store using Bluetooth beacons.",
    paragraphs: [
      "shAPPing is a hybrid mobile app developed in Mobile Development with Web Technologies (DM2518) at KTH. Hybrid apps use web technologies inside a native shell to access features like Bluetooth and GPS.",
      "The app uses the phone's Bluetooth to scan products in the store via beacons, and is connected to Firebase for product and customer data. It was built with HTML, CSS, JavaScript, Onsen UI and Apache Cordova in Evothings Studio.",
      "I built the login page with Firebase authentication and the checkout page.",
    ],
    team: ["Lucas Ahlgren", "Patric Hjorth", "Evelina Hedberg", "Joel Weidenmark", "Filip Stål"],
    tools: ["Apache Cordova", "Onsen UI", "Evothings", "JavaScript", "HTML", "CSS", "Firebase"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/lucasahlgren/DM2518-Mobile-Development-with-Web-Technologies/tree/master/app",
      },
    ],
  },
  {
    slug: "project-hu",
    title: "Project HU",
    subtitle: "Utopian drone technology for paralysed people",
    category: "design",
    year: 2017,
    cover: "holodrone.jpg",
    videoUrl: "https://www.youtube.com/watch?v=eFbTyrgZE2g",
    excerpt:
      "A speculative design for 2050: a helmet-controlled drone that projects paralysed people back into everyday life.",
    paragraphs: [
      "A group project from Reflective Design Process (AD1RD1) at KTH, a course about the design process — dealing with problems, defending design decisions and building effective teams.",
      "The brief was to design something supporting social inclusion in 2050. Project HU is a utopian drone technology: the user wears a helmet that controls a drone projecting the user into the real world, equipped with cameras and microphones to interact with people.",
      "I designed the prototype and created the video demo in Premiere Pro with motion graphics in After Effects. The 3D models of the drone and helmet were made in Cinema 4D Lite.",
    ],
    team: [
      "Lucas Ahlgren",
      "Diba Vosta",
      "Oscar Wiigh",
      "Sabina Nordell",
      "Emma Olsson",
      "Carl Rosengren",
    ],
    tools: ["After Effects", "Premiere Pro", "Photoshop", "Illustrator", "Cinema 4D"],
    links: [
      {
        label: "Video demo",
        url: "https://www.youtube.com/watch?v=eFbTyrgZE2g&list=PL7JqV0F2thxgFPJTKaOXYGcY_zeAX9IWW",
      },
    ],
  },
  {
    slug: "portfolio-2018",
    kind: "personal",
    title: "Portfolio 2018",
    subtitle: "The previous version of this site",
    category: "web",
    year: 2018,
    cover: "portfolio.jpg",
    excerpt: "My first personal website, built with React, Bootstrap 4 and Firebase.",
    paragraphs: [
      "A personal project to create my own website and portfolio — a chance to practise web development and design with React, Bootstrap 4 and Firebase, and to learn how to set up a custom domain.",
    ],
    tools: ["React", "JavaScript", "HTML", "CSS", "Bootstrap", "Firebase"],
    links: [{ label: "GitHub", url: "https://github.com/lucasahlgren/Portfolio" }],
  },
];

export const education: {
  id: string;
  school: string;
  degree: string;
  location: string;
  startYear: number;
  endYear: number;
  description?: string;
  logo: string;
}[] = [
  {
    id: "kth",
    school: "KTH Royal Institute of Technology",
    degree: "M.Sc. in Engineering — Media Technology (Civilingenjör i Medieteknik)",
    location: "Stockholm",
    startYear: 2015,
    endYear: 2020,
    description:
      "Bachelor of science and master's degree in interactive media technology, specialising in visual media technology.",
    logo: "kth.png",
  },
  {
    id: "linnaeus",
    school: "Linnaeus University",
    degree: "Web design (15 credits)",
    location: "Växjö",
    startYear: 2015,
    endYear: 2015,
    description:
      "Distance course covering HTML, CSS, XML and RSS, JavaScript, and an introduction to internet protocols, standards and trends.",
    logo: "linnaeus.png",
  },
  {
    id: "jonkoping",
    school: "Jönköping University",
    degree:
      "Video Editing and Video Production · Video Editing in After Effects (7.5 + 7.5 credits)",
    location: "Jönköping",
    startYear: 2013,
    endYear: 2014,
    logo: "jkpg.png",
  },
  {
    id: "fenix",
    school: "Fenix Kunskapscentrum",
    degree: "Natural science programme",
    location: "Vaggeryd",
    startYear: 2009,
    endYear: 2012,
    logo: "fenix.png",
  },
];

export const photos = [
  { file: "domherre.jpg", title: "Bullfinch", date: "2016-03-26", category: "nature" },
  {
    file: "isner_ballboy.jpg",
    title: "Stockholm Open Tennis",
    date: "2016-10-19",
    category: "sports",
  },
  { file: "celebration.jpg", title: "Goal celebration", date: "2019-10-26", category: "sports" },
  { file: "goalie.jpg", title: "Floorball goalie", date: "2019-01-04", category: "sports" },
  {
    file: "clearwater_sunset.jpg",
    title: "Clearwater Beach sunset",
    date: "2018-06-30",
    category: "travel",
  },
  { file: "lazy_macaque.jpg", title: "Lazy macaque", date: "2019-06-24", category: "nature" },
  { file: "floorballshot.jpg", title: "Shot", date: "2019-01-04", category: "sports" },
  { file: "arlington.jpg", title: "Arlington Cemetery", date: "2017-06-25", category: "travel" },
  { file: "amish.jpg", title: "Amish auctioneer", date: "2017-06-23", category: "street" },
  { file: "nyskyline.jpg", title: "New York skyline", date: "2015-06-30", category: "travel" },
  { file: "lens.jpg", title: "RGB lens", date: "2015-09-10", category: "other" },
  { file: "cat.jpg", title: "Devon Rex", date: "2017-05-26", category: "portrait" },
  { file: "volley_goal.jpg", title: "Volley goal", date: "2019-10-26", category: "sports" },
  { file: "isner.jpg", title: "John Isner", date: "2016-10-19", category: "sports" },
  {
    file: "gibraltar_panorama2.jpg",
    title: "Rock of Gibraltar",
    date: "2019-06-24",
    category: "travel",
  },
  { file: "ragnarsson.jpg", title: "Jonas Ragnarsson", date: "2019-10-26", category: "sports" },
  { file: "cheer.jpg", title: "Cheerleading stunt", date: "2018-03-11", category: "sports" },
  { file: "floorballfun.jpg", title: "Surprising goal", date: "2019-01-04", category: "sports" },
  { file: "baby_macaque.jpg", title: "Baby macaque", date: "2019-06-24", category: "nature" },
  { file: "portrait.jpg", title: "Autumn portrait", date: "2015-10-10", category: "portrait" },
  { file: "newyork_panorama.jpg", title: "New York", date: "2015-06-30", category: "travel" },
  { file: "edvardsson.jpg", title: "Simon Edvardsson", date: "2019-10-26", category: "sports" },
  { file: "silhouette.jpg", title: "Clearwater Beach B&W", date: "2018-06-30", category: "travel" },
  { file: "delpotro.jpg", title: "Juan Martín del Potro", date: "2016-10-19", category: "sports" },
  { file: "floorballgoal.jpg", title: "Goal", date: "2019-01-04", category: "sports" },
  { file: "ymer.jpg", title: "Mikael Ymer", date: "2016-10-19", category: "sports" },
];
