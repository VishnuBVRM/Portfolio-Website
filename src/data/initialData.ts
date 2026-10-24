import { Profile, Project, Skill, Experience, Certification, Education, SecuritySettings, NavbarTab, SectionBackgroundMap } from '../types';

export const initialProfile: Profile = {
  name: "VISHNU VARDHAN CHINTALA",
  title: "Networking Engineer & Full Stack Developer",
  headline: "Networking Engineer specializing in Routing, Switching, TCP/IP, and Cisco Security • Full Stack Java & Angular Developer",
  bio: "Motivated and hardworking Networking Engineer specializing in routing, switching, TCP/IP, and LAN/WAN infrastructure. Proven ability to troubleshoot complex network environments and implement secure VPN solutions to optimize system performance. Certified in Java Full Stack Development, Cisco CCNA R&D, and modern web application engineering.",
  email: "chvishnuvardhan371@gmail.com",
  phone: "+91 9290105665",
  whatsapp: "+91 9290105665",
  location: "3-142/1, Main Road, Gutlapadu, Bhimavaram, West Godavari, Andhra Pradesh, India, 534239",
  githubUrl: "https://github.com/VishnuBVRM",
  linkedinUrl: "https://www.linkedin.com/in/chintala-vishnu-vardhan/",
  portfolioUrl: "https://vishnuvardhan-portfolio.dev",
  yearsExperience: 1,
  availabilityStatus: "actively_interviewing",
  availableFor: [
    "Network Engineer / Network Support Engineer",
    "Java Full Stack Developer",
    "Angular & MEAN Stack Web Developer",
    "Cisco CCNA & Infrastructure Associate"
  ],
  preferredLocations: ["Hyderabad, Telangana", "Bengaluru, Karnataka", "Andhra Pradesh", "Remote / Hybrid"],
  salaryExpectation: "Competitive (Open to Industry Standards)",
  aboutHighlights: [
    "Specialized in Cisco CCNA R&D, Cisco Security, Routing, Switching, TCP/IP, and secure VPN deployments",
    "Certified in Java Full Stack Development (Edu Bridge / Capgemini) and Full Stack Development (IIDT)",
    "Hands-on expertise developing full-stack web applications with Angular, Node.js/Express, MySQL, and MongoDB",
    "Engineered deep learning research project utilizing Vision Transformers (ViT & EViTA) for crop pest identification"
  ],
  softSkills: [
    "Problem Solving",
    "Communication",
    "Teamwork",
    "Time Management",
    "Leadership",
    "Adaptability"
  ],
  languages: [
    "English",
    "Hindi",
    "Telugu"
  ],
  resumePdfUrl: "",
  avatarUrl: "/assets/aistudio/Modern_Office_Portrait_with_Dream_Build_Grow_Sign_20249659.png",
  photoLayout: 'top-to-bottom',
  photoPosition: 'top'
};

