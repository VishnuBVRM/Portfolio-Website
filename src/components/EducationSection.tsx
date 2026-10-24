import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Edit2,
  Plus,
  CheckCircle2,
  Building2,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

export const EducationSection: React.FC = () => {
  const {
    education,
    isLoggedIn,
    liveEditMode,
    setQuickEditTarget,
    setIsAdminModalOpen,
    setActiveAdminTab,
    sectionBackgrounds,
    openBackgroundModal
  } = usePortfolio();

  const bgConfig = sectionBackgrounds['education'] || {
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
    <section id="education" className="py-20 bg-slate-900/30 border-t border-slate-800/80 relative isolate overflow-hidden scroll-mt-16">
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

      {/* Background glow effects */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Qualifications</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Education Background
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Formal academic journey covering Computer Science and Engineering, pre-university MPC fundamentals, and foundational schooling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isLoggedIn && liveEditMode && (
              <>
                <button
                  type="button"
                  onClick={() => openBackgroundModal('education')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30 transition shadow-sm"
                  title="Choose or upload background photo for Education section"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Change Background Photo</span>
                </button>
                <button
                  onClick={() => {
                    setActiveAdminTab('education');
                    setIsAdminModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold hover:bg-indigo-500/30 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manage Education</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Education Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {education.map((edu, index) => {
            const isLatest = index === 0;

            return (
              <div
                key={edu.id}
                className={`rounded-2xl p-6 transition-all duration-300 relative group flex flex-col justify-between ${
                  isLatest
                    ? 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/30 shadow-lg shadow-cyan-500/5 hover:border-cyan-400/50'
                    : 'bg-slate-950/70 border border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Live edit badge */}
                {isLoggedIn && liveEditMode && (
                  <button
                    onClick={() => setQuickEditTarget({ type: 'education', id: edu.id })}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition z-10"
                    title="Edit Qualification"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  {/* Top Meta: Period & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-900 border border-slate-800 text-slate-300">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{edu.year}</span>
                    </span>

                    {edu.score && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Award className="w-3 h-3" />
                        <span>{edu.score}</span>
                      </span>
                    )}
                  </div>

                  {/* Degree Name */}
                  <div className="mb-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isLatest
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                          {edu.degree}
                        </h3>
                        {edu.field && (
                          <div className="text-xs font-mono text-indigo-400 font-semibold mt-0.5">
                            {edu.field}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Institution */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-slate-200 font-medium">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{edu.institution}</span>
                    </div>

                    {edu.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{edu.location}</span>
                      </div>
                    )}

                    {edu.honors && (
                      <div className="text-xs text-slate-400 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/60 mt-3 font-mono leading-relaxed">
                        <span className="text-cyan-400 font-semibold">Affiliation: </span>
                        <span>{edu.honors}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer highlight */}
                <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Completed & Verified</span>
                  </span>
                  <span className="text-slate-500 font-semibold">
                    {index === 0 ? 'Undergraduate' : index === 1 ? 'Higher Secondary' : 'Secondary'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
