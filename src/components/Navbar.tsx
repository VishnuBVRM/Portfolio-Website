import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Lock,
  Shield,
  Menu,
  X,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  Palette,
  Image as ImageIcon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    isLoggedIn,
    liveEditMode,
    setIsAdminModalOpen,
    setActiveAdminTab,
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    navbarTabs,
    openBackgroundModal
  } = usePortfolio();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  const visibleTabs = [...navbarTabs]
    .filter((t) => t.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleAdminClick = () => {
    if (isLoggedIn) {
      setActiveAdminTab('overview');
      setIsAdminModalOpen(true);
    } else {
      setLoginPassword('');
      setLoginEmail('');
      setIsLoginModalOpen(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(loginPassword, loginEmail)) {
      setIsLoginModalOpen(false);
      setLoginPassword('');
      setLoginEmail('');
      setActiveAdminTab('overview');
      setIsAdminModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <a href="#overview" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
                VV
              </div>
              <span className="font-semibold text-slate-200 group-hover:text-white transition tracking-tight">
                Portfolio
              </span>
            </a>

            {/* Status Pulse */}
            <div className="hidden 2xl:flex items-center gap-2 pl-3 ml-1 border-l border-slate-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400 font-medium">Actively Interviewing</span>
            </div>
          </div>

          {/* Desktop Nav Links (Configurable via Menu Bar Editor) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/50 rounded-xl border border-slate-800/80">
            {visibleTabs.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Quick Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Live Edit: Menu Bar & Background Photos Quick Tool */}
            {isLoggedIn && liveEditMode && (
              <button
                type="button"
                onClick={() => openBackgroundModal('overview')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 text-xs font-semibold transition shadow-sm"
                title="Choose Background Photos and Edit Menu Bar Tabs"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Edit Menu & Backgrounds</span>
              </button>
            )}

            <button
              onClick={handleAdminClick}
              className={`p-2 rounded-xl transition ${
                isLoggedIn
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
              title={isLoggedIn ? 'Admin Dashboard' : 'Admin Login'}
              aria-label="Admin Access"
            >
              {isLoggedIn ? (
                <Shield className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isLoggedIn && liveEditMode && (
              <button
                type="button"
                onClick={() => openBackgroundModal('overview')}
                className="p-1.5 text-amber-300 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-semibold flex items-center gap-1"
                title="Edit Backgrounds"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-2 backdrop-blur-xl">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Actively Interviewing</span>
              </div>
            </div>

            {visibleTabs.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800 transition"
              >
                <span>{link.name}</span>
              </a>
            ))}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-3">
              {isLoggedIn && liveEditMode && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBackgroundModal('overview');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/35 text-xs font-semibold"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Edit Menu & Backgrounds</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminClick();
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition ml-auto"
                title={isLoggedIn ? 'Admin Dashboard' : 'Admin Login'}
                aria-label="Admin Access"
              >
                {isLoggedIn ? (
                  <Shield className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Admin Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 no-print animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setLoginPassword('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 mb-0.5">
                    <span>Admin-Only Access</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Owner Authentication</h3>
                  <p className="text-xs text-slate-400">Enter your admin email and passkey to unlock editing & dashboard</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Admin Email</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter admin email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="off"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none font-mono"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Admin Passkey
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter admin passkey"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none font-mono"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                      title={showPassword ? "Hide passkey" : "Show passkey"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Verify Passkey & Unlock Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