export const initialSkills: Skill[] = [
  // Networking & Security
  {
    id: "skill-1",
    name: "Cisco CCNA R&D & Routing/Switching",
    category: "backend",
    proficiency: 92,
    years: 2,
    featured: true,
    description: "Configuring Cisco routers and switches, VLANs, OSPF, EIGRP, inter-VLAN routing, and subnetting.",
    tags: ["CCNA", "Routing", "Switching", "VLAN", "OSPF"]
  },
  {
    id: "skill-2",
    name: "Cisco Security & VPN Solutions",
    category: "backend",
    proficiency: 90,
    years: 2,
    featured: true,
    description: "Access Control Lists (ACLs), IPsec VPN tunnels, firewall basics, port security, and network hardening.",
    tags: ["Cisco Security", "VPN", "ACL", "Network Security"]
  },
  {
    id: "skill-3",
    name: "TCP/IP & LAN/WAN Infrastructure",
    category: "backend",
    proficiency: 92,
    years: 3,
    featured: true,
    description: "Deep understanding of OSI 7-layer model, packet analysis, DHCP, DNS, NAT, and WAN topologies.",
    tags: ["TCP/IP", "LAN/WAN", "DNS", "DHCP", "Wireshark"]
  },
  {
    id: "skill-4",
    name: "Java Full Stack Development",
    category: "backend",
    proficiency: 88,
    years: 2,
    featured: true,
    description: "Core Java, OOP principles, collections framework, RESTful APIs, Spring Boot, and JDBC/JPA.",
    tags: ["Java", "Spring Boot", "OOP", "REST APIs"]
  },
  {
    id: "skill-5",
    name: "Node.js & Express.js",
    category: "backend",
    proficiency: 85,
    years: 2,
    featured: false,
    description: "Building scalable backend REST APIs, JWT authentication, and asynchronous request handling.",
    tags: ["Node.js", "Express.js", "JWT", "REST APIs"]
  },

  // Frontend
  {
    id: "skill-6",
    name: "Angular (MEAN Stack)",
    category: "frontend",
    proficiency: 88,
    years: 2,
    featured: true,
    description: "Developing single-page applications with Angular components, services, dependency injection, and RxJS.",
    tags: ["Angular", "MEAN Stack", "TypeScript", "SPA"]
  },
  {
    id: "skill-7",
    name: "HTML5 & CSS3 Responsive UI",
    category: "frontend",
    proficiency: 92,
    years: 3,
    featured: true,
    description: "Semantic HTML5, CSS3 flexbox, grid, responsive layouts, media queries, and mobile-friendly design.",
    tags: ["HTML5", "CSS3", "Responsive Design", "Flexbox"]
  },
  {
    id: "skill-8",
    name: "JavaScript (ES6+) & TypeScript",
    category: "frontend",
    proficiency: 86,
    years: 2,
    featured: false,
    description: "DOM manipulation, asynchronous promises, fetch API, typed interfaces, and modern ES6 features.",
    tags: ["JavaScript", "TypeScript", "ES6+", "Async/Await"]
  },

  // Databases
  {
    id: "skill-9",
    name: "MySQL Relational Database",
    category: "database",
    proficiency: 88,
    years: 3,
    featured: true,
    description: "Relational schema design, SQL queries (JOINs, GROUP BY), indexing, constraints, and data integrity.",
    tags: ["MySQL", "SQL Queries", "Schema Design", "RDBMS"]
  },
  {
    id: "skill-10",
    name: "MongoDB NoSQL Database",
    category: "database",
    proficiency: 84,
    years: 2,
    featured: false,
    description: "Document-oriented databases, collections, CRUD operations, and Mongoose ODM integration in MEAN stack.",
    tags: ["MongoDB", "NoSQL", "Mongoose", "JSON Documents"]
  },

  // Tools & Version Control
  {
    id: "skill-11",
    name: "Git & GitHub Version Control",
    category: "cloud_devops",
    proficiency: 90,
    years: 3,
    featured: true,
    description: "Branching workflows, commits, pull requests, code reviews, merge conflict resolution, and repositories.",
    tags: ["Git", "GitHub", "Version Control", "Collaboration"]
  }
];

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Improving Crop Health: A Multi-Algorithms Approach for Pest Identification",
    slug: "crop-health-pest-identification",
    subtitle: "Advanced deep learning system using Vision Transformers (ViT) & EViTA for peanut field pest identification.",
    category: "backend",
    description: "A major academic engineering project developed to assist agricultural farmers in early detection and diagnosis of pests in peanut fields. Utilized Vision Transformer (ViT) and Enhanced Vision Transformer Architecture (EViTA) for automated pest recognition, segmentation, and classification, applying attention mechanisms and dual Birch segment representations to outperform traditional CNN models.",
    problemSolved: "Traditional manual crop inspection and convolutional neural network (CNN) architectures struggled with overlapping pests, varying field lighting, and fine-grained species classification in dense peanut crops.",
    architectureOverview: "Image Dataset -> Preprocessing & Dual Birch Segmentation -> Vision Transformer (ViT) & EViTA Feature Extraction -> Attention Mechanism Classifier -> MySQL Health Log.",
    keyFeatures: [
      "Vision Transformer (ViT) & EViTA deep learning models for high-accuracy pest identification",
      "Pest recognition, bounding box segmentation, and multi-class classification in peanut fields",
      "Dual Birch segment representations to effectively combine disparate pest image regions",
      "Comprehensive performance evaluation demonstrating superiority over traditional CNN models",
      "Automated diagnostic recommendations for farmers to prevent crop yield loss"
    ],
    techStack: [
      "Python",
      "Vision Transformer (ViT)",
      "EViTA Architecture",
      "Deep Learning",
      "Dual Birch Segmentation",
      "Attention Mechanisms",
      "MySQL"
    ],
    coreStack: {
      frontend: "Web Diagnostic Dashboard",
      backend: "Python / Vision Transformer Core",
      javaVersion: "Deep Learning (ViT & EViTA)",
      database: "MySQL Pest & Crop Records"
    },
    metrics: [
      "Higher detection accuracy over traditional CNN models",
      "Multi-region pest segmentation and classification",
      "Optimized for real-world peanut field lighting variations"
    ],
    demoUrl: "https://crop-health-demo.internal",
    repoUrl: "https://github.com/VishnuBVRM/crop-health-pest-identification",
    schemaHighlights: [
      {
        tableName: "pest_detection_logs",
        purpose: "Stores crop field image analysis results, pest species detected, and confidence ratings.",
        columns: ["log_id INT AUTO_INCREMENT PRIMARY KEY", "field_sector VARCHAR(50)", "pest_species VARCHAR(100)", "confidence_score DECIMAL(5,2)", "detected_at TIMESTAMP"],
        keys: "PRIMARY KEY (log_id), KEY idx_species (pest_species)"
      },
      {
        tableName: "crop_treatment_plans",
        purpose: "Recommended agricultural treatment remedies corresponding to identified pest species.",
        columns: ["treatment_id INT PRIMARY KEY", "pest_species VARCHAR(100)", "recommended_chemical VARCHAR(150)", "dosage_instructions TEXT"],
        keys: "PRIMARY KEY (treatment_id)"
      }
    ],
    architectureSteps: [
      { title: "1. Image Ingestion", desc: "Peanut field images captured and normalized for lighting." },
      { title: "2. Dual Birch Segmentation", desc: "Dual Birch segment representation isolates pest boundaries." },
      { title: "3. EViTA Feature Extraction", desc: "Enhanced Vision Transformer processes global and local attention patches." },
      { title: "4. Multi-Pest Classification", desc: "Softmax attention head predicts specific pest taxonomy." },
      { title: "5. Recommendation", desc: "Treatment protocol retrieved from MySQL database and returned." }
    ],
    featured: true,
    order: 1
  },
  {
    id: "proj-2",
    title: "Netflix Clone — Full-Featured Streaming Web Application",
    slug: "netflix-clone-mean-stack",
    subtitle: "End-to-end video streaming web platform built with Angular, Node.js, Express.js, and MongoDB.",
    category: "fullstack",
    description: "A production-grade video streaming web platform engineered during the IIDT internship. Built with Angular on the frontend for an intuitive, responsive user experience mirroring Netflix, paired with Node.js and Express.js RESTful APIs on the backend, JWT token-based authentication, and MongoDB for flexible video catalog and user watchlist management.",
    problemSolved: "Engineered responsive video category browsing, secure authentication token lifecycle, and fast catalog retrieval across mobile and desktop devices without stuttering.",
    architectureOverview: "Angular Frontend -> Express.js API Gateway -> JWT Authentication Middleware -> MongoDB Video & User Database.",
    keyFeatures: [
      "Dynamic movie and series browsing with categorized carousels (Trending, Top Rated, Action)",
      "Secure user registration and login with encrypted passwords and JWT token authentication",
      "Personalized watchlist functionality with real-time add/remove updates",
      "Responsive video playback interface with preview trailers and detailed metadata",
      "Tested and verified for cloud deployment and optimized API throughput"
    ],
    techStack: [
      "Angular (MEAN Stack)",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT Authentication",
      "HTML5 / CSS3",
      "RESTful APIs"
    ],
    coreStack: {
      frontend: "Angular (MEAN Stack)",
      backend: "Node.js & Express.js",
      javaVersion: "JavaScript (Node ES6+)",
      database: "MongoDB & MySQL"
    },
    metrics: [
      "100% responsive user interface across mobile and desktop",
      "Secure JWT token-based authentication and route guarding",
      "Fast catalog search and sub-second carousel rendering"
    ],
    demoUrl: "https://netflix-clone-demo.internal",
    repoUrl: "https://github.com/VishnuBVRM/netflix-clone-mean",
    schemaHighlights: [
      {
        tableName: "users",
        purpose: "Stores user credentials, hashed passwords, and profile preferences.",
        columns: ["_id ObjectId PRIMARY KEY", "email String UNIQUE", "password_hash String", "created_at Date"],
        keys: "PRIMARY KEY (_id), UNIQUE (email)"
      },
      {
        tableName: "video_catalog",
        purpose: "Stores movie and series metadata, genres, thumbnail URLs, and video sources.",
        columns: ["_id ObjectId PRIMARY KEY", "title String", "genre String", "rating Number", "thumbnail_url String", "video_url String"],
        keys: "PRIMARY KEY (_id), INDEX (genre)"
      }
    ],
    architectureSteps: [
      { title: "1. Client Auth", desc: "User submits credentials; backend verifies bcrypt hash and issues signed JWT." },
      { title: "2. Route Guarding", desc: "Angular route guards verify token in localStorage before granting view access." },
      { title: "3. Catalog Fetch", desc: "Express controller fetches categorized documents from MongoDB." },
      { title: "4. Streaming UI", desc: "Angular components render fluid video carousels with trailer previews." }
    ],
    featured: true,
    order: 2
  },
  {
    id: "proj-3",
    title: "Interactive Student Portfolio Website",
    slug: "responsive-student-portfolio",
    subtitle: "Professional, accessible, mobile-first portfolio website created during APSCHE & Edunet Foundation internship.",
    category: "frontend",
    description: "A clean, modern, and fully responsive personal portfolio website developed during the internship with the Andhra Pradesh State Council of Higher Education (APSCHE) and Edunet Foundation. Designed using semantic HTML5, modern CSS3 layouts, and interactive UI components to effectively showcase student achievements, technical certifications, and engineering projects across all device viewports.",
    problemSolved: "Created a structured, lightweight, and universally accessible web presentation allowing recruiters and educators to seamlessly explore student qualifications on phones, tablets, and desktop computers.",
    architectureOverview: "Semantic HTML5 Markup -> Responsive CSS3 Flexbox/Grid -> Interactive UI Scripts -> GitHub Pages Deployment.",
    keyFeatures: [
      "Mobile-first responsive design ensuring seamless readability on all screen dimensions",
      "Structured navigation with smooth scrolling and accessible semantic HTML5 tags",
      "Project showcase grid with interactive cards, badges, and external repository links",
      "Integrated contact section and downloadable resume access",
      "Optimized asset loading achieving instant initial page load"
    ],
    techStack: [
      "HTML5",
      "CSS3",
      "JavaScript (ES6)",
      "Responsive Web Design",
      "Git & GitHub Pages"
    ],
    coreStack: {
      frontend: "HTML5 & CSS3 Responsive",
      backend: "Static Hosting / GitHub Pages",
      javaVersion: "JavaScript ES6+",
      database: "Local Storage / Static Data"
    },
    metrics: [
      "100% mobile-friendly across smartphones, tablets, and desktops",
      "Zero dependencies for maximum performance and instant load",
      "Approved and certified by APSCHE & Edunet Foundation"
    ],
    demoUrl: "https://vishnuvardhan-portfolio.internal",
    repoUrl: "https://github.com/VishnuBVRM/student-portfolio-website",
    schemaHighlights: [
      {
        tableName: "portfolio_sections",
        purpose: "Defines structured sections for projects, skills, education, and credentials.",
        columns: ["section_id VARCHAR(50)", "title VARCHAR(100)", "display_order INT"],
        keys: "PRIMARY KEY (section_id)"
      }
    ],
    architectureSteps: [
      { title: "1. Layout Architecture", desc: "Responsive grid and flexbox containers define viewport breakpoints." },
      { title: "2. Content Presentation", desc: "Semantic sections structure education, internships, and skill badges." },
      { title: "3. UI Micro-interactions", desc: "CSS3 transitions enhance button hover states and card elevations." }
    ],
    featured: true,
    order: 3
  }
];

