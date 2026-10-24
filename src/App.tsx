import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { LiveEditBar } from './components/LiveEditBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ResumeSection } from './components/ResumeSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { ResumeModal } from './components/ResumeModal';
import { QuickEditModal } from './components/QuickEditModal';
import { SectionBackgroundModal } from './components/SectionBackgroundModal';
import { ToastContainer } from './components/ToastContainer';

function PortfolioApp() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Banner for authenticated sessions */}
      <LiveEditBar />

      {/* Main Navigation */}
      <Navbar />

      {/* Main Content Areas */}
      <main className="flex-1">
        <Hero />
        <SkillsSection />
        <ProjectsSection />
        <ResumeSection />
        <EducationSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Notifications */}
      <AdminModal />
      <ResumeModal />
      <QuickEditModal />
      <SectionBackgroundModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
