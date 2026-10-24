import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  X,
  Printer,
  Copy,
  Download,
  Check,
  FileText,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Award,
  BookOpen,
  Phone,
  Globe,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const ResumeModal: React.FC = () => {
  const {
    profile,
    experience,
    education,
    certifications,
    skills,
    projects,
    isResumeModalOpen,
    setIsResumeModalOpen,
    showToast
  } = usePortfolio();

  const [copied, setCopied] = useState(false);

  if (!isResumeModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const generatePlainTextResume = () => {
    let text = `${profile.name.toUpperCase()}\n`;
    text += `Mobile: ${profile.phone} | Email: ${profile.email}\n`;
    text += `Location: ${profile.location}\n`;
    text += `Portfolio: ${profile.portfolioUrl} | GitHub: ${profile.githubUrl}\n\n`;

    text += `PROFESSIONAL SUMMARY\n`;
    text += `${profile.bio}\n\n`;

    text += `TECHNICAL & CORE SKILLS\n`;
    text += `• Backend: Java Full Stack, Spring Boot 4.1.1, Node.js, Express.js, Cisco CCNA R&D, Cisco Security\n`;
    text += `• Frontend: Angular (MEAN Stack), TypeScript, HTML5, CSS3, JavaScript ES6+\n`;
    text += `• Databases: MySQL, MongoDB\n`;
    text += `• Tools & Version Control: Git, GitHub\n`;
    text += `• Soft Skills: ${(profile.softSkills || []).join(', ')}\n`;
    text += `• Languages: ${(profile.languages || []).join(', ')}\n\n`;

    text += `EDUCATION\n`;
    education.forEach((edu) => {
      text += `• ${edu.degree} in ${edu.field}\n`;
      text += `  ${edu.institution}${edu.location ? `, ${edu.location}` : ''} | ${edu.year}${edu.score ? ` | ${edu.score}` : ''}\n`;
    });

    text += `\nINTERNSHIPS\n`;
    experience.forEach((exp) => {
      text += `\n${exp.company} — ${exp.role}\n`;
      text += `${exp.startDate} – ${exp.endDate} (${exp.location})\n`;
      exp.bulletPoints.forEach((b) => {
        text += `• ${b}\n`;
      });
      text += `Tech: ${exp.techStack.join(', ')}\n`;
    });

    text += `\nKEY PROJECTS\n`;
    projects.forEach((proj) => {
      text += `\n${proj.title}\n`;
      text += `${proj.subtitle}\n`;
      proj.keyFeatures.forEach((feat) => {
        text += `• ${feat}\n`;
      });
      text += `Tech Stack: ${proj.techStack.join(', ')}\n`;
    });

    text += `\nCERTIFICATIONS\n`;
    certifications.forEach((c) => {
      text += `• ${c.title} — ${c.issuer} (${c.issueDate})\n`;
    });

    return text;
  };

  const handleCopyText = () => {
    const text = generatePlainTextResume();
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Resume plain-text copied to clipboard for job applications!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadMarkdown = () => {
    const text = generatePlainTextResume();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VISHNU_VARDHAN_CHINTALA_RESUME.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Downloaded resume markdown file', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{profile.name} — Resume</h3>
              <p className="text-[11px] text-slate-400">{profile.location} • {profile.phone}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {profile.resumePdfUrl && (
              <a
                href={profile.resumePdfUrl}
                download="VISHNU_VARDHAN_CHINTALA_Resume.pdf"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
                title="Download the original uploaded PDF resume"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Original PDF</span>
              </a>
            )}

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              title="Copy plain-text version for job portals"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              title="Download Markdown"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/25"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>

            <button
              onClick={() => setIsResumeModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document Container */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-900 text-slate-100 print:bg-white print:text-black print:p-0 print:overflow-visible">
          <div className="max-w-3xl mx-auto space-y-6 print:space-y-4 print-page">
            
            {/* Resume Header */}
            <div className="border-b border-slate-700 pb-5 print:border-black print:pb-3 text-center sm:text-left">
              <h1 className="text-3xl font-extrabold text-white print:text-black tracking-tight uppercase">
                {profile.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 print:text-gray-800 mt-2 font-mono justify-center sm:justify-start">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-indigo-400 print:hidden" />
                  <span>Mobile: {profile.phone}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-indigo-400 print:hidden" />
                  <span>Email: {profile.email}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-400 print:hidden" />
                  <span>{profile.location}</span>
                </span>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black font-mono border-b border-slate-800 print:border-gray-300 pb-1">
                Professional Summary
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 print:text-gray-800">
                {profile.bio}
              </p>
            </div>

            {/* Technical & Core Skills */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black font-mono border-b border-slate-800 print:border-gray-300 pb-1">
                Technical & Core Skills
              </h2>
              <div className="text-xs sm:text-sm space-y-1.5 text-slate-300 print:text-gray-800">
                <div>
                  <strong className="text-white print:text-black">Backend & Full Stack:</strong> Java Full Stack Development (Core Java, Spring Boot 4.1.1, Node.js/Express, RESTful APIs, JWT Authentication).
                </div>
                <div>
                  <strong className="text-white print:text-black">Networking & Security:</strong> Cisco CCNA R&D, Cisco Security, Routing & Switching (OSPF, VLANs), TCP/IP, LAN/WAN Infrastructure, Secure VPN tunnels.
                </div>
                <div>
                  <strong className="text-white print:text-black">Frontend:</strong> Angular (MEAN Stack), TypeScript, HTML5, CSS3, JavaScript (ES6+), Responsive Web Design.
                </div>
                <div>
                  <strong className="text-white print:text-black">Databases & Storage:</strong> MySQL Relational Database, MongoDB NoSQL.
                </div>
                <div>
                  <strong className="text-white print:text-black">Tools & Version Control:</strong> Git, GitHub.
                </div>
                {profile.softSkills && profile.softSkills.length > 0 && (
                  <div>
                    <strong className="text-white print:text-black">Soft Skills:</strong> {profile.softSkills.join(', ')}.
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black font-mono border-b border-slate-800 print:border-gray-300 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs sm:text-sm text-slate-300 print:text-gray-800 space-y-0.5">
                    <div className="flex flex-wrap justify-between items-baseline gap-2">
                      <div className="font-bold text-white print:text-black">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                      {edu.score && (
                        <div className="text-xs font-mono font-bold text-indigo-400 print:text-gray-700">
                          {edu.score}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-between items-baseline text-slate-400 print:text-gray-700 text-xs">
                      <div>{edu.institution}{edu.location ? `, ${edu.location}` : ''} {edu.honors && `• ${edu.honors}`}</div>
                      <div className="font-mono">{edu.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Internships */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black font-mono border-b border-slate-800 print:border-gray-300 pb-1">
                Internships
              </h2>
              
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-bold text-sm text-white print:text-black">
                        {exp.company} — <span className="font-semibold text-indigo-400 print:text-black">{exp.role}</span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 print:text-gray-600">
                        {exp.startDate} – {exp.endDate}
                      </div>
                    </div>

                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm text-slate-300 print:text-gray-800">
                      {exp.bulletPoints.map((point, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {point}
                        </li>
                      ))}
                    </ul>

                    <div className="text-[11px] font-mono text-slate-400 print:text-gray-600 pt-0.5">
                      <strong>Tech Stack:</strong> {exp.techStack.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Academic & Software Projects */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black font-mono border-b border-slate-800 print:border-gray-300 pb-1">
                Academic & Technical Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1 text-xs sm:text-sm text-slate-300 print:text-gray-800">
                    <div className="font-bold text-white print:text-black">
                      {proj.title}
                    </div>
                    <p className="text-slate-400 print:text-gray-700 text-xs">
                      {proj.subtitle}
                    </p>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-300 print:text-gray-800">
                      {proj.keyFeatures.slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black font-mono border-b border-slate-800 print:border-gray-300 pb-1">
                Certifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300 print:text-gray-800">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-2">
                    <span className="text-indigo-400 print:text-black">•</span>
                    <div>
                      <div className="font-semibold text-white print:text-black">{cert.title}</div>
                      <div className="text-[11px] text-slate-400 print:text-gray-600">{cert.issuer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black font-mono border-b border-slate-800 print:border-gray-300 pb-1">
                  Languages
                </h2>
                <div className="text-xs text-slate-300 print:text-gray-800 pt-1">
                  {profile.languages.join(' • ')}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
