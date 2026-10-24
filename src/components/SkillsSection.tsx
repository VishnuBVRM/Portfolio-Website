import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillCategory, Skill } from '../types';
import {
  Layers,
  Database,
  Cpu,
  Server,
  Code2,
  Cloud,
  CheckCircle,
  Sparkles,
  Edit2,
  Plus,
  Shield,
  Network,
  Image as ImageIcon
} from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const {
    skills,
    isLoggedIn,
    liveEditMode,
    setQuickEditTarget,
    setIsAdminModalOpen,
    setActiveAdminTab,
    sectionBackgrounds,
    openBackgroundModal
  } = usePortfolio();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const baseCategories: { id: string; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Technologies' },
    { id: 'backend', label: 'Java & Spring Boot', icon: Server },
    { id: 'frontend', label: 'Angular & Frontend', icon: Code2 },
    { id: 'database', label: 'MySQL & Databases', icon: Database },
    { id: 'networking', label: 'Cisco CCNA & Security', icon: Network },
    { id: 'cloud_devops', label: 'Tools & Version Control', icon: Cloud },
  ];
  // Add a filter pill for any manually typed category
  const customCategories = Array.from(
    new Set(skills.map((s) => (s.category || '').trim()).filter((c) => c && !baseCategories.some((b) => b.id === c)))
  );
  const categories: { id: string; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
    ...baseCategories,
    ...customCategories.map((c) => ({ id: c, label: c.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) })),
  ];

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const bgConfig = sectionBackgrounds['skills'] || {
    imageUrl: '',
    overlayOpacity: 85,
    blur: 0,
    size: 'cover',
    position: 'center'
  };
  const activeBgImage = bgConfig.imageUrl || '';
  const overlayOpacity = (bgConfig.overlayOpacity ?? 85) / 100;
  const blurVal = bgConfig.blur ?? 0;

  return (
    <section id="skills" className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative isolate overflow-hidden scroll-mt-16">
      {/* Background Photo Layer */}
      {activeBgImage && (
        <>
          <div
            className="absolute inset-0 -z-20 bg-no-repeat transition-all duration-700"
            style={{
              backgroundImage: `url(${activeBgImage})`,
              backgroundSize: bgConfig.size || 'cover',
              backgroundPosition: bgConfig.position || 'center',
              filter: blurVal > 0 ? `blur(${blurVal}px)` : undefined,
              transform: blurVal > 0 ? 'scale(1.05)' : undefined,
            }}
          />
          <div
            className="absolute inset-0 -z-10 pointer-events-none transition-all duration-500"
            style={{
              backgroundColor: `rgba(2, 6, 23, ${overlayOpacity})`
            }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Technical & Core Skills Matrix</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Skills
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Certified across Java Full Stack Development (Capgemini), Cisco CCNA R&D and Security (Zoom Technologies), Angular MEAN stack, and MySQL.
            </p>
          </div>

          {isLoggedIn && liveEditMode && (
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => openBackgroundModal('skills')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition shadow-sm"
                title="Choose or upload background photo for Skills section"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Change Skills Background</span>
              </button>
              <button
                onClick={() => {
                  setActiveAdminTab('skills');
                  setIsAdminModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add / Manage Skills
              </button>
            </div>
          )}
        </div>

        {/* 3 Core Highlight Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Pillar 1: Java Full Stack */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 hover:border-emerald-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono flex items-center justify-between">
              <span>Java Full Stack & Spring</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Capgemini</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Certified by Edu Bridge & Capgemini. Core Java (JDK 17), Spring Boot 4.1.1, Spring Data JPA/Hibernate, secure JWT authentication, and RESTful API integration.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">Java JDK 17</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">Spring Boot</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">JWT Auth</span>
            </div>
          </div>

          {/* Pillar 2: Angular & Frontend */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 hover:border-sky-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono flex items-center justify-between">
              <span>Angular & MEAN Stack</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">IIDT & APSCHE</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built Netflix-style video streaming platforms with Angular, Node.js/Express, and MongoDB. Structured responsive, accessible portfolios with semantic HTML5 and CSS3.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">Angular</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">TypeScript</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">MEAN Stack</span>
            </div>
          </div>

          {/* Pillar 3: Cisco CCNA & Security */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono flex items-center justify-between">
              <span>Cisco CCNA & Security</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Zoom Tech</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Routing, switching, TCP/IP, and LAN/WAN infrastructure. Expertise in troubleshooting complex network environments and configuring secure VPN tunnels and firewalls.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">Routing & Switching</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">TCP/IP</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">Secure VPN</span>
            </div>
          </div>

        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
                }`}
              >
                {cat.icon && <cat.icon className="w-4 h-4" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition relative group"
            >
              {isLoggedIn && liveEditMode && (
                <button
                  onClick={() => setQuickEditTarget({ type: 'skill', id: skill.id })}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition opacity-0 group-hover:opacity-100"
                  title="Edit Skill"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-bold text-white text-base">
                  {skill.name}
                </h4>
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  {skill.years} yrs exp
                </span>
              </div>

              {/* Proficiency Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 capitalize">{skill.category.replace('_', ' ')}</span>
                  <span className="text-indigo-400 font-bold">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {skill.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-400 border border-slate-800/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
