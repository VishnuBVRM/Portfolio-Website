import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import {
  Layers,
  Server,
  Database,
  Code2,
  ExternalLink,
  Github,
  Zap,
  ArrowRight,
  Edit2,
  Plus,
  Terminal,
  Activity,
  Image as ImageIcon
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const {
    profile,
    projects,
    selectedProjectForModal,
    setSelectedProjectForModal,
    isLoggedIn,
    liveEditMode,
    setQuickEditTarget,
    setIsAdminModalOpen,
    setActiveAdminTab,
    sectionBackgrounds,
    openBackgroundModal
  } = usePortfolio();

  const [filter, setFilter] = useState<string>('all');

  const baseFilterOptions = [
    { id: 'all', label: 'All Enterprise Projects' },
    { id: 'fullstack', label: 'Full Stack (Angular + Spring)' },
    { id: 'backend', label: 'Spring Boot 4.1.1 & Java 17' },
    { id: 'database', label: 'High-Performance MySQL' },
  ];
  // Add a filter tab for any manually typed category
  const customCategories = Array.from(
    new Set(projects.map((p) => (p.category || '').trim()).filter((c) => c && !baseFilterOptions.some((o) => o.id === c)))
  );
  const filterOptions = [
    ...baseFilterOptions,
    ...customCategories.map((c) => ({ id: c, label: c })),
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.category === filter || (filter === 'backend' && p.coreStack.backend.includes('Spring')));

  const bgConfig = sectionBackgrounds['projects'] || {
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
    <section id="projects" className="py-20 relative isolate overflow-hidden">
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Production Systems Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Engineering Projects
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              High-throughput architectures, ACID financial ledgers, and low-latency reactive frontends engineered for enterprise scale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isLoggedIn && liveEditMode && (
              <>
                <button
                  type="button"
                  onClick={() => openBackgroundModal('projects')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition shadow-sm"
                  title="Choose or upload background photo for Projects section"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Change Projects Background</span>
                </button>
                <button
                  onClick={() => {
                    setActiveAdminTab('projects');
                    setIsAdminModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Project</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                filter === opt.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}

          {/* GitHub link tab */}
          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-950/20 group relative"
            >
              {/* Quick Edit in Live Mode */}
              {isLoggedIn && liveEditMode && (
                <button
                  onClick={() => setQuickEditTarget({ type: 'project', id: project.id })}
                  className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition"
                  title="Quick Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Card Top */}
              <div className="p-6 sm:p-7 space-y-4">
                
                {/* Category & Stack Tagline */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Java 17 • Spring Boot 4.1.1
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-300 transition">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                    {project.subtitle}
                  </p>
                </div>

                {/* Core Stack Matrix */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans">Frontend</span>
                    <div className="font-semibold text-sky-400 truncate">{project.coreStack.frontend}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans">Backend</span>
                    <div className="font-semibold text-emerald-400 truncate">{project.coreStack.backend}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans">Language</span>
                    <div className="font-semibold text-indigo-400 truncate">{project.coreStack.javaVersion}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans">Database</span>
                    <div className="font-semibold text-amber-400 truncate">{project.coreStack.database}</div>
                  </div>
                </div>

                {/* Key Metrics Chips */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                    Benchmarked Performance:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.metrics.slice(0, 2).map((metric, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-emerald-950/30 text-emerald-300 border border-emerald-500/30"
                      >
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span>{metric}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>

              {/* Card Bottom / Actions */}
              <div className="p-4 sm:px-7 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedProjectForModal(project)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-indigo-600/20"
                >
                  <Database className="w-4 h-4" />
                  <span>Inspect Architecture & Schema</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
                    title="View GitHub Repository"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Deep-Dive Architectural & Schema Modal */}
      {selectedProjectForModal && (
        <ProjectModal
          project={selectedProjectForModal}
          onClose={() => setSelectedProjectForModal(null)}
        />
      )}
    </section>
  );
};
