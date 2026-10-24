import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { openDocument } from '../utils/openDocument';
import {
  Mail,
  Linkedin,
  Github,
  MapPin,
  Shield,
  Lock,
  Phone,
  ArrowUp,
  Download
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { profile, openAdminOrLogin, isLoggedIn } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Stack Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-mono font-bold text-white shadow-md">
                VC
              </div>
              <span className="font-bold text-base text-white">
                {profile.name}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Full Stack Developer & Network Engineer with proven skills across Angular, Java Spring Boot, MySQL, and Cisco routing & security. Certified in Java Full Stack (Edu Bridge / Capgemini) and CCNA (Zoom Technologies).
            </p>
            <div className="pt-1 flex items-center gap-2 font-mono text-[11px] text-indigo-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{profile.location}</span>
            </div>
          </div>

          {/* Quick Jump Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-slate-200 font-bold font-mono text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#overview" className="hover:text-white transition">Overview & Intro</a>
              </li>
              <li>
                <a href="#skills" className="hover:text-white transition">Technical Skills & Cisco Stack</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white transition">Academic & Software Projects</a>
              </li>
              <li>
                <a href="#resume" className="hover:text-white transition">Internships & Education</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">Contact</a>
              </li>
            </ul>
          </div>

          {/* Recruiter Tools & Actions */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-slate-200 font-bold font-mono text-xs uppercase tracking-wider">
              Resume & Portal
            </h4>
            <div className="flex flex-col gap-2">
              {profile.resumePdfUrl && (
                <button
                  type="button"
                  onClick={() => openDocument(profile.resumePdfUrl!)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition w-fit"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original Resume PDF</span>
                </button>
              )}

              <div className="pt-2 flex items-center gap-3 text-slate-400">
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:text-white transition"
                  title="Direct Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-white transition"
                  title="Direct Phone"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <button
                  onClick={() => openAdminOrLogin('overview')}
                  className="p-1 rounded-lg hover:text-white hover:bg-slate-900 transition"
                  title={isLoggedIn ? 'Admin Dashboard' : 'Admin Login'}
                  aria-label="Admin Access"
                >
                  {isLoggedIn ? (
                    <Shield className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-400">
              Mobile: <a href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="text-cyan-400 hover:underline">{profile.phone}</a>
            </span>
            <span className="font-mono text-slate-400">
              Email: <a href={`mailto:${profile.email}`} className="text-indigo-400 hover:underline">{profile.email}</a>
            </span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
