import React, { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { presetBackgrounds, BackgroundPreset } from '../data/initialData';
import {
  X,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Sliders,
  Trash2,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Menu,
  Plus,
  ArrowUp,
  ArrowDown,
  Save,
  Layers,
  Palette
} from 'lucide-react';

export const SectionBackgroundModal: React.FC = () => {
  const {
    isLoggedIn,
    isBackgroundModalOpen,
    setIsBackgroundModalOpen,
    activeBackgroundSection,
    setActiveBackgroundSection,
    navbarTabs,
    updateNavbarTab,
    addNavbarTab,
    deleteNavbarTab,
    reorderNavbarTabs,
    resetNavbarTabs,
    sectionBackgrounds,
    updateSectionBackground,
    resetSectionBackground,
    resetAllSectionBackgrounds,
    showToast
  } = usePortfolio();

  const [activeTabMode, setActiveTabMode] = useState<'backgrounds' | 'navbar'>('backgrounds');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [newTabName, setNewTabName] = useState('');
  const [newTabHref, setNewTabHref] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isBackgroundModalOpen || !isLoggedIn) return null;

  const currentBg = sectionBackgrounds[activeBackgroundSection] || {
    imageUrl: '',
    overlayOpacity: 80,
    blur: 0,
    size: 'cover',
    position: 'center'
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('File size is larger than 8 MB. Please select a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateSectionBackground(activeBackgroundSection, {
          imageUrl: reader.result,
          overlayOpacity: currentBg.overlayOpacity ?? 80
        });
        showToast(`Uploaded custom photo for ${activeBackgroundSection} section!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset: BackgroundPreset) => {
    updateSectionBackground(activeBackgroundSection, {
      imageUrl: preset.url,
      overlayOpacity: currentBg.overlayOpacity ?? 80
    });
    showToast(`Applied "${preset.name}" background to ${activeBackgroundSection}`, 'success');
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    updateSectionBackground(activeBackgroundSection, {
      imageUrl: customUrlInput.trim(),
      overlayOpacity: currentBg.overlayOpacity ?? 80
    });
    setCustomUrlInput('');
    showToast(`Custom URL photo applied to ${activeBackgroundSection}`, 'success');
  };

  const handleApplyToAll = () => {
    if (!currentBg.imageUrl) {
      showToast('No background photo selected for this section yet.', 'info');
      return;
    }
    navbarTabs.forEach((tab) => {
      updateSectionBackground(tab.id, {
        imageUrl: currentBg.imageUrl,
        overlayOpacity: currentBg.overlayOpacity ?? 80,
        blur: currentBg.blur ?? 0
      });
    });
    showToast('Applied this background photo to ALL menu bar sections!', 'success');
  };

  const handleAddNewTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTabName.trim()) return;
    const href = newTabHref.trim().startsWith('#')
      ? newTabHref.trim()
      : `#${(newTabHref.trim() || newTabName.trim()).toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    addNavbarTab({
      name: newTabName.trim(),
      href,
      visible: true
    });
    setNewTabName('');
    setNewTabHref('');
  };

  const handleMoveTab = (index: number, direction: 'up' | 'down') => {
    const sorted = [...navbarTabs].sort((a, b) => (a.order || 0) - (b.order || 0));
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIdx];
    sorted[targetIdx] = temp;

    reorderNavbarTabs(sorted.map((t) => t.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Admin Customizer
                </span>
                <span className="text-xs text-slate-400">• Persistent Storage</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Menu Bar & Section Background Photos
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsBackgroundModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Mode Tabs (Backgrounds vs Menu Bar Tabs) */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2">
          <button
            onClick={() => setActiveTabMode('backgrounds')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px ${
              activeTabMode === 'backgrounds'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Section Background Photos</span>
          </button>
          <button
            onClick={() => setActiveTabMode('navbar')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px ${
              activeTabMode === 'navbar'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>Menu Bar (Navbar) Tabs</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTabMode === 'backgrounds' && (
            <div className="space-y-6">
              
              {/* Section Selector Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>1. Choose Menu Bar Section to Customize:</span>
                  <span className="text-[11px] font-mono text-cyan-400">
                    Active: #{activeBackgroundSection}
                  </span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {navbarTabs.map((tab) => {
                    const isSelected = activeBackgroundSection === tab.id;
                    const hasCustomBg = !!sectionBackgrounds[tab.id]?.imageUrl;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveBackgroundSection(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{tab.name}</span>
                        {hasCustomBg && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" title="Custom Photo Active" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Background Preview & Actions */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <span className="capitalize">{activeBackgroundSection} Background Photo Preview</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {currentBg.imageUrl ? 'Custom photo attached' : 'Default section theme/gradient active'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/25"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose / Upload Photo</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {currentBg.imageUrl && (
                      <button
                        type="button"
                        onClick={() => resetSectionBackground(activeBackgroundSection)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                        title="Remove custom photo and reset to clean theme"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center text-center p-6 isolate shadow-inner">
                  {currentBg.imageUrl ? (
                    <>
                      <div
                        className="absolute inset-0 -z-20 bg-cover bg-center transition-all duration-300"
                        style={{
                          backgroundImage: `url(${currentBg.imageUrl})`,
                          filter: currentBg.blur ? `blur(${currentBg.blur}px)` : undefined,
                          backgroundSize: currentBg.size || 'cover',
                          backgroundPosition: currentBg.position || 'center'
                        }}
                      />
                      <div
                        className="absolute inset-0 -z-10 transition-all duration-300"
                        style={{
                          backgroundColor: `rgba(2, 6, 23, ${(currentBg.overlayOpacity ?? 80) / 100})`
                        }}
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40" />
                  )}

                  <div className="relative z-10 space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                      #{activeBackgroundSection} Section
                    </span>
                    <h5 className="text-xl font-extrabold text-white">Live Readability Preview</h5>
                    <p className="text-xs text-slate-300 max-w-md">
                      Text, badges, code snippets, and cards remain crystal-clear and readable with the adjustable dark contrast overlay.
                    </p>
                  </div>
                </div>

                {/* Sliders: Overlay Darkness & Blur */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Dark Contrast Overlay</span>
                      <span className="font-mono text-cyan-400">{currentBg.overlayOpacity ?? 80}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      step="5"
                      value={currentBg.overlayOpacity ?? 80}
                      onChange={(e) =>
                        updateSectionBackground(activeBackgroundSection, {
                          overlayOpacity: Number(e.target.value)
                        })
                      }
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">Higher opacity keeps text more readable.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Background Blur</span>
                      <span className="font-mono text-cyan-400">{currentBg.blur ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="1"
                      value={currentBg.blur ?? 0}
                      onChange={(e) =>
                        updateSectionBackground(activeBackgroundSection, {
                          blur: Number(e.target.value)
                        })
                      }
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">Softens background details for sleek focus.</span>
                  </div>
                </div>

                {/* Paste URL Option */}
                <form onSubmit={handleApplyCustomUrl} className="flex gap-2 pt-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="Or paste any custom web image URL (e.g. https://...)"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                  >
                    Apply URL
                  </button>
                </form>
              </div>

              {/* 1-Click Curated Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Or Pick Curated Tech Background Presets</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleApplyToAll}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Apply current photo to all sections
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {presetBackgrounds.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="group text-left p-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition flex flex-col gap-1.5 relative overflow-hidden"
                    >
                      <div className="h-16 w-full rounded-lg overflow-hidden relative">
                        <img
                          src={preset.preview}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-transparent transition" />
                      </div>
                      <div className="px-1 pb-1">
                        <span className="text-[11px] font-semibold text-slate-200 block truncate group-hover:text-white">
                          {preset.name}
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-mono">
                          {preset.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Batch Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={resetAllSectionBackgrounds}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Section Backgrounds</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBackgroundModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-md"
                >
                  Done
                </button>
              </div>

            </div>
          )}

          {activeTabMode === 'navbar' && (
            <div className="space-y-6">
              
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Menu className="w-4 h-4 text-indigo-400" />
                  <span>Customize Menu Bar Tabs</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rename menu tabs, change order, hide/show tabs, or add custom navigation links.
                </p>
              </div>

              {/* Existing Tabs List */}
              <div className="space-y-2.5">
                {[...navbarTabs]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((tab, idx, arr) => (
                    <div
                      key={tab.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveTab(idx, 'up')}
                            className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === arr.length - 1}
                            onClick={() => handleMoveTab(idx, 'down')}
                            className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={tab.name}
                            onChange={(e) => updateNavbarTab(tab.id, { name: e.target.value })}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-semibold text-xs focus:border-indigo-500 focus:outline-none"
                          />
                          <span className="text-[11px] font-mono text-slate-500 block mt-0.5 ml-1">
                            Link: {tab.href}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveBackgroundSection(tab.id);
                            setActiveTabMode('backgrounds');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Photo Background</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateNavbarTab(tab.id, { visible: tab.visible === false ? true : false })}
                          className={`p-1.5 rounded-lg border text-xs transition ${
                            tab.visible !== false
                              ? 'bg-slate-900 text-emerald-400 border-slate-800'
                              : 'bg-slate-900/50 text-slate-500 border-slate-800 line-through'
                          }`}
                          title={tab.visible !== false ? 'Tab Visible (Click to Hide)' : 'Tab Hidden (Click to Show)'}
                        >
                          {tab.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Can delete custom added tabs */}
                        {!['overview', 'skills', 'projects', 'experience', 'contact'].includes(tab.id) && (
                          <button
                            type="button"
                            onClick={() => deleteNavbarTab(tab.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20"
                            title="Delete Menu Tab"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Add New Menu Bar Tab */}
              <form onSubmit={handleAddNewTab} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h5 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Add New Menu Bar Tab</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tab Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Testimonials, Publications, Blogs"
                      value={newTabName}
                      onChange={(e) => setNewTabName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Anchor Link / URL</label>
                    <input
                      type="text"
                      placeholder="e.g. #publications or https://..."
                      value={newTabHref}
                      onChange={(e) => setNewTabHref(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tab to Menu Bar</span>
                  </button>
                </div>
              </form>

              {/* Reset to Defaults */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetNavbarTabs}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Menu Bar to Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBackgroundModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md"
                >
                  Close
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
