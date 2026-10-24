export type SkillCategory = string; // e.g. frontend, backend, database, networking, or any custom category

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0 - 100
  years: number;
  featured: boolean;
  iconName?: string;
  description: string;
  tags: string[];
}

export interface SchemaTable {
  tableName: string;
  purpose: string;
  columns: string[];
  keys: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  description: string;
  problemSolved: string;
  architectureOverview: string;
  keyFeatures: string[];
  techStack: string[];
  coreStack: {
    frontend: string;
    backend: string;
    javaVersion: string;
    database: string;
  };
  metrics: string[];
  demoUrl?: string;
  repoUrl?: string;
  schemaHighlights: SchemaTable[];
  architectureSteps: { title: string; desc: string }[];
  featured: boolean;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  bulletPoints: string[];
  techStack: string[];
  keyMetric?: string;
  githubUrl?: string;
  documentUrl?: string;
  documentName?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  documentUrl?: string;
  documentName?: string;
  badgeCode: string;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: string;
  location?: string;
  score?: string;
  honors?: string;
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  whatsapp?: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  yearsExperience: number;
  availabilityStatus: 'actively_interviewing' | 'open_to_offers' | 'busy';
  availableFor: string[];
  preferredLocations: string[];
  salaryExpectation: string;
  aboutHighlights: string[];
  resumePdfUrl?: string;
  avatarUrl?: string;
  photoLayout?: 'top-to-bottom' | 'card' | 'background';
  photoPosition?: 'top' | 'center' | 'bottom';
  softSkills?: string[];
  languages?: string[];
}

export interface SecuritySettings {
  adminEmail: string;
  adminPhone?: string;
  adminPasskey: string;
  twoFactorEnabled?: boolean;
  lastUpdated: string;
  loginAttempts: number;
}

export interface NavbarTab {
  id: string;
  name: string;
  href: string;
  visible?: boolean;
  order?: number;
}

export interface SectionBackground {
  imageUrl?: string;
  overlayOpacity?: number; // 0 to 100
  blur?: number; // 0 to 20 px
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  size?: 'cover' | 'contain' | 'auto';
  position?: string;
}

export type SectionBackgroundMap = Record<string, SectionBackground>;

