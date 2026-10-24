import React, { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { openDocument } from '../utils/openDocument';
import { saveDocument, deleteStoredDocument, DOCUMENT_ACCEPT } from '../utils/documentStore';
import { GithubLinkTab } from './GithubLinkTab';
import { presetBackgrounds, BackgroundPreset } from '../data/initialData';
import { Project, Skill, Experience } from '../types';
import {
  X,
  LayoutDashboard,
  Layers,
  Cpu,
  Briefcase,
  Mail,
  User,
  Plus,
  Trash2,
  Edit2,
  Github,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  Clock,
  Building,
  DollarSign,
  Database,
  ShieldCheck,
  LogOut,
  Key,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Award,
  FileText,
  Phone,
  MessageCircle,
  Linkedin,
  Palette,
  Menu,
  Sliders,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Check,
  Image as ImageIcon
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const {
    isLoggedIn,
    isAdminModalOpen,
    setIsAdminModalOpen,
    activeAdminTab,
    setActiveAdminTab,
    profile,
    updateProfile,
    projects,
    addProject,
    updateProject,
    deleteProject,
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    experience,
    addExperience,
    updateExperience,
    deleteExperience,
    education,
    addEducation,
    updateEducation,
    deleteEducation,
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
    navbarTabs,
    updateNavbarTab,
    addNavbarTab,
    deleteNavbarTab,
    reorderNavbarTabs,
    resetNavbarTabs,
    sectionBackgrounds,
    updateSectionBackground,
    resetSectionBackground,
    resetAllSectionBackgrounds,
    activeBackgroundSection,
    setActiveBackgroundSection,
    openBackgroundModal,
    exportBackup,
    importBackup,
    resetToDefaults,
    logout,
    showToast,
    securitySettings,
    updateAdminSecurity
  } = usePortfolio();

  // Security credentials state
  const [adminEmailInput, setAdminEmailInput] = useState(securitySettings?.adminEmail || 'chvishnuvardhan371@gmail.com');
  const [adminPhoneInput, setAdminPhoneInput] = useState(securitySettings?.adminPhone || '+91 9290105665');
  const [adminPasskeyInput, setAdminPasskeyInput] = useState(securitySettings?.adminPasskey || 'Amma@197478*');
  const [showAdminPasskey, setShowAdminPasskey] = useState(false);

  // Project editing state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  const emptyCertForm = { title: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', verificationUrl: '', documentUrl: '', documentName: '', badgeCode: '' };
  const [certForm, setCertForm] = useState(emptyCertForm);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  const startEditCert = (cert: any) => {
    setCertForm({
      title: cert.title || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || '',
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId || '',
      verificationUrl: cert.verificationUrl || '',
      documentUrl: cert.documentUrl || '',
      documentName: cert.documentName || '',
      badgeCode: cert.badgeCode || '',
    });
    setEditingCertId(cert.id);
    setIsAddingCert(true);
  };

  const handleCertDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const result = await saveDocument(file);
    if (!result.ok) {
      showToast(result.error, 'error');
      return;
    }
    setCertForm((prev) => ({ ...prev, documentUrl: result.documentUrl, documentName: result.documentName }));
  };

  const closeCertForm = () => {
    setIsAddingCert(false);
    setEditingCertId(null);
    setCertForm(emptyCertForm);
  };

  const saveCertForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title.trim() || !certForm.issuer.trim()) return;
    const certData = {
      title: certForm.title.trim(),
      issuer: certForm.issuer.trim(),
      issueDate: certForm.issueDate.trim(),
      expiryDate: certForm.expiryDate.trim() || undefined,
      credentialId: certForm.credentialId.trim() || undefined,
      verificationUrl: certForm.verificationUrl.trim() || undefined,
      documentUrl: certForm.documentUrl || undefined,
      documentName: certForm.documentName || undefined,
      badgeCode: certForm.badgeCode.trim() || certForm.title.trim(),
    };
    if (editingCertId) {
      updateCertification(editingCertId, certData);
    } else {
      addCertification(certData);
    }
    closeCertForm();
  };
  // Contact details (editable from the admin dashboard)
  const contactFromProfile = () => ({
    email: profile.email || '',
    phone: profile.phone || '',
    whatsapp: profile.whatsapp || profile.phone || '',
    linkedinUrl: profile.linkedinUrl || '',
    githubUrl: profile.githubUrl || '',
  });
  const [contactForm, setContactForm] = useState(contactFromProfile());
  const [isEditingContact, setIsEditingContact] = useState(false);

  const startEditContact = () => {
    setContactForm(contactFromProfile());
    setIsEditingContact(true);
  };

  const saveContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    const f = {
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim(),
      whatsapp: contactForm.whatsapp.trim(),
      linkedinUrl: contactForm.linkedinUrl.trim(),
      githubUrl: contactForm.githubUrl.trim(),
    };
    const digits = (v: string) => v.replace(/\D/g, '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (digits(f.phone).length < 8 || digits(f.phone).length > 15) {
      showToast('Please enter a valid mobile number (8–15 digits, with country code).', 'error');
      return;
    }
    if (f.whatsapp && (digits(f.whatsapp).length < 8 || digits(f.whatsapp).length > 15)) {
      showToast('Please enter a valid WhatsApp number (8–15 digits, with country code).', 'error');
      return;
    }
    if (f.linkedinUrl && !/^https?:\/\/([a-z0-9-]+\.)?linkedin\.com\/.+/i.test(f.linkedinUrl)) {
      showToast('Please enter a valid LinkedIn link, e.g. https://www.linkedin.com/in/your-name/', 'error');
      return;
    }
    if (f.githubUrl && !/^https?:\/\/(www\.)?github\.com\/.+/i.test(f.githubUrl)) {
      showToast('Please enter a valid GitHub link, e.g. https://github.com/username', 'error');
      return;
    }
    updateProfile({
      email: f.email,
      phone: f.phone,
      whatsapp: f.whatsapp || f.phone,
      linkedinUrl: f.linkedinUrl,
      githubUrl: f.githubUrl,
    });
    setIsEditingContact(false);
  };

  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Skill editing state
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({});
  const [skillTagsText, setSkillTagsText] = useState('');
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  // Experience editing state
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState<Partial<Experience>>({});
  const [isCreatingExp, setIsCreatingExp] = useState(false);

  // Education editing state
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduForm, setEduForm] = useState<any>({});
  const [isCreatingEdu, setIsCreatingEdu] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState(profile);

  // Import JSON ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Menu Bar Tabs & Backgrounds State
  const [selectedBgSection, setSelectedBgSection] = useState<string>('overview');
  const [bgCustomUrlInput, setBgCustomUrlInput] = useState('');
  const [newTabName, setNewTabName] = useState('');
  const [newTabHref, setNewTabHref] = useState('');
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('File size is larger than 8 MB. Please select a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const currentBg = sectionBackgrounds[selectedBgSection] || { overlayOpacity: 85 };
        updateSectionBackground(selectedBgSection, {
          imageUrl: reader.result,
          overlayOpacity: currentBg.overlayOpacity ?? 85
        });
        showToast(`Uploaded custom photo for "${selectedBgSection}" section!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Strictly Admin-Only Guard
  if (!isAdminModalOpen || !isLoggedIn) return null;

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        updateProfile({ avatarUrl: reader.result as string });
        showToast('Profile photo updated successfully', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const res = await saveDocument(file);
    if (!res.ok) {
      showToast(res.error, 'error');
      return;
    }
    setProfileForm((prev) => ({ ...prev, resumePdfUrl: res.documentUrl }));
    updateProfile({ resumePdfUrl: res.documentUrl });
    showToast(`Resume "${res.documentName}" uploaded successfully`, 'success');
  };

  // Handlers for Project
  const startEditProject = (proj: Project) => {
    setEditingProjectId(proj.id);
    setProjectForm({ ...proj });
    setIsCreatingProject(false);
  };

  const startCreateProject = () => {
    setIsCreatingProject(true);
    setEditingProjectId(null);
    setProjectForm({
      title: 'New Distributed Service',
      slug: `service-${Date.now()}`,
      subtitle: 'Engineered with Spring Boot 4.1.1 and MySQL',
      category: '',
      description: 'High-performance microservice architecture designed for resilient throughput.',
      problemSolved: 'Eliminated bottlenecks and enabled real-time consistency.',
      architectureOverview: 'Angular UI -> Spring Cloud Gateway -> Spring Boot 4.1.1 -> MySQL InnoDB.',
      keyFeatures: ['Feature 1', 'Feature 2'],
      techStack: ['Spring Boot 4.1.1', 'Java JDK 17', 'MySQL', 'Docker'],
      coreStack: {
        frontend: 'Angular 18',
        backend: 'Spring Boot 4.1.1',
        javaVersion: 'Java JDK 17 LTS',
        database: 'MySQL 8.4 InnoDB'
      },
      metrics: ['20,000 TPS', '99.99% Uptime'],
      schemaHighlights: [
        {
          tableName: 'audit_records',
          purpose: 'Stores immutable system audit events.',
          columns: ['record_id BIGINT PRIMARY KEY', 'payload JSON', 'created_at TIMESTAMP'],
          keys: 'PRIMARY KEY (record_id)'
        }
      ],
      architectureSteps: [
        { title: '1. Ingestion', desc: 'Secure API request passed through gateway.' },
        { title: '2. Processing', desc: 'Spring Boot 4.1.1 worker completes mutation.' }
      ],
      featured: true,
      order: projects.length + 1
    });
  };

  const saveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingProject) {
      addProject(projectForm as any);
      setIsCreatingProject(false);
    } else if (editingProjectId) {
      updateProject(editingProjectId, projectForm);
      setEditingProjectId(null);
    }
  };

  // Handlers for Skill
  const startEditSkill = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setSkillForm({ ...skill });
    setSkillTagsText((skill.tags || []).join(', '));
    setIsCreatingSkill(false);
  };

  const startCreateSkill = () => {
    setIsCreatingSkill(true);
    setEditingSkillId(null);
    setSkillTagsText('');
    setSkillForm({
      name: '',
      category: '',
      proficiency: 85,
      years: 1,
      featured: false,
      description: '',
      tags: []
    });
  };

  const saveSkillForm = (e: React.FormEvent) => {
    e.preventDefault();
    const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
    const cleaned: Partial<Skill> = {
      ...skillForm,
      name: (skillForm.name || '').trim(),
      category: (skillForm.category || '').trim() || 'other',
      proficiency: clamp(Number(skillForm.proficiency), 0, 100),
      years: clamp(Number(skillForm.years), 0, 60),
      description: (skillForm.description || '').trim(),
      tags: skillTagsText.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (isCreatingSkill) {
      addSkill(cleaned as any);
      setIsCreatingSkill(false);
    } else if (editingSkillId) {
      updateSkill(editingSkillId, cleaned);
      setEditingSkillId(null);
    }
  };

  // Handlers for Experience
  const startEditExp = (exp: Experience) => {
    setEditingExpId(exp.id);
    setExpForm({ ...exp });
    setIsCreatingExp(false);
  };

  const startCreateExp = () => {
    setIsCreatingExp(true);
    setEditingExpId(null);
    setExpForm({
      role: 'Senior Full Stack Software Engineer',
      company: 'Enterprise Cloud Corp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      description: 'Engineered distributed microservices using Spring Boot 4.1.1, Angular, and MySQL.',
      bulletPoints: ['Architected scalable services with 99.99% availability.'],
      techStack: ['Spring Boot 4.1.1', 'Java 17', 'Angular 18', 'MySQL'],
      keyMetric: '35% Latency Reduction'
    });
  };

  const handleExpDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const result = await saveDocument(file);
    if (!result.ok) {
      showToast(result.error, 'error');
      return;
    }
    setExpForm((prev) => ({ ...prev, documentUrl: result.documentUrl, documentName: result.documentName }));
  };

  const saveExpForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingExp) {
      addExperience(expForm as any);
      setIsCreatingExp(false);
    } else if (editingExpId) {
      updateExperience(editingExpId, expForm);
      setEditingExpId(null);
    }
  };

  // Handlers for Education
  const startEditEdu = (edu: any) => {
    setEditingEduId(edu.id);
    setEduForm({ ...edu });
    setIsCreatingEdu(false);
  };

  const startCreateEdu = () => {
    setIsCreatingEdu(true);
    setEditingEduId(null);
    setEduForm({
      degree: 'Bachelor of Technology (B.Tech)',
      field: 'Computer Science & Engineering',
      institution: 'DNR College of Engineering & Technology',
      location: 'Bhimavaram, AP',
      year: '2019 – 2023',
      score: 'CGPA: 8.2 / 10',
      honors: 'Specialization in Distributed Systems & Database Architecture'
    });
  };

  const saveEduForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingEdu) {
      addEducation(eduForm);
      setIsCreatingEdu(false);
    } else if (editingEduId) {
      updateEducation(editingEduId, eduForm);
      setEditingEduId(null);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackup(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-6xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Dashboard Top Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Engineering Admin & Dashboard</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Persistence
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage projects, skills, resume credentials, and certifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-2 bg-slate-950 border-b border-slate-800 overflow-x-auto shrink-0 font-mono text-xs">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('projects')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'projects'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('skills')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'skills'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Skills Matrix ({skills.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('experience')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'experience'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Experience & Career</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('education')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'education'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Education ({education.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('certifications')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'certifications'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certifications ({certifications.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('contact')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'contact'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact Details</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('profile')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'profile'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Data Backup</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('navbar')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'navbar'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Menu Bar Tabs ({navbarTabs.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('backgrounds')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'backgrounds'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Section Backgrounds</span>
          </button>
        </div>

        {/* Dashboard Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW & STATS */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-mono">PUBLISHED PROJECTS</div>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">{projects.length}</div>
                  <div className="text-[11px] text-indigo-400 mt-1">Spring Boot 4.1.1 & Angular</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-mono">CORE SKILLS RECORDED</div>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">{skills.length}</div>
                  <div className="text-[11px] text-cyan-400 mt-1">Full-stack & MySQL Enterprise</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-mono">EXPERIENCE LEVEL</div>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">{profile.yearsExperience}+ Years</div>
                  <div className="text-[11px] text-amber-400 mt-1">Senior / Lead Architect</div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Quick Management Shortcuts</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setActiveAdminTab('projects');
                      startCreateProject();
                    }}
                    className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition group"
                  >
                    <div className="font-semibold text-xs text-white group-hover:text-indigo-300">
                      + Add New Project
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Showcase a new service or architecture
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveAdminTab('skills');
                      startCreateSkill();
                    }}
                    className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition group"
                  >
                    <div className="font-semibold text-xs text-white group-hover:text-indigo-300">
                      + Register New Skill
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Update proficiency or technology tags
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveAdminTab('education');
                      startCreateEdu();
                    }}
                    className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition group"
                  >
                    <div className="font-semibold text-xs text-white group-hover:text-cyan-300">
                      + Manage Education
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Add degrees, college scores, or honors
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('navbar')}
                    className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition group"
                  >
                    <div className="font-semibold text-xs text-white group-hover:text-indigo-300 flex items-center gap-1.5">
                      <Menu className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Edit Menu Bar Tabs</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Rename tabs, reorder navigation links, add custom routes
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('backgrounds')}
                    className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition group"
                  >
                    <div className="font-semibold text-xs text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Section Background Photos</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Manually choose or upload photos for each section with contrast controls
                    </div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROJECTS MANAGER */}
          {activeAdminTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white font-mono">
                    Enterprise Projects Catalog
                  </h4>
                  <p className="text-xs text-slate-400">
                    Add, edit, or adjust architecture diagrams and MySQL table schemas
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <GithubLinkTab />
                  {!isCreatingProject && !editingProjectId && (
                    <button
                      onClick={startCreateProject}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Project</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Project Editor Form */}
              {(isCreatingProject || editingProjectId) && (
                <form onSubmit={saveProjectForm} className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h5 className="text-sm font-bold text-indigo-300 font-mono">
                      {isCreatingProject ? 'Add New Project' : `Editing: ${projectForm.title}`}
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingProject(false);
                        setEditingProjectId(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                      <input
                        type="text"
                        required
                        value={projectForm.title || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                      <input
                        type="text"
                        list="project-category-options"
                        placeholder="Type a category (e.g. Networking, Machine Learning)"
                        value={projectForm.category || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                      <datalist id="project-category-options">
                        <option value="fullstack" />
                        <option value="backend" />
                        <option value="database" />
                        {Array.from(new Set(projects.map((p) => p.category).filter(Boolean))).map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Link (optional)</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={projectForm.repoUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Elevator Pitch</label>
                    <input
                      type="text"
                      value={projectForm.subtitle || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono">Frontend</label>
                      <input
                        type="text"
                        value={projectForm.coreStack?.frontend || ''}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          coreStack: { ...(projectForm.coreStack as any), frontend: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono">Backend</label>
                      <input
                        type="text"
                        value={projectForm.coreStack?.backend || ''}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          coreStack: { ...(projectForm.coreStack as any), backend: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono">Java Version</label>
                      <input
                        type="text"
                        value={projectForm.coreStack?.javaVersion || ''}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          coreStack: { ...(projectForm.coreStack as any), javaVersion: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono">Database</label>
                      <input
                        type="text"
                        value={projectForm.coreStack?.database || ''}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          coreStack: { ...(projectForm.coreStack as any), database: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Architecture Overview</label>
                    <textarea
                      rows={2}
                      value={projectForm.architectureOverview || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, architectureOverview: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Bottlenecks & Problem Solved</label>
                    <textarea
                      rows={2}
                      value={projectForm.problemSolved || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, problemSolved: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingProject(false);
                        setEditingProjectId(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Project</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Projects List */}
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{proj.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                          {proj.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{proj.subtitle}</p>
                      <div className="text-[11px] font-mono text-emerald-400">
                        {proj.coreStack.backend} • {proj.coreStack.database}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {proj.repoUrl ? (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                          title="Open project GitHub repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          onClick={() => startEditProject(proj)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white transition"
                          title="No GitHub link yet – click to add one"
                        >
                          <Github className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => startEditProject(proj)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS MANAGER */}
          {activeAdminTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white font-mono">Skills & Technology Matrix</h4>
                  <p className="text-xs text-slate-400">Adjust proficiency levels, years of experience, or add new stacks</p>
                </div>

                {!isCreatingSkill && !editingSkillId && (
                  <button
                    onClick={startCreateSkill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                )}
              </div>

              {/* Skill Edit Form */}
              {(isCreatingSkill || editingSkillId) && (
                <form onSubmit={saveSkillForm} className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h5 className="text-sm font-bold text-indigo-300 font-mono">
                      {isCreatingSkill ? 'Add New Skill' : `Edit: ${skillForm.name}`}
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingSkill(false);
                        setEditingSkillId(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Spring Security 6"
                        value={skillForm.name || ''}
                        onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                      <input
                        type="text"
                        required
                        list="skill-category-options"
                        placeholder="Type a category (e.g. networking, backend)"
                        value={skillForm.category || ''}
                        onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                      <datalist id="skill-category-options">
                        <option value="backend" />
                        <option value="frontend" />
                        <option value="database" />
                        <option value="networking" />
                        <option value="cloud_devops" />
                        {Array.from(new Set(skills.map((sk) => sk.category).filter(Boolean))).map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Proficiency (%)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={skillForm.proficiency ?? ''}
                          onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value === '' ? undefined : Number(e.target.value) })}
                          className="w-20 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skillForm.proficiency ?? 0}
                          onChange={(e) => setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Experience</label>
                      <input
                        type="number"
                        min={0}
                        max={60}
                        step="0.5"
                        value={skillForm.years ?? ''}
                        onChange={(e) => setSkillForm({ ...skillForm, years: e.target.value === '' ? undefined : Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Short description of what you did with this skill"
                      value={skillForm.description || ''}
                      onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Security, OAuth2, RBAC"
                      value={skillTagsText}
                      onChange={(e) => setSkillTagsText(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!skillForm.featured}
                      onChange={(e) => setSkillForm({ ...skillForm, featured: e.target.checked })}
                    />
                    <span>Featured skill</span>
                  </label>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingSkill(false);
                        setEditingSkillId(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Skill</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{s.name}</span>
                        <span className="text-[10px] font-mono text-indigo-400">{s.proficiency}%</span>
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">{s.category.replace('_', ' ')} • {s.years} yrs</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditSkill(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSkill(s.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE & RESUME MANAGER */}
          {activeAdminTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white font-mono">Work Experience & Timeline</h4>
                  <p className="text-xs text-slate-400">Update professional positions and engineering bullet points</p>
                </div>

                <div className="flex items-center gap-2">
                  <GithubLinkTab />
                  {!isCreatingExp && !editingExpId && (
                    <button
                      onClick={startCreateExp}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Position</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Experience Form */}
              {(isCreatingExp || editingExpId) && (
                <form onSubmit={saveExpForm} className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h5 className="text-sm font-bold text-indigo-300 font-mono">
                      {isCreatingExp ? 'Add Experience' : `Edit: ${expForm.role}`}
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingExp(false);
                        setEditingExpId(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
                      <input
                        type="text"
                        required
                        value={expForm.role || ''}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                      <input
                        type="text"
                        required
                        value={expForm.company || ''}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={expForm.startDate || ''}
                        onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                      <input
                        type="text"
                        value={expForm.endDate || ''}
                        onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Key Metric</label>
                      <input
                        type="text"
                        value={expForm.keyMetric || ''}
                        onChange={(e) => setExpForm({ ...expForm, keyMetric: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Role Description</label>
                    <textarea
                      rows={2}
                      value={expForm.description || ''}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Link (optional)</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={expForm.githubUrl || ''}
                      onChange={(e) => setExpForm({ ...expForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Document (optional – PNG, JPEG, PDF, ZIP or RAR, max 5 MB)</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        accept={DOCUMENT_ACCEPT}
                        onChange={handleExpDocument}
                        className="text-xs text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-xs file:font-semibold hover:file:bg-indigo-500"
                      />
                      {expForm.documentUrl && (
                        <span className="flex items-center gap-2 text-[11px] text-emerald-300">
                          <FileText className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[220px]">{expForm.documentName || 'Document attached'}</span>
                          <button
                            type="button"
                            onClick={() => setExpForm({ ...expForm, documentUrl: '', documentName: '' })}
                            className="text-slate-400 hover:text-red-400"
                            title="Remove document"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingExp(false);
                        setEditingExpId(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Experience</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Experience Entries */}
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">
                        {exp.role} — <span className="text-indigo-400 font-mono">{exp.company}</span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {exp.startDate} – {exp.endDate} | {exp.location}
                      </div>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                        {exp.description}
                      </p>
                      {exp.documentUrl && (
                        <button
                          type="button"
                          onClick={() => openDocument(exp.documentUrl!)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:text-emerald-200"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{exp.documentName || 'View document'}</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {exp.githubUrl ? (
                        <a
                          href={exp.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                          title="Open GitHub link"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          onClick={() => startEditExp(exp)}
                          className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-slate-900"
                          title="No GitHub link yet – click to add one"
                        >
                          <Github className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => startEditExp(exp)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                        title="Edit Role"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { deleteStoredDocument(exp.documentUrl); deleteExperience(exp.id); }}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EDUCATION */}
          {activeAdminTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <span>Education & Academic Qualifications ({education.length})</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Manage degrees, engineering honors, intermediate, and secondary school records
                  </p>
                </div>

                  {!isCreatingEdu && !editingEduId && (
                    <button
                      onClick={startCreateEdu}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Degree / School</span>
                    </button>
                  )}
                </div>

                {/* Education Form */}
                {(isCreatingEdu || editingEduId) && (
                  <form onSubmit={saveEduForm} className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h5 className="text-sm font-bold text-cyan-300 font-mono">
                        {isCreatingEdu ? 'Add New Academic Qualification' : `Edit: ${eduForm.degree}`}
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingEdu(false);
                          setEditingEduId(null);
                        }}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Degree / Qualification *</label>
                        <input
                          type="text"
                          required
                          value={eduForm.degree || ''}
                          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                          placeholder="e.g. Bachelor of Technology (B.Tech)"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Major / Branch / Field</label>
                        <input
                          type="text"
                          value={eduForm.field || ''}
                          onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                          placeholder="e.g. Computer Science & Engineering"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Institution / College / School *</label>
                      <input
                        type="text"
                        required
                        value={eduForm.institution || ''}
                        onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                        placeholder="e.g. DNR College of Engineering & Technology"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                        <input
                          type="text"
                          value={eduForm.location || ''}
                          onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                          placeholder="e.g. Bhimavaram, AP"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Duration / Years</label>
                        <input
                          type="text"
                          value={eduForm.year || ''}
                          onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                          placeholder="e.g. 2019 – 2023"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Score / CGPA / %</label>
                        <input
                          type="text"
                          value={eduForm.score || ''}
                          onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })}
                          placeholder="e.g. CGPA: 8.2 / 10"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization / Honors / Board</label>
                      <input
                        type="text"
                        value={eduForm.honors || ''}
                        onChange={(e) => setEduForm({ ...eduForm, honors: e.target.value })}
                        placeholder="e.g. Specialization in Distributed Systems & Database Architecture"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingEdu(false);
                          setEditingEduId(null);
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Education</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Education List */}
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white text-sm">{edu.degree}</span>
                          {edu.score && (
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {edu.score}
                            </span>
                          )}
                        </div>
                        {edu.field && (
                          <div className="text-xs text-indigo-400 font-mono">
                            {edu.field}
                          </div>
                        )}
                        <div className="text-xs text-slate-300">
                          {edu.institution} {edu.location && `• ${edu.location}`}
                        </div>
                        {edu.honors && (
                          <div className="text-[11px] text-cyan-300 font-mono">
                            {edu.honors}
                          </div>
                        )}
                        <div className="text-[11px] font-mono text-slate-500">
                          Period: {edu.year}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEditEdu(edu)}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                          title="Edit Education"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEducation(edu.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900"
                          title="Delete Education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {activeAdminTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Professional Certifications ({certifications.length})</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Add, edit or remove certifications shown on your portfolio
                  </p>
                </div>

                {!isAddingCert && (
                  <button
                    onClick={() => { setEditingCertId(null); setCertForm(emptyCertForm); setIsAddingCert(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certification</span>
                  </button>
                )}
              </div>

              {isAddingCert && (
                <form onSubmit={saveCertForm} className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h5 className="text-sm font-bold text-white">{editingCertId ? 'Edit Certification' : 'Add New Certification'}</h5>
                    <button
                      type="button"
                      onClick={closeCertForm}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Certification Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Java Full Stack Development"
                          value={certForm.title}
                          onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Issuer</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Capgemini"
                          value={certForm.issuer}
                          onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Date</label>
                        <input
                          type="text"
                          
                          placeholder="e.g. 2024"
                          value={certForm.issueDate}
                          onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date (optional)</label>
                        <input
                          type="text"
                          
                          placeholder="e.g. 2027"
                          value={certForm.expiryDate}
                          onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Credential ID (optional)</label>
                        <input
                          type="text"
                          
                          placeholder=""
                          value={certForm.credentialId}
                          onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Verification URL (optional)</label>
                        <input
                          type="text"
                          
                          placeholder="https://"
                          value={certForm.verificationUrl}
                          onChange={(e) => setCertForm({ ...certForm, verificationUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Label</label>
                        <input
                          type="text"
                          
                          placeholder="Short label shown on the badge"
                          value={certForm.badgeCode}
                          onChange={(e) => setCertForm({ ...certForm, badgeCode: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Document (optional – PNG, JPEG, PDF, ZIP or RAR, max 5 MB)</label>
                        <div className="flex flex-wrap items-center gap-3">
                          <input
                            type="file"
                            accept={DOCUMENT_ACCEPT}
                            onChange={handleCertDocument}
                            className="text-xs text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:text-xs file:font-semibold hover:file:bg-amber-500"
                          />
                          {certForm.documentUrl && (
                            <span className="flex items-center gap-2 text-[11px] text-emerald-300">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[220px]">{certForm.documentName || 'Document attached'}</span>
                              <button
                                type="button"
                                onClick={() => setCertForm({ ...certForm, documentUrl: '', documentName: '' })}
                                className="text-slate-400 hover:text-red-400"
                                title="Remove document"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeCertForm}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingCertId ? 'Update Certification' : 'Save Certification'}</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {certifications.length === 0 && (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                    No certifications yet. Click "Add Certification" to create one.
                  </div>
                )}
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-white">{cert.title}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {cert.badgeCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {cert.issuer} • Issued {cert.issueDate}
                      </div>
                      {cert.documentUrl && (
                        <button
                          type="button"
                          onClick={() => openDocument(cert.documentUrl!)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:text-emerald-200"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{cert.documentName || 'View document'}</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEditCert(cert)}
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition"
                        title="Edit certification"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove certification "${cert.title}"?`)) { deleteStoredDocument(cert.documentUrl); deleteCertification(cert.id); }
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete certification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT DETAILS */}
          {activeAdminTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span>Contact Details</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Changes here update the Contact section, footer and resume across the whole portfolio
                  </p>
                </div>

                {!isEditingContact && (
                  <button
                    onClick={startEditContact}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Contact Details</span>
                  </button>
                )}
              </div>

              {isEditingContact ? (
                <form onSubmit={saveContactForm} className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Gmail / Email</span>
                      </label>
                      <input
                        type="email"
                        required={true}
                        placeholder="name@gmail.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Mobile Number</span>
                      </label>
                      <input
                        type="tel"
                        required={true}
                        placeholder="+91 90000 00000"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                        <span>WhatsApp Number</span>
                      </label>
                      <input
                        type="tel"
                        required={false}
                        placeholder="+91 90000 00000 (leave blank to use mobile)"
                        value={contactForm.whatsapp}
                        onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>LinkedIn Link</span>
                      </label>
                      <input
                        type="url"
                        required={false}
                        placeholder="https://www.linkedin.com/in/your-name/"
                        value={contactForm.linkedinUrl}
                        onChange={(e) => setContactForm({ ...contactForm, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-cyan-400" />
                        <span>GitHub Link</span>
                      </label>
                      <input
                        type="url"
                        required={false}
                        placeholder="https://github.com/username"
                        value={contactForm.githubUrl}
                        onChange={(e) => setContactForm({ ...contactForm, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingContact(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Contact Details</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Gmail / Email</div>
                      <div className="font-mono text-xs text-indigo-300 break-all">{profile.email}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Mobile</div>
                      <div className="font-mono text-xs text-indigo-300 break-all">{profile.phone}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">WhatsApp</div>
                      <div className="font-mono text-xs text-indigo-300 break-all">{profile.whatsapp || profile.phone}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">LinkedIn</div>
                      <div className="font-mono text-xs text-indigo-300 break-all">{profile.linkedinUrl}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <Github className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">GitHub</div>
                      <div className="font-mono text-xs text-indigo-300 break-all">{profile.githubUrl}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeAdminTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white font-mono">Profile Details & Backup Tools</h4>
                <p className="text-xs text-slate-400">Modify portfolio identity or export / restore JSON backups</p>
              </div>

              {/* Profile Edit Form */}
              <form onSubmit={handleProfileSave} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile Link</label>
                    <input
                      type="url"
                      value={profileForm.githubUrl || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile Link</label>
                    <input
                      type="url"
                      value={profileForm.linkedinUrl || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Executive Summary / Bio</label>
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed"
                  />
                </div>

                {/* Profile Photo and Resume File Choosers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Choose Hero Profile Photo</span>
                      {profileForm.avatarUrl && <span className="text-[10px] text-emerald-400 font-mono">Custom photo active</span>}
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleProfilePhotoUpload}
                      className="text-xs text-slate-300 file:mr-2 file:px-2.5 file:py-1 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-xs file:font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Choose Downloadable Resume PDF</span>
                      {profileForm.resumePdfUrl && <span className="text-[10px] text-emerald-400 font-mono">PDF attached</span>}
                    </label>
                    <input
                      type="file"
                      accept={DOCUMENT_ACCEPT}
                      onChange={handleProfileResumeUpload}
                      className="text-xs text-slate-300 file:mr-2 file:px-2.5 file:py-1 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:text-xs file:font-semibold"
                    />
                  </div>
                </div>

                {/* Overview Photo Display Style (Overview section only) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Overview Photo Layout (Overview Only)
                    </label>
                    <select
                      value={profileForm.photoLayout || 'top-to-bottom'}
                      onChange={(e) => setProfileForm({ ...profileForm, photoLayout: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      <option value="top-to-bottom">Top to Bottom (Full Height) - Default</option>
                      <option value="card">Framed Portrait Card</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Stretches Vishnu's photo from the top to bottom edge of the overview section only.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Vertical Framing Align
                    </label>
                    <select
                      value={profileForm.photoPosition || 'top'}
                      onChange={(e) => setProfileForm({ ...profileForm, photoPosition: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      <option value="top">Top (Head & Shoulders)</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Controls how the portrait is centered vertically when cropped.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Updates</span>
                  </button>
                </div>
              </form>

              {/* Admin Security & Database Passkey Section */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h5 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Admin Security & Passkey Management</span>
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Credentials configured and verified in persistent database
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Database Saved</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Admin Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={adminEmailInput}
                        onChange={(e) => setAdminEmailInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={adminPhoneInput}
                        onChange={(e) => setAdminPhoneInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Admin Passkey
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPasskey ? "text" : "password"}
                        value={adminPasskeyInput}
                        onChange={(e) => setAdminPasskeyInput(e.target.value)}
                        className="w-full px-3 py-2 pr-10 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPasskey(!showAdminPasskey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                        title={showAdminPasskey ? "Hide" : "Show"}
                      >
                        {showAdminPasskey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Current Active Passkey: <code className="text-emerald-400 font-mono font-bold">Amma@197478*</code></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateAdminSecurity(adminEmailInput, adminPasskeyInput, adminPhoneInput);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition shadow-sm"
                  >
                    Save & Update Database Credentials
                  </button>
                </div>
              </div>

              {/* Data Portability & Reset Section */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h5 className="text-sm font-bold text-white font-mono">
                  Data Portability & Database Management
                </h5>
                <p className="text-xs text-slate-400">
                  Export complete portfolio state to JSON file, import a backup snapshot, or reset to original presentation.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={exportBackup}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Export Data (JSON)</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Import JSON Backup</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileImport}
                    accept=".json"
                    className="hidden"
                  />

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all portfolio data to factory defaults?')) {
                        resetToDefaults();
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-500/30 text-xs font-semibold transition ml-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MENU BAR TABS MANAGER */}
          {activeAdminTab === 'navbar' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <Menu className="w-4 h-4 text-indigo-400" />
                    <span>Menu Bar Navigation Tabs</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Customize navigation tabs, labels, target links, ordering, and visibility.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset all menu bar navigation tabs to default configuration?')) {
                      resetNavbarTabs();
                      showToast('Reset menu tabs to defaults.', 'info');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-semibold transition shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Tabs</span>
                </button>
              </div>

              {/* Add New Tab Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Add New Menu Tab</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Tab Display Label
                    </label>
                    <input
                      type="text"
                      value={newTabName}
                      onChange={(e) => setNewTabName(e.target.value)}
                      placeholder="e.g. Certifications, Research, Publications"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Target Link / Anchor URL
                    </label>
                    <input
                      type="text"
                      value={newTabHref}
                      onChange={(e) => setNewTabHref(e.target.value)}
                      placeholder="e.g. #certifications or https://..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newTabName.trim() || !newTabHref.trim()) {
                          showToast('Please provide both Tab Name and Link target URL.', 'error');
                          return;
                        }
                        addNavbarTab({
                          name: newTabName.trim(),
                          href: newTabHref.trim(),
                          visible: true,
                          order: navbarTabs.length
                        });
                        setNewTabName('');
                        setNewTabHref('');
                        showToast('New menu tab added to navbar!', 'success');
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Tab</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* List of Current Menu Tabs */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider px-1">
                  Active Menu Tabs ({navbarTabs.length})
                </div>
                <div className="space-y-2">
                  {navbarTabs.map((tab, idx) => (
                    <div
                      key={tab.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      {/* Left: Reorder & Name */}
                      <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx > 0) {
                                const newIds = [...navbarTabs.map((t) => t.id)];
                                [newIds[idx - 1], newIds[idx]] = [newIds[idx], newIds[idx - 1]];
                                reorderNavbarTabs(newIds);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-25 hover:bg-slate-800"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === navbarTabs.length - 1}
                            onClick={() => {
                              if (idx < navbarTabs.length - 1) {
                                const newIds = [...navbarTabs.map((t) => t.id)];
                                [newIds[idx], newIds[idx + 1]] = [newIds[idx + 1], newIds[idx]];
                                reorderNavbarTabs(newIds);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-25 hover:bg-slate-800"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="w-5 text-center text-xs font-mono text-slate-500 font-bold shrink-0">
                          {idx + 1}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                          <div>
                            <input
                              type="text"
                              value={tab.name}
                              onChange={(e) => updateNavbarTab(tab.id, { name: e.target.value })}
                              placeholder="Tab Name"
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={tab.href}
                              onChange={(e) => updateNavbarTab(tab.id, { href: e.target.value })}
                              placeholder="#section or URL"
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Visibility Toggle & Delete */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            updateNavbarTab(tab.id, { visible: tab.visible === false });
                            showToast(
                              `Tab "${tab.name}" is now ${tab.visible === false ? 'visible' : 'hidden'} on navbar`,
                              'info'
                            );
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                            tab.visible !== false
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-850 text-slate-400 border border-slate-700'
                          }`}
                          title="Toggle visibility in header navigation"
                        >
                          {tab.visible !== false ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete menu tab "${tab.name}"?`)) {
                              deleteNavbarTab(tab.id);
                              showToast(`Deleted tab "${tab.name}".`, 'info');
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-500/20 rounded-lg transition"
                          title="Delete tab"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECTION BACKGROUND PHOTOS MANAGER */}
          {activeAdminTab === 'backgrounds' && (() => {
            const currentBg = sectionBackgrounds[selectedBgSection] || {
              imageUrl: '',
              overlayOpacity: 85,
              blur: 0,
              size: 'cover',
              position: 'center'
            };

            const availableSections = [
              { id: 'overview', label: 'Overview / Hero' },
              { id: 'skills', label: 'Technical Skills' },
              { id: 'projects', label: 'Projects Catalog' },
              { id: 'experience', label: 'Experience & Career' },
              { id: 'certifications', label: 'Certifications' },
              { id: 'education', label: 'Education' },
              { id: 'contact', label: 'Contact Details' }
            ];

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                      <Palette className="w-4 h-4 text-cyan-400" />
                      <span>Section Background Photos (Manual Customizer)</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Choose or upload high-resolution background photos for each menu bar section with contrast & blur tuning.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset all section backgrounds to system defaults?')) {
                        resetAllSectionBackgrounds();
                        showToast('Reset all section backgrounds.', 'info');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-semibold transition shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Backgrounds</span>
                  </button>
                </div>

                {/* Section Selector Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {availableSections.map((sec) => {
                    const hasCustom = Boolean(sectionBackgrounds[sec.id]?.imageUrl);
                    const isSelected = selectedBgSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setSelectedBgSection(sec.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-850'
                        }`}
                      >
                        <span>{sec.label}</span>
                        {hasCustom && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" title="Has custom photo" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active Section Preview Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                        Customizing Section: <span className="text-white capitalize">{selectedBgSection}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {currentBg.imageUrl ? 'Custom background photo applied' : 'Using default dark theme pattern'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentBg.imageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            resetSectionBackground(selectedBgSection);
                            showToast(`Removed custom photo from ${selectedBgSection}`, 'info');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-500/25 text-xs transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Photo</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentBg.imageUrl) {
                            showToast('Please select or upload a photo for this section first.', 'info');
                            return;
                          }
                          availableSections.forEach((s) => {
                            updateSectionBackground(s.id, {
                              imageUrl: currentBg.imageUrl,
                              overlayOpacity: currentBg.overlayOpacity ?? 85,
                              blur: currentBg.blur ?? 0
                            });
                          });
                          showToast('Applied this background photo to ALL sections!', 'success');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition"
                      >
                        <Layers className="w-3 h-3" />
                        <span>Apply to All Sections</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Photo Preview Window */}
                  <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                    {currentBg.imageUrl ? (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                          style={{
                            backgroundImage: `url(${currentBg.imageUrl})`,
                            filter: currentBg.blur ? `blur(${currentBg.blur}px)` : undefined,
                            transform: currentBg.blur ? 'scale(1.05)' : undefined
                          }}
                        />
                        <div
                          className="absolute inset-0 transition-all duration-300"
                          style={{
                            backgroundColor: `rgba(2, 6, 23, ${(currentBg.overlayOpacity ?? 85) / 100})`
                          }}
                        />
                      </>
                    ) : (
                      <div className="text-slate-500 text-xs flex flex-col items-center gap-1.5">
                        <ImageIcon className="w-6 h-6 opacity-40" />
                        <span>No custom photo chosen yet for this section</span>
                      </div>
                    )}

                    <div className="relative z-10 text-center px-4">
                      <div className="font-mono font-bold text-white text-sm">
                        {selectedBgSection.toUpperCase()} PREVIEW
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        High-contrast text preview with dark veil ({currentBg.overlayOpacity ?? 85}%)
                      </div>
                    </div>
                  </div>

                  {/* Visual Tuning Controls (Contrast & Blur) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Dark Contrast Overlay</span>
                        </span>
                        <span className="text-cyan-400 font-bold">{currentBg.overlayOpacity ?? 85}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="95"
                        step="5"
                        value={currentBg.overlayOpacity ?? 85}
                        onChange={(e) => {
                          updateSectionBackground(selectedBgSection, {
                            overlayOpacity: Number(e.target.value)
                          });
                        }}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="text-[10px] text-slate-500 mt-1">
                        Higher percentage ensures cards, buttons, and code blocks stand out cleanly.
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Background Soft Blur</span>
                        </span>
                        <span className="text-indigo-400 font-bold">{currentBg.blur ?? 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="16"
                        step="1"
                        value={currentBg.blur ?? 0}
                        onChange={(e) => {
                          updateSectionBackground(selectedBgSection, {
                            blur: Number(e.target.value)
                          });
                        }}
                        className="w-full accent-indigo-400 cursor-pointer"
                      />
                      <div className="text-[10px] text-slate-500 mt-1">
                        Softens intricate background patterns for cinematic depth.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload & Choose Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A: Manual File Upload from Computer */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Option 1: Upload Photo from Device</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Select any high-resolution wallpaper or architecture screenshot from your computer.
                    </p>

                    <button
                      type="button"
                      onClick={() => bgFileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2 transition shadow-sm group"
                    >
                      <Upload className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                      <span>Choose Photo File (PNG, JPG, WEBP)</span>
                    </button>
                    <input
                      type="file"
                      ref={bgFileInputRef}
                      onChange={handleBgFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Option B: Enter Custom Photo URL */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Option 2: Enter Image URL</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Paste a direct image link from Unsplash, Cloud storage, or your CDN.
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={bgCustomUrlInput}
                        onChange={(e) => setBgCustomUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!bgCustomUrlInput.trim()) return;
                          updateSectionBackground(selectedBgSection, {
                            imageUrl: bgCustomUrlInput.trim(),
                            overlayOpacity: currentBg.overlayOpacity ?? 85
                          });
                          setBgCustomUrlInput('');
                          showToast(`Applied custom photo URL to ${selectedBgSection}`, 'success');
                        }}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Option C: Curated Tech Presets */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Option 3: Curated Tech & Datacenter Presets</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Click any curated photo preset to apply instantly to the <strong className="text-white capitalize">{selectedBgSection}</strong> section:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-1">
                    {presetBackgrounds.map((preset) => {
                      const isActive = currentBg.imageUrl === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            updateSectionBackground(selectedBgSection, {
                              imageUrl: preset.url,
                              overlayOpacity: currentBg.overlayOpacity ?? 85
                            });
                            showToast(`Applied "${preset.name}" to ${selectedBgSection}`, 'success');
                          }}
                          className={`relative rounded-xl overflow-hidden border text-left group transition flex flex-col ${
                            isActive
                              ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                              : 'border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <div className="h-20 w-full overflow-hidden bg-slate-900 relative">
                            <img
                              src={preset.preview}
                              alt={preset.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                              loading="lazy"
                            />
                            {isActive && (
                              <div className="absolute top-1 right-1 p-0.5 bg-cyan-500 text-slate-950 rounded-full">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 bg-slate-900/90 flex-1">
                            <div className="text-[11px] font-semibold text-white truncate leading-tight">
                              {preset.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                              {preset.category}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

      </div>
    </div>
  );
};