export const initialExperience: Experience[] = [
  {
    id: "exp-1",
    role: "Full Stack Development Intern (MEAN Stack)",
    company: "IIDT (International Institute of Digital Technologies)",
    location: "Tirupati / Remote, India",
    type: "Internship",
    startDate: "2023",
    endDate: "2024",
    isCurrent: false,
    description: "Developed and deployed full-stack web applications using the MEAN stack (Angular, Node.js, Express.js, MongoDB), implementing authentication and database integration.",
    bulletPoints: [
      "Developed a Netflix clone using the MEAN stack, implementing Angular for the front end, Node.js/Express for backend APIs, and MongoDB for managing user and video data.",
      "Implemented secure JWT authentication and collaborated on cloud deployment to ensure application scalability, reliability, and performance.",
      "Collaborated with senior engineers on REST API design, frontend state handling, and database indexing for video queries."
    ],
    techStack: ["Angular", "Node.js", "Express.js", "MongoDB", "JWT", "REST APIs", "Git", "GitHub"],
    keyMetric: "MEAN Stack Netflix Clone with JWT Auth"
  },
  {
    id: "exp-2",
    role: "Frontend Web Development Intern",
    company: "APSCHE & Edunet Foundation",
    location: "Andhra Pradesh, India",
    type: "Internship",
    startDate: "2023",
    endDate: "2023",
    isCurrent: false,
    description: "Developed responsive web interfaces and student portfolio web applications using semantic HTML5, CSS3, and modern design principles.",
    bulletPoints: [
      "Developed a responsive portfolio website using HTML and CSS to showcase student achievements and projects across different devices.",
      "Collaborated with stakeholders to create a clean, user-friendly interface with an organized and engaging presentation of content.",
      "Ensured cross-browser compatibility and optimized mobile responsiveness across diverse screen resolutions."
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git", "GitHub"],
    keyMetric: "Certified by APSCHE & Edunet Foundation"
  }
];

export const initialCertifications: Certification[] = [
  {
    id: "cert-1",
    title: "Java Full Stack Development",
    issuer: "Edu Bridge India & Capgemini",
    issueDate: "2024",
    credentialId: "EDUBRIDGE-CAPGEMINI-JAVA-FS",
    verificationUrl: "https://www.edubridgeindia.com",
    badgeCode: "Java Full Stack"
  },
  {
    id: "cert-2",
    title: "CCNA R&D and Cisco Security",
    issuer: "Zoom Technologies",
    issueDate: "2024",
    credentialId: "ZOOM-CCNA-SEC-2024",
    verificationUrl: "https://zoomtechnologies.com",
    badgeCode: "Cisco CCNA & Sec"
  },
  {
    id: "cert-3",
    title: "Full Stack Development",
    issuer: "IIDT (International Institute of Digital Technologies)",
    issueDate: "2024",
    credentialId: "IIDT-FS-DEV-2024",
    verificationUrl: "https://iidt.edu.in",
    badgeCode: "IIDT Full Stack"
  },
  {
    id: "cert-4",
    title: "Frontend Development",
    issuer: "APSCHE & Edunet Foundation",
    issueDate: "2023",
    credentialId: "APSCHE-EDUNET-FE-2023",
    verificationUrl: "https://apsche.ap.gov.in",
    badgeCode: "APSCHE Frontend"
  }
];

export const initialEducation: Education[] = [
  {
    id: "edu-1",
    degree: "Bachelor of Technology (B.Tech)",
    field: "Computer Science and Engineering",
    institution: "D.N.R College of Engineering and Technology",
    location: "Bhimavaram, W.G, AP",
    year: "2020 – 2024",
    score: "CGPA: 6.7 / 10",
    honors: "Affiliated to JNTUK • Department of Computer Science & Engineering"
  },
  {
    id: "edu-2",
    degree: "Intermediate / Higher Secondary (10+2)",
    field: "MPC (Mathematics, Physics, Chemistry)",
    institution: "Narayana Junior College",
    location: "Poranki, Krishna, AP",
    year: "2018 – 2020",
    score: "CGPA: 5.9 / 10",
    honors: "Board of Intermediate Education of Andhra Pradesh (BIEAP)"
  },
  {
    id: "edu-3",
    degree: "Secondary School Certificate (SSC / 10th)",
    field: "General Academic Curriculum",
    institution: "St Ann’s E.M High School",
    location: "Bhimavaram, W.G, AP",
    year: "2006 – 2018",
    score: "CGPA: 7.8 / 10",
    honors: "Board of Secondary Education of Andhra Pradesh (BSEAP)"
  }
];

export const initialSecuritySettings: SecuritySettings = {
  adminEmail: "chvishnuvardhan371@gmail.com",
  adminPhone: "+91 9290105665",
  adminPasskey: "Amma@197478*",
  twoFactorEnabled: false,
  lastUpdated: "2026-10-22T07:52:00Z",
  loginAttempts: 0
};

export const defaultNavbarTabs: NavbarTab[] = [
  { id: 'overview', name: 'Overview', href: '#overview', visible: true, order: 1 },
  { id: 'skills', name: 'Skills', href: '#skills', visible: true, order: 2 },
  { id: 'projects', name: 'Projects', href: '#projects', visible: true, order: 3 },
  { id: 'experience', name: 'Experience', href: '#experience', visible: true, order: 4 },
  { id: 'certifications', name: 'Certifications', href: '#certifications', visible: true, order: 5 },
  { id: 'education', name: 'Education', href: '#education', visible: true, order: 6 },
  { id: 'contact', name: 'Contact', href: '#contact', visible: true, order: 7 },
];

export const initialSectionBackgrounds: SectionBackgroundMap = {
  overview: {
    imageUrl: '', // falls back to overview-bg.jpg asset
    overlayOpacity: 70,
    blur: 0,
    size: 'cover',
    position: 'center'
  },
  skills: {
    imageUrl: '',
    overlayOpacity: 85,
    blur: 0,
    size: 'cover',
    position: 'center'
  },
  projects: {
    imageUrl: '',
    overlayOpacity: 85,
    blur: 0,
    size: 'cover',
    position: 'center'
  },
  experience: {
    imageUrl: '',
    overlayOpacity: 85,
    blur: 0,
    size: 'cover',
    position: 'center'
  },
  certifications: {
    imageUrl: '',
    overlayOpacity: 85,
    blur: 0,
    size: 'cover',
    position: 'center'
  },
  education: {
    imageUrl: '',
    overlayOpacity: 85,
    blur: 0,
    size: 'cover',
    position: 'center'
  },
  contact: {
    imageUrl: '',
    overlayOpacity: 85,
    blur: 0,
    size: 'cover',
    position: 'center'
  }
};

export interface BackgroundPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  preview: string;
}

export const presetBackgrounds: BackgroundPreset[] = [
  {
    id: 'cyber-code',
    name: 'Cyber Matrix Code',
    category: 'Technology',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'datacenter-servers',
    name: 'Data Center & Racks',
    category: 'Networking',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cisco-network-cables',
    name: 'Fiber & Infrastructure',
    category: 'Networking',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'modern-dev-desk',
    name: 'Modern Developer Setup',
    category: 'Workspace',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'deep-blue-glow',
    name: 'Deep Blue Nebula Mesh',
    category: 'Abstract',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'digital-circuit-board',
    name: 'High-Tech Circuit Board',
    category: 'Hardware',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'dark-cyber-city',
    name: 'Neon Cyber Skyline',
    category: 'Futuristic',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=80'
  }
];

