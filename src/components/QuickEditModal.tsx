import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { saveDocument, DOCUMENT_ACCEPT } from '../utils/documentStore';
import { X, Save, Edit2, FileText } from 'lucide-react';

export const QuickEditModal: React.FC = () => {
  const {
    isLoggedIn,
    quickEditTarget,
    setQuickEditTarget,
    projects,
    updateProject,
    skills,
    updateSkill,
    experience,
    updateExperience,
    education,
    updateEducation,
    certifications,
    updateCertification,
    profile,
    updateProfile,
    openBackgroundModal,
    showToast
  } = usePortfolio();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!quickEditTarget || !isLoggedIn) return;

    if (quickEditTarget.type === 'sectionBackground' || quickEditTarget.type === 'navbarTabs') {
      openBackgroundModal(quickEditTarget.id || 'overview');
      setQuickEditTarget(null);
      return;
    }

    if (quickEditTarget.type === 'profile') {
      setFormData({
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        location: profile.location,
        salaryExpectation: profile.salaryExpectation,
        languages: (profile.languages || []).join(', '),
        softSkills: (profile.softSkills || []).join(', '),
        avatarUrl: profile.avatarUrl || '',
        resumePdfUrl: profile.resumePdfUrl || '',
        photoLayout: profile.photoLayout || 'top-to-bottom',
        photoPosition: profile.photoPosition || 'top',
      });
    } else if (quickEditTarget.type === 'contact') {
      setFormData({
        email: profile.email || '',
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || profile.phone || '',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
      });
    } else if (quickEditTarget.type === 'project' && quickEditTarget.id) {
      const p = projects.find((proj) => proj.id === quickEditTarget.id);
      if (p) {
        setFormData({
          title: p.title,
          category: p.category,
          subtitle: p.subtitle,
          repoUrl: p.repoUrl || '',
          frontend: p.coreStack.frontend,
          backend: p.coreStack.backend,
          javaVersion: p.coreStack.javaVersion,
          database: p.coreStack.database,
          metric1: p.metrics[0] || '',
          metric2: p.metrics[1] || '',
          problemSolved: p.problemSolved,
          techStack: p.techStack.join(', '),
        });
      }
    } else if (quickEditTarget.type === 'skill' && quickEditTarget.id) {
      const s = skills.find((sk) => sk.id === quickEditTarget.id);
      if (s) {
        setFormData({
          name: s.name,
          category: s.category,
          proficiency: s.proficiency,
          years: s.years,
          description: s.description,
          tags: (s.tags || []).join(', '),
        });
      }
    } else if (quickEditTarget.type === 'experience' && quickEditTarget.id) {
      const e = experience.find((exp) => exp.id === quickEditTarget.id);
      if (e) {
        setFormData({
          role: e.role,
          company: e.company,
          location: e.location,
          type: e.type,
          startDate: e.startDate,
          endDate: e.endDate,
          keyMetric: e.keyMetric || '',
          description: e.description,
          bulletPoints: (e.bulletPoints || []).join('\n'),
          techStack: (e.techStack || []).join(', '),
          githubUrl: e.githubUrl || '',
          documentUrl: e.documentUrl || '',
          documentName: e.documentName || '',
        });
      }
    } else if (quickEditTarget.type === 'education' && quickEditTarget.id) {
      const ed = education.find((item) => item.id === quickEditTarget.id);
      if (ed) {
        setFormData({
          degree: ed.degree,
          field: ed.field || '',
          institution: ed.institution,
          location: ed.location || '',
          year: ed.year,
          score: ed.score || '',
          honors: ed.honors || ''
        });
      }
    } else if (quickEditTarget.type === 'certification' && quickEditTarget.id) {
      const cert = certifications.find((c) => c.id === quickEditTarget.id);
      if (cert) {
        setFormData({
          title: cert.title,
          issuer: cert.issuer,
          issueDate: cert.issueDate,
          badgeCode: cert.badgeCode,
          credentialId: cert.credentialId || '',
          verificationUrl: cert.verificationUrl || '',
          documentUrl: cert.documentUrl || '',
          documentName: cert.documentName || '',
        });
      }
    }
  }, [quickEditTarget, isLoggedIn, projects, skills, experience, education, certifications, profile]);

  // Strictly Admin-Only Guard
  if (!isLoggedIn || !quickEditTarget) return null;

  const handleDocumentChoice = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const res = await saveDocument(file);
    if (!res.ok) {
      showToast(res.error, 'error');
      return;
    }
    setFormData((prev: any) => ({
      ...prev,
      documentUrl: res.documentUrl,
      documentName: res.documentName,
    }));
    showToast(`Uploaded document "${res.documentName}"`, 'success');
  };

  const handlePhotoChoice = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData((prev: any) => ({ ...prev, avatarUrl: reader.result }));
        showToast('Photo selected. Click "Save Changes" to apply.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResumeChoice = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const res = await saveDocument(file);
    if (!res.ok) {
      showToast(res.error, 'error');
      return;
    }
    setFormData((prev: any) => ({ ...prev, resumePdfUrl: res.documentUrl }));
    showToast(`Resume "${res.documentName}" selected. Click "Save Changes" to apply.`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quickEditTarget.type === 'profile') {
      updateProfile({
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        location: formData.location,
        salaryExpectation: formData.salaryExpectation,
        languages: String(formData.languages || '').split(',').map((s) => s.trim()).filter(Boolean),
        softSkills: String(formData.softSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
        avatarUrl: formData.avatarUrl,
        resumePdfUrl: formData.resumePdfUrl,
        photoLayout: formData.photoLayout || 'top-to-bottom',
        photoPosition: formData.photoPosition || 'top',
      });
    } else if (quickEditTarget.type === 'contact') {
      updateProfile({
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
      });
    } else if (quickEditTarget.type === 'project' && quickEditTarget.id) {
      const orig = projects.find((p) => p.id === quickEditTarget.id);
      if (orig) {
        updateProject(quickEditTarget.id, {
          title: formData.title,
          category: formData.category,
          subtitle: formData.subtitle,
          repoUrl: formData.repoUrl,
          problemSolved: formData.problemSolved,
          coreStack: {
            ...orig.coreStack,
            frontend: formData.frontend,
            backend: formData.backend,
            javaVersion: formData.javaVersion,
            database: formData.database,
          },
          techStack: String(formData.techStack || '').split(',').map((t) => t.trim()).filter(Boolean),
          metrics: [formData.metric1, formData.metric2, ...orig.metrics.slice(2)].filter(Boolean),
        });
      }
    } else if (quickEditTarget.type === 'skill' && quickEditTarget.id) {
      updateSkill(quickEditTarget.id, {
        name: formData.name,
        category: formData.category,
        proficiency: Number(formData.proficiency),
        years: Number(formData.years),
        description: formData.description,
        tags: String(formData.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      });
    } else if (quickEditTarget.type === 'experience' && quickEditTarget.id) {
      updateExperience(quickEditTarget.id, {
        role: formData.role,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        keyMetric: formData.keyMetric,
        description: formData.description,
        bulletPoints: String(formData.bulletPoints || '').split('\n').map((b) => b.trim()).filter(Boolean),
        techStack: String(formData.techStack || '').split(',').map((t) => t.trim()).filter(Boolean),
        githubUrl: formData.githubUrl,
        documentUrl: formData.documentUrl || undefined,
        documentName: formData.documentName || undefined,
      });
    } else if (quickEditTarget.type === 'education' && quickEditTarget.id) {
      updateEducation(quickEditTarget.id, {
        degree: formData.degree,
        field: formData.field,
        institution: formData.institution,
        location: formData.location,
        year: formData.year,
        score: formData.score,
        honors: formData.honors
      });
    } else if (quickEditTarget.type === 'certification' && quickEditTarget.id) {
      updateCertification(quickEditTarget.id, {
        title: formData.title,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        badgeCode: formData.badgeCode,
        credentialId: formData.credentialId || undefined,
        verificationUrl: formData.verificationUrl || undefined,
        documentUrl: formData.documentUrl || undefined,
        documentName: formData.documentName || undefined,
      });
    }

    setQuickEditTarget(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setQuickEditTarget(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <Edit2 className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-base capitalize">
            Admin Edit ({quickEditTarget.type})
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {quickEditTarget.type === 'profile' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Executive Summary</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Languages (comma separated)</label>
                  <input
                    type="text"
                    value={formData.languages || ''}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Soft Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.softSkills || ''}
                  onChange={(e) => setFormData({ ...formData, softSkills: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Choose Profile Photo</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhotoChoice}
                    className="text-xs text-slate-300 file:mr-2 file:px-2.5 file:py-1 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Choose Resume PDF</label>
                  <input
                    type="file"
                    accept={DOCUMENT_ACCEPT}
                    onChange={handleResumeChoice}
                    className="text-xs text-slate-300 file:mr-2 file:px-2.5 file:py-1 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Overview Photo Layout (Overview Only)</label>
                  <select
                    value={formData.photoLayout || 'top-to-bottom'}
                    onChange={(e) => setFormData({ ...formData, photoLayout: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                  >
                    <option value="top-to-bottom">Top to Bottom (Full Height) - Default</option>
                    <option value="card">Framed Portrait Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vertical Framing Align</label>
                  <select
                    value={formData.photoPosition || 'top'}
                    onChange={(e) => setFormData({ ...formData, photoPosition: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                  >
                    <option value="top">Top (Recommended for portrait)</option>
                    <option value="center">Center</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {quickEditTarget.type === 'contact' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gmail / Email</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl || ''}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </>
          )}

          {quickEditTarget.type === 'project' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Choose / Type Category</label>
                  <input
                    type="text"
                    list="quick-project-categories"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                  <datalist id="quick-project-categories">
                    <option value="fullstack" />
                    <option value="backend" />
                    <option value="frontend" />
                    <option value="database" />
                  </datalist>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Frontend</label>
                  <input
                    type="text"
                    value={formData.frontend || ''}
                    onChange={(e) => setFormData({ ...formData, frontend: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Backend</label>
                  <input
                    type="text"
                    value={formData.backend || ''}
                    onChange={(e) => setFormData({ ...formData, backend: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Language / Platform</label>
                  <input
                    type="text"
                    value={formData.javaVersion || ''}
                    onChange={(e) => setFormData({ ...formData, javaVersion: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Database</label>
                  <input
                    type="text"
                    value={formData.database || ''}
                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Metric 1</label>
                  <input
                    type="text"
                    value={formData.metric1 || ''}
                    onChange={(e) => setFormData({ ...formData, metric1: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Metric 2</label>
                  <input
                    type="text"
                    value={formData.metric2 || ''}
                    onChange={(e) => setFormData({ ...formData, metric2: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formData.techStack || ''}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  value={formData.repoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </>
          )}

          {quickEditTarget.type === 'skill' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Choose / Type Category</label>
                  <input
                    type="text"
                    list="quick-skill-categories"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                  <datalist id="quick-skill-categories">
                    <option value="backend" />
                    <option value="frontend" />
                    <option value="database" />
                    <option value="networking" />
                    <option value="cloud_devops" />
                  </datalist>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Proficiency: {formData.proficiency}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.proficiency || 90}
                    onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Years Experience</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.years ?? 1}
                    onChange={(e) => setFormData({ ...formData, years: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags || ''}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </>
          )}

          {quickEditTarget.type === 'experience' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">End Date</label>
                  <input
                    type="text"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Key Metric</label>
                <input
                  type="text"
                  value={formData.keyMetric || ''}
                  onChange={(e) => setFormData({ ...formData, keyMetric: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bullet Points (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.bulletPoints || ''}
                  onChange={(e) => setFormData({ ...formData, bulletPoints: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Choose Document (PNG, JPEG, PDF, ZIP, RAR)</label>
                <input
                  type="file"
                  accept={DOCUMENT_ACCEPT}
                  onChange={handleDocumentChoice}
                  className="text-xs text-slate-300 file:mr-2 file:px-2.5 file:py-1 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-xs"
                />
                {formData.documentName && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
                    <FileText className="w-3 h-3" />
                    <span>{formData.documentName}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {quickEditTarget.type === 'education' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Degree / Qualification</label>
                  <input
                    type="text"
                    required
                    value={formData.degree || ''}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Major / Field</label>
                  <input
                    type="text"
                    value={formData.field || ''}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Institution / School / College</label>
                <input
                  type="text"
                  required
                  value={formData.institution || ''}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Years / Duration</label>
                  <input
                    type="text"
                    value={formData.year || ''}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Score / CGPA</label>
                  <input
                    type="text"
                    value={formData.score || ''}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Board / University / Honors</label>
                <input
                  type="text"
                  value={formData.honors || ''}
                  onChange={(e) => setFormData({ ...formData, honors: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </>
          )}

          {quickEditTarget.type === 'certification' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Certification Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issuer</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer || ''}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={formData.issueDate || ''}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Label</label>
                  <input
                    type="text"
                    value={formData.badgeCode || ''}
                    onChange={(e) => setFormData({ ...formData, badgeCode: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Choose Certificate Document</label>
                <input
                  type="file"
                  accept={DOCUMENT_ACCEPT}
                  onChange={handleDocumentChoice}
                  className="text-xs text-slate-300 file:mr-2 file:px-2.5 file:py-1 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:text-xs"
                />
                {formData.documentName && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
                    <FileText className="w-3 h-3" />
                    <span>{formData.documentName}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setQuickEditTarget(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
