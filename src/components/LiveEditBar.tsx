import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ShieldCheck, Edit3, Settings, LogOut, Eye, Database, Code } from 'lucide-react';

export const LiveEditBar: React.FC = () => {
  const {
    isLoggedIn,
    liveEditMode,
    toggleLiveEdit,
    setIsAdminModalOpen,
    setActiveAdminTab,
    logout
  } = usePortfolio();

  if (!isLoggedIn) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 text-xs px-4 py-2 sticky top-0 z-40 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-indigo-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Authenticated as Engineer & Admin</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden md:inline">
            Real-time persistence enabled (Spring Boot, Angular & MySQL Showcase)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLiveEdit}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition ${
              liveEditMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {liveEditMode ? 'Live Edit Pencils ON' : 'Turn On Edit Pencils'}
          </button>

          <button
            onClick={() => {
              setActiveAdminTab('overview');
              setIsAdminModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={logout}
            className="p-1 text-slate-400 hover:text-rose-400 transition ml-1"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
