import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { openDocument } from '../utils/openDocument';
import {
  Briefcase,
  Award,
  MapPin,
  FileText,
  Edit2,
  Plus,
  Download,
  Languages,
  Github,
  Image as ImageIcon
} from 'lucide-react';

export const ResumeSection: React.FC = () => {
  const {
    profile,
    experience,
    certifications,
    isLoggedIn,
    liveEditMode,
    setQuickEditTarget,
    setIsAdminModalOpen,
    setActiveAdminTab,
    sectionBackgrounds,
    openBackgroundModal
  } = usePortfolio();

  const bgConfig = sectionBackgrounds['experience'] || {
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
    <section id="experience" className="py-20 bg-slate-900/40 border-t border-slate-800/80 relative isolate overflow-hidden scroll-mt-16">
      <div id="resume" className="absolute -top-16" />

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
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career Track & Practical Training</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Internships & Professional Experience
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Certified Java Full Stack Developer (EduBridge / Capgemini), Cisco CCNA & Security Specialist (Zoom Technologies), and Full Stack Engineer (IIDT).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {profile.resumePdfUrl && (
              <button
                type="button"
                onClick={() => openDocument(profile.resumePdfUrl!)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-semibold transition"
                title="Download original uploaded PDF"
              >
                <Download className="w-4 h-4" />
                <span>Original PDF</span>
              </button>
            )}

            {isLoggedIn && liveEditMode && (
              <>
                <button
                  type="button"
                  onClick={() => openBackgroundModal('experience')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30 transition shadow-sm"
                  title="Choose or upload background photo for Experience section"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Change Background Photo</span>
                </button>
                <button
                  onClick={() => {
                    setActiveAdminTab('experience');
                    setIsAdminModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Internships & Work Experience (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Internships & Professional Roles</span>
            </h3>

            <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-8">
              {experience.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Node Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-indigo-400 group-hover:scale-125 transition" />

                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition relative">
                    {isLoggedIn && liveEditMode && (
                      <button
                        onClick={() => setQuickEditTarget({ type: 'experience', id: exp.id })}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition"
                        title="Edit Experience"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Role & Company Header */}
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2 pr-8">
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          {exp.company}
                        </h4>
                        <div className="text-sm font-semibold text-indigo-400 font-mono">
                          {exp.role}
                        </div>
                      </div>

                      <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        {exp.startDate} – {exp.endDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exp.location}</span>
                      </div>
                      <span className="text-slate-600">•</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 text-[11px]">
                        {exp.type}
                      </span>
                      {exp.keyMetric && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-emerald-400 font-semibold font-mono">
                            ★ {exp.keyMetric}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Bullet Points */}
                    <ul className="space-y-2 mb-4">
                      {exp.bulletPoints.map((point, pIdx) => (
                        <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                          <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {exp.githubUrl && (
                      <a
                        href={exp.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mb-3 mr-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      >
                        <Github className="w-3 h-3" />
                        <span>GitHub</span>
                      </a>
                    )}

                    {exp.documentUrl && (
                      <button
                        type="button"
                        onClick={() => openDocument(exp.documentUrl!)}
                        className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Document</span>
                      </button>
                    )}

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                      {exp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Certifications, Languages & Soft Skills (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Certifications */}
            <div id="certifications" className="space-y-4 scroll-mt-20">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Professional Certifications</span>
                </h3>
                {isLoggedIn && liveEditMode && (
                  <button
                    onClick={() => {
                      setActiveAdminTab('certifications');
                      setIsAdminModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Manage</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-amber-500/30 transition group relative"
                  >
                    {isLoggedIn && liveEditMode && (
                      <button
                        onClick={() => setQuickEditTarget({ type: 'certification', id: cert.id })}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition"
                        title="Edit Certification"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="flex items-start justify-between gap-2 pr-8">
                      <div className="font-semibold text-xs sm:text-sm text-white group-hover:text-amber-300 transition">
                        {cert.title}
                      </div>
                      <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
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
                        className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Document</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages & Soft Skills */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 relative">
              {isLoggedIn && liveEditMode && (
                <button
                  onClick={() => setQuickEditTarget({ type: 'profile' })}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition"
                  title="Edit Languages & Soft Skills"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}

              {profile.languages && profile.languages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Languages className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Languages</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang: string) => (
                      <span
                        key={lang}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 text-slate-300 border border-slate-800 font-mono"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.softSkills && profile.softSkills.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-2">
                    Soft Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.softSkills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
