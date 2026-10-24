import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Profile,
  Project,
  Skill,
  Experience,
  Certification,
  Education,
  SecuritySettings,
  NavbarTab,
  SectionBackground,
  SectionBackgroundMap
} from '../types';
import {
  initialProfile,
  initialSkills,
  initialProjects,
  initialExperience,
  initialCertifications,
  initialEducation,
  initialSecuritySettings,
  defaultNavbarTabs,
  initialSectionBackgrounds
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface PortfolioState {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
  education: Education[];
  securitySettings: SecuritySettings;
  navbarTabs: NavbarTab[];
  sectionBackgrounds: SectionBackgroundMap;
}

export type QuickEditTargetType =
  | 'project'
  | 'skill'
  | 'experience'
  | 'education'
  | 'certification'
  | 'contact'
  | 'profile'
  | 'sectionBackground'
  | 'navbarTabs';

export type AdminTabType =
  | 'overview'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'contact'
  | 'profile'
  | 'backgrounds'
  | 'navbar';

interface PortfolioContextType {
  // Data
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
  education: Education[];
  securitySettings: SecuritySettings;
  navbarTabs: NavbarTab[];
  sectionBackgrounds: SectionBackgroundMap;
  
  // Auth & Live Edit
  isLoggedIn: boolean;
  userEmail: string;
  liveEditMode: boolean;
  toggleLiveEdit: () => void;
  verifyFirstStep: (password: string, email?: string) => boolean;
  login: (password: string, email?: string) => boolean;
  logout: () => void;
  updateAdminSecurity: (email: string, passkey: string, phone?: string) => void;

  // Login Prompt Modal
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  openAdminOrLogin: (tab?: AdminTabType) => void;

  // Mutators (strictly guarded by isLoggedIn)
  updateProfile: (profile: Partial<Profile>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (orderedIds: string[]) => void;

  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;

  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  deleteEducation: (id: string) => void;

  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, updates: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;

  // Menu Bar (Navbar Tabs) Mutators
  updateNavbarTab: (id: string, updates: Partial<NavbarTab>) => void;
  addNavbarTab: (tab: Omit<NavbarTab, 'id'>) => void;
  deleteNavbarTab: (id: string) => void;
  reorderNavbarTabs: (orderedIds: string[]) => void;
  resetNavbarTabs: () => void;

  // Section Backgrounds Mutators
  updateSectionBackground: (sectionId: string, background: Partial<SectionBackground>) => void;
  resetSectionBackground: (sectionId: string) => void;
  resetAllSectionBackgrounds: () => void;

  // System & Data backup
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
  resetToDefaults: () => void;

  // Active Modals & Selected Project
  selectedProjectForModal: Project | null;
  setSelectedProjectForModal: (project: Project | null) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isResumeModalOpen: boolean;
  setIsResumeModalOpen: (open: boolean) => void;
  activeAdminTab: AdminTabType;
  setActiveAdminTab: (tab: AdminTabType) => void;

  // Background / Menu Bar Customizer Modal
  isBackgroundModalOpen: boolean;
  setIsBackgroundModalOpen: (open: boolean) => void;
  activeBackgroundSection: string;
  setActiveBackgroundSection: (sectionId: string) => void;
  openBackgroundModal: (sectionId?: string) => void;

  // Quick edit modal
  quickEditTarget: { type: QuickEditTargetType; id?: string } | null;
  setQuickEditTarget: (target: { type: QuickEditTargetType; id?: string } | null) => void;

  // Toasts
  toasts: Toast[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const STORAGE_KEY = 'vishnu_portfolio_v4';
const AUTH_KEY = 'vishnu_portfolio_auth';
const BROADCAST_CHANNEL = 'vishnu_portfolio_sync';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PortfolioState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('vishnu_portfolio_v3') || localStorage.getItem('vishnu_portfolio_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile?.name?.includes("VISHNU VARDHAN")) {
          return {
            ...parsed,
            profile: {
              ...initialProfile,
              ...parsed.profile,
              location: (parsed.profile?.location && !parsed.profile.location.includes("Sanath Nagar"))
                ? parsed.profile.location
                : initialProfile.location,
              githubUrl: (parsed.profile?.githubUrl && !parsed.profile.githubUrl.includes("vishnuvardhan-dev"))
                ? parsed.profile.githubUrl
                : initialProfile.githubUrl,
              avatarUrl: parsed.profile?.avatarUrl || initialProfile.avatarUrl,
            },
            projects: (parsed.projects && parsed.projects.length > 0)
              ? parsed.projects.map((p: any) => ({
                  ...p,
                  repoUrl: p.repoUrl ? p.repoUrl.replace("vishnuvardhan-dev", "VishnuBVRM") : p.repoUrl
                }))
              : initialProjects,
            education: (parsed.education && parsed.education.length >= 3) ? parsed.education : initialEducation,
            securitySettings: {
              adminEmail: parsed.securitySettings?.adminEmail || initialSecuritySettings.adminEmail,
              adminPhone: parsed.securitySettings?.adminPhone || initialSecuritySettings.adminPhone,
              adminPasskey: parsed.securitySettings?.adminPasskey || initialSecuritySettings.adminPasskey,
              twoFactorEnabled: false,
              lastUpdated: parsed.securitySettings?.lastUpdated || initialSecuritySettings.lastUpdated,
              loginAttempts: parsed.securitySettings?.loginAttempts || 0,
            },
            navbarTabs: (parsed.navbarTabs && parsed.navbarTabs.length > 0)
              ? parsed.navbarTabs
              : defaultNavbarTabs,
            sectionBackgrounds: parsed.sectionBackgrounds || initialSectionBackgrounds,
          };
        }
      }
    } catch (e) {
      console.error('Error loading portfolio state from localStorage', e);
    }
    return {
      profile: initialProfile,
      skills: initialSkills,
      projects: initialProjects,
      experience: initialExperience,
      certifications: initialCertifications,
      education: initialEducation,
      securitySettings: initialSecuritySettings,
      navbarTabs: defaultNavbarTabs,
      sectionBackgrounds: initialSectionBackgrounds,
    };
  });

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [userEmail, setUserEmail] = useState<string>("chvishnuvardhan371@gmail.com");
  const [liveEditMode, setLiveEditMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Navigation state
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTabType>('overview');
  const [quickEditTarget, setQuickEditTargetState] = useState<{ type: QuickEditTargetType; id?: string } | null>(null);

  // Background / Menu Customizer Modal state
  const [isBackgroundModalOpen, setIsBackgroundModalOpenState] = useState<boolean>(false);
  const [activeBackgroundSection, setActiveBackgroundSection] = useState<string>('overview');

  const setIsBackgroundModalOpen = (open: boolean) => {
    if (open && !isLoggedIn) {
      showToast('Admin access required to change menu bar and background photos.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    setIsBackgroundModalOpenState(open);
  };

  const openBackgroundModal = (sectionId: string = 'overview') => {
    if (!isLoggedIn) {
      showToast('Admin access required to customize menu bar & background photos.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    setActiveBackgroundSection(sectionId);
    setIsBackgroundModalOpenState(true);
  };

  // Guard quickEditTarget so only logged-in Admin can trigger it
  const setQuickEditTarget = (target: { type: QuickEditTargetType; id?: string } | null) => {
    if (target && !isLoggedIn) {
      showToast('Admin access required to edit portfolio items.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    setQuickEditTargetState(target);
  };

  // Guard AdminModal so only logged-in Admin can open it
  const handleSetIsAdminModalOpen = (open: boolean) => {
    if (open && !isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsAdminModalOpen(open);
  };

  const openAdminOrLogin = (tab: AdminTabType = 'overview') => {
    if (isLoggedIn) {
      setActiveAdminTab(tab);
      setIsAdminModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Toast Notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const saveState = (newState: PortfolioState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL);
        channel.postMessage({ type: 'STATE_UPDATE', payload: newState });
        channel.close();
      }
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  };

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(BROADCAST_CHANNEL);
    channel.onmessage = (event) => {
      if (event.data?.type === 'STATE_UPDATE' && event.data.payload) {
        setState(event.data.payload);
        showToast('Portfolio data synchronized live from another session', 'info');
      }
    };
    return () => channel.close();
  }, []);

  // Auth functions
  const verifyFirstStep = (password: string, email?: string): boolean => {
    return login(password, email);
  };

  const login = (password: string, email: string = "chvishnuvardhan371@gmail.com"): boolean => {
    const trimmed = password.trim();
    const validEmail = (state.securitySettings?.adminEmail || "chvishnuvardhan371@gmail.com").trim().toLowerCase();
    if (email && email.trim() !== "" && email.trim().toLowerCase() !== validEmail) {
      showToast('Invalid Admin Email or Passkey.', 'error');
      return false;
    }
    const validPasskey = state.securitySettings?.adminPasskey || "Amma@197478*";

    if (trimmed === validPasskey || trimmed === "Amma@197478*") {
      setIsLoggedIn(true);
      setUserEmail(email || validEmail);
      setLiveEditMode(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {}
      showToast(`Welcome Vishnu! Authenticated as Admin. Live editing enabled.`, 'success');
      return true;
    }
    showToast('Invalid Admin Passkey. Please enter your authorized passkey.', 'error');
    return false;
  };

  const updateAdminSecurity = (email: string, passkey: string, phone?: string) => {
    if (!isLoggedIn) {
      showToast('Authentication required.', 'error');
      return;
    }
    const updated = {
      adminEmail: email,
      adminPhone: phone || state.securitySettings?.adminPhone || "+91 9290105665",
      adminPasskey: passkey,
      twoFactorEnabled: false,
      lastUpdated: new Date().toISOString(),
      loginAttempts: 0
    };
    saveState({
      ...state,
      securitySettings: updated
    });
    setUserEmail(email);
    showToast('Admin security credentials updated', 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setLiveEditMode(false);
    setIsAdminModalOpen(false);
    setIsBackgroundModalOpenState(false);
    setQuickEditTargetState(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
    showToast('Logged out of admin dashboard', 'info');
  };

  const toggleLiveEdit = () => {
    if (!isLoggedIn) return;
    setLiveEditMode((prev) => !prev);
    showToast(!liveEditMode ? 'Live Edit Mode Enabled - Click on any section or menu tab to edit' : 'Live Edit Mode Disabled', 'info');
  };

  // Profile operations (Admin-only)
  const updateProfile = (updates: Partial<Profile>) => {
    if (!isLoggedIn) return;
    const updated = { ...state.profile, ...updates };
    saveState({ ...state, profile: updated });
    showToast('Profile information updated successfully');
  };

  // Project operations (Admin-only)
  const addProject = (projectData: Omit<Project, 'id'>) => {
    if (!isLoggedIn) return;
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      order: state.projects.length + 1
    };
    saveState({
      ...state,
      projects: [newProject, ...state.projects]
    });
    showToast(`Project "${newProject.title}" added successfully`);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    if (!isLoggedIn) return;
    const updated = state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveState({ ...state, projects: updated });
    showToast('Project updated successfully');
  };

  const deleteProject = (id: string) => {
    if (!isLoggedIn) return;
    const target = state.projects.find((p) => p.id === id);
    const filtered = state.projects.filter((p) => p.id !== id);
    saveState({ ...state, projects: filtered });
    showToast(`Deleted project "${target?.title || id}"`, 'info');
  };

  const reorderProjects = (orderedIds: string[]) => {
    if (!isLoggedIn) return;
    const projectMap = new Map(state.projects.map((p) => [p.id, p]));
    const reordered: Project[] = [];
    orderedIds.forEach((id, index) => {
      const p = projectMap.get(id);
      if (p) {
        reordered.push({ ...p, order: index + 1 });
      }
    });
    state.projects.forEach((p) => {
      if (!orderedIds.includes(p.id)) {
        reordered.push({ ...p, order: reordered.length + 1 });
      }
    });
    saveState({ ...state, projects: reordered });
    showToast('Projects reordered');
  };

  // Skill operations (Admin-only)
  const addSkill = (skillData: Omit<Skill, 'id'>) => {
    if (!isLoggedIn) return;
    const newSkill: Skill = {
      ...skillData,
      id: `skill-${Date.now()}`
    };
    saveState({
      ...state,
      skills: [...state.skills, newSkill]
    });
    showToast(`Skill "${newSkill.name}" added`);
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    if (!isLoggedIn) return;
    const updated = state.skills.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveState({ ...state, skills: updated });
    showToast('Skill updated');
  };

  const deleteSkill = (id: string) => {
    if (!isLoggedIn) return;
    const target = state.skills.find((s) => s.id === id);
    const filtered = state.skills.filter((s) => s.id !== id);
    saveState({ ...state, skills: filtered });
    showToast(`Deleted skill "${target?.name || id}"`, 'info');
  };

  // Experience operations (Admin-only)
  const addExperience = (expData: Omit<Experience, 'id'>) => {
    if (!isLoggedIn) return;
    const newExp: Experience = {
      ...expData,
      id: `exp-${Date.now()}`
    };
    saveState({
      ...state,
      experience: [newExp, ...state.experience]
    });
    showToast(`Added experience at ${newExp.company}`);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    if (!isLoggedIn) return;
    const updated = state.experience.map((e) => (e.id === id ? { ...e, ...updates } : e));
    saveState({ ...state, experience: updated });
    showToast('Experience updated');
  };

  const deleteExperience = (id: string) => {
    if (!isLoggedIn) return;
    const filtered = state.experience.filter((e) => e.id !== id);
    saveState({ ...state, experience: filtered });
    showToast('Experience entry removed', 'info');
  };

  // Education operations (Admin-only)
  const addEducation = (eduData: Omit<Education, 'id'>) => {
    if (!isLoggedIn) return;
    const newEdu: Education = {
      ...eduData,
      id: `edu-${Date.now()}`
    };
    saveState({
      ...state,
      education: [...state.education, newEdu]
    });
    showToast(`Added education "${newEdu.degree}"`);
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    if (!isLoggedIn) return;
    const updated = state.education.map((e) => (e.id === id ? { ...e, ...updates } : e));
    saveState({ ...state, education: updated });
    showToast('Education record updated');
  };

  const deleteEducation = (id: string) => {
    if (!isLoggedIn) return;
    const filtered = state.education.filter((e) => e.id !== id);
    saveState({ ...state, education: filtered });
    showToast('Education record removed', 'info');
  };

  // Certification operations (Admin-only)
  const addCertification = (certData: Omit<Certification, 'id'>) => {
    if (!isLoggedIn) return;
    const newCert: Certification = {
      ...certData,
      id: `cert-${Date.now()}`
    };
    saveState({
      ...state,
      certifications: [...state.certifications, newCert]
    });
    showToast(`Added certification "${newCert.title}"`);
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    if (!isLoggedIn) return;
    const updated = state.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveState({ ...state, certifications: updated });
    showToast('Certification updated');
  };

  const deleteCertification = (id: string) => {
    if (!isLoggedIn) return;
    const filtered = state.certifications.filter((c) => c.id !== id);
    saveState({ ...state, certifications: filtered });
    showToast('Certification removed', 'info');
  };

  // Menu Bar (Navbar Tabs) Mutators (Admin-only)
  const updateNavbarTab = (id: string, updates: Partial<NavbarTab>) => {
    if (!isLoggedIn) return;
    const updated = state.navbarTabs.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveState({ ...state, navbarTabs: updated });
    showToast('Menu bar tab updated');
  };

  const addNavbarTab = (tabData: Omit<NavbarTab, 'id'>) => {
    if (!isLoggedIn) return;
    const id = tabData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || `tab-${Date.now()}`;
    const newTab: NavbarTab = {
      ...tabData,
      id,
      order: state.navbarTabs.length + 1,
      visible: true,
    };
    saveState({
      ...state,
      navbarTabs: [...state.navbarTabs, newTab],
      sectionBackgrounds: {
        ...state.sectionBackgrounds,
        [id]: {
          imageUrl: '',
          overlayOpacity: 80,
          blur: 0,
          size: 'cover',
          position: 'center',
        }
      }
    });
    showToast(`Menu bar tab "${newTab.name}" added`);
  };

  const deleteNavbarTab = (id: string) => {
    if (!isLoggedIn) return;
    const filtered = state.navbarTabs.filter((t) => t.id !== id);
    saveState({ ...state, navbarTabs: filtered });
    showToast('Menu bar tab removed', 'info');
  };

  const reorderNavbarTabs = (orderedIds: string[]) => {
    if (!isLoggedIn) return;
    const tabMap = new Map(state.navbarTabs.map((t) => [t.id, t]));
    const reordered: NavbarTab[] = [];
    orderedIds.forEach((id, idx) => {
      const t = tabMap.get(id);
      if (t) reordered.push({ ...t, order: idx + 1 });
    });
    state.navbarTabs.forEach((t) => {
      if (!orderedIds.includes(t.id)) reordered.push({ ...t, order: reordered.length + 1 });
    });
    saveState({ ...state, navbarTabs: reordered });
    showToast('Menu bar tabs reordered');
  };

  const resetNavbarTabs = () => {
    if (!isLoggedIn) return;
    saveState({ ...state, navbarTabs: defaultNavbarTabs });
    showToast('Menu bar tabs reset to default', 'info');
  };

  // Section Background Mutators (Admin-only)
  const updateSectionBackground = (sectionId: string, updates: Partial<SectionBackground>) => {
    if (!isLoggedIn) return;
    const current = state.sectionBackgrounds[sectionId] || {
      imageUrl: '',
      overlayOpacity: 80,
      blur: 0,
      size: 'cover',
      position: 'center'
    };
    const updatedMap: SectionBackgroundMap = {
      ...state.sectionBackgrounds,
      [sectionId]: {
        ...current,
        ...updates
      }
    };
    saveState({
      ...state,
      sectionBackgrounds: updatedMap
    });
    showToast(`Background photo for "${sectionId}" updated!`, 'success');
  };

  const resetSectionBackground = (sectionId: string) => {
    if (!isLoggedIn) return;
    const updatedMap: SectionBackgroundMap = {
      ...state.sectionBackgrounds,
      [sectionId]: initialSectionBackgrounds[sectionId] || {
        imageUrl: '',
        overlayOpacity: 80,
        blur: 0,
        size: 'cover',
        position: 'center'
      }
    };
    saveState({
      ...state,
      sectionBackgrounds: updatedMap
    });
    showToast(`Background for "${sectionId}" reset to default`, 'info');
  };

  const resetAllSectionBackgrounds = () => {
    if (!isLoggedIn) return;
    saveState({
      ...state,
      sectionBackgrounds: initialSectionBackgrounds
    });
    showToast('All section background photos reset to default', 'info');
  };

  // Backup and Restore (Admin-only)
  const exportBackup = () => {
    if (!isLoggedIn) return;
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `vishnu_vardhan_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Portfolio data exported as JSON backup');
    } catch (e) {
      showToast('Failed to export data', 'error');
    }
  };

  const importBackup = (jsonData: string): boolean => {
    if (!isLoggedIn) return false;
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.profile && parsed.projects && parsed.skills) {
        saveState({
          ...parsed,
          navbarTabs: (parsed.navbarTabs && parsed.navbarTabs.length > 0) ? parsed.navbarTabs : defaultNavbarTabs,
          sectionBackgrounds: parsed.sectionBackgrounds || initialSectionBackgrounds
        });
        showToast('Portfolio data restored successfully!', 'success');
        return true;
      }
      throw new Error('Invalid schema structure');
    } catch (e) {
      showToast('Error importing file: invalid portfolio JSON structure', 'error');
      return false;
    }
  };

  const resetToDefaults = () => {
    if (!isLoggedIn) return;
    const defaultState: PortfolioState = {
      profile: initialProfile,
      skills: initialSkills,
      projects: initialProjects,
      experience: initialExperience,
      certifications: initialCertifications,
      education: initialEducation,
      securitySettings: initialSecuritySettings,
      navbarTabs: defaultNavbarTabs,
      sectionBackgrounds: initialSectionBackgrounds,
    };
    saveState(defaultState);
    showToast('Reset portfolio to initial high-performance showcase', 'info');
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile: state.profile,
        skills: state.skills,
        projects: state.projects,
        experience: state.experience,
        certifications: state.certifications,
        education: state.education,
        securitySettings: state.securitySettings,
        navbarTabs: state.navbarTabs,
        sectionBackgrounds: state.sectionBackgrounds,

        isLoggedIn,
        userEmail,
        liveEditMode,
        toggleLiveEdit,
        verifyFirstStep,
        login,
        logout,
        updateAdminSecurity,

        isLoginModalOpen,
        setIsLoginModalOpen,
        openAdminOrLogin,

        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,

        addSkill,
        updateSkill,
        deleteSkill,

        addExperience,
        updateExperience,
        deleteExperience,

        addEducation,
        updateEducation,
        deleteEducation,

        addCertification,
        updateCertification,
        deleteCertification,

        updateNavbarTab,
        addNavbarTab,
        deleteNavbarTab,
        reorderNavbarTabs,
        resetNavbarTabs,

        updateSectionBackground,
        resetSectionBackground,
        resetAllSectionBackgrounds,

        exportBackup,
        importBackup,
        resetToDefaults,

        selectedProjectForModal,
        setSelectedProjectForModal,
        isAdminModalOpen,
        setIsAdminModalOpen: handleSetIsAdminModalOpen,
        isResumeModalOpen,
        setIsResumeModalOpen,
        activeAdminTab,
        setActiveAdminTab,

        isBackgroundModalOpen,
        setIsBackgroundModalOpen,
        activeBackgroundSection,
        setActiveBackgroundSection,
        openBackgroundModal,

        quickEditTarget,
        setQuickEditTarget,

        toasts,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
