import React, { useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { saveDocument, DOCUMENT_ACCEPT } from '../utils/documentStore';
import overviewBg from '../assets/overview-bg.jpg';
import profilePhoto from '../assets/vishnu.png';
import {
  MapPin,
  Edit2,
  ShieldCheck,
  Phone,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    profile,
    updateProfile,
    isLoggedIn,
    liveEditMode,
    setQuickEditTarget,
    sectionBackgrounds,
    openBackgroundModal,
    showToast
  } = usePortfolio();

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        updateProfile({ avatarUrl: reader.result });
        showToast('Hero photo updated successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const res = await saveDocument(file);
    if (!res.ok) {
      showToast(res.error, 'error');
      return;
    }
    updateProfile({ resumePdfUrl: res.documentUrl });
    showToast(`Resume file "${res.documentName}" uploaded!`, 'success');
  };

  const displayedPhoto =
    profile.avatarUrl && (profile.avatarUrl.startsWith('data:image') || profile.avatarUrl.startsWith('http') || profile.avatarUrl.startsWith('blob:') || profile.avatarUrl.startsWith('/'))
      ? profile.avatarUrl
      : profilePhoto;

  const photoLayout = profile.photoLayout || 'top-to-bottom';
  const photoPosition = profile.photoPosition || 'top';

  const cyclePhotoLayout = () => {
    const next = photoLayout === 'top-to-bottom' ? 'card' : 'top-to-bottom';
    updateProfile({ photoLayout: next });
    showToast(`Overview photo layout: ${next === 'top-to-bottom' ? 'Top-to-Bottom (Full Height)' : 'Portrait Card'}`, 'info');
  };

  const cyclePhotoPosition = () => {
    const positions: Array<'top' | 'center' | 'bottom'> = ['top', 'center', 'bottom'];
    const nextIdx = (positions.indexOf(photoPosition) + 1) % positions.length;
    const nextPos = positions[nextIdx];
    updateProfile({ photoPosition: nextPos });
    showToast(`Photo vertical align: ${nextPos}`, 'info');
  };

  const bgConfig = sectionBackgrounds['overview'] || {
    imageUrl: '',
    overlayOpacity: 70,
    blur: 0,
    size: 'cover',
    position: 'center'
  };
  const activeBgImage = bgConfig.imageUrl || overviewBg;
  const overlayOpacity = (bgConfig.overlayOpacity ?? 70) / 100;
  const blurVal = bgConfig.blur ?? 0;

  const objectPositionClass =
    photoPosition === 'center'
      ? 'object-center'
      : photoPosition === 'bottom'
      ? 'object-bottom'
      : 'object-top';

  return (
    <section
      id="overview"
      className="relative isolate min-h-[640px] lg:min-h-[760px] pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden flex items-center"
    >
      {/* Background Layer */}
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

      {/* Overview-only: Full Top-to-Bottom Photo stretching from the very top to bottom edge */}
      {photoLayout === 'top-to-bottom' && (
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[46%] xl:w-[42%] 2xl:w-[39%] pointer-events-none select-none z-0 overflow-hidden">
          <img
            src={displayedPhoto}
            alt={profile.name}
            className={`w-full h-full object-cover ${objectPositionClass} transition-all duration-700`}
          />
          {/* Left edge shadow gradient so text remains ultra-clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/45 to-transparent" />
          {/* Top edge subtle gradient for smooth navbar transition */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent" />
          {/* Bottom edge gradient for smooth transition to next section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          {/* Right edge subtle soft vignette */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-950/30 to-transparent" />
        </div>
      )}

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none rounded-full -z-10" />
      <div className="absolute -top-10 -right-20 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Bio, Stack Ribbon, CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            
            {/* Admin Quick Edit Controls */}
            {isLoggedIn && liveEditMode && (
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => openBackgroundModal('overview')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition shadow-sm"
                  title="Choose or upload background photo for Overview section"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose Overview Background</span>
                </button>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition shadow-sm"
                  title="Choose new photo for Vishnu (Overview)"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Choose Profile Photo</span>
                </button>
                <button
                  type="button"
                  onClick={cyclePhotoLayout}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition shadow-sm"
                  title="Toggle overview photo layout (Overview only)"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Photo: {photoLayout === 'top-to-bottom' ? 'Top-to-Bottom' : 'Card'}</span>
                </button>
                <button
                  type="button"
                  onClick={cyclePhotoPosition}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition shadow-sm"
                  title="Cycle vertical framing: Top / Center / Bottom"
                >
                  <span>Align: {photoPosition}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickEditTarget({ type: 'profile' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Overview & Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Resume PDF</span>
                </button>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept={DOCUMENT_ACCEPT}
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Name & Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Hi, I'm <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">{profile.name}</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-300 mt-3 font-mono">
                {profile.title}
              </p>
            </div>

            {/* Core Stack Pill Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition backdrop-blur-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Frontend</span>
                <span className="font-bold text-sky-400">Angular (MEAN Stack)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition backdrop-blur-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Backend Core</span>
                <span className="font-bold text-emerald-400">Java & Spring Boot 4.1.1</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition backdrop-blur-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Database</span>
                <span className="font-bold text-amber-400">MySQL & MongoDB</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition backdrop-blur-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Network & Security</span>
                <span className="font-bold text-indigo-400">Cisco CCNA & VPN</span>
              </div>
            </div>

            {/* Bio text */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* Quick Meta Info from Resume */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-300">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Certified: Capgemini Java Full Stack & CCNA</span>
              </div>
            </div>


          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            
            {/* If Top-to-Bottom mode: on mobile/tablet, render prominent framed photo; on desktop, the full-height photo sits in the background */}
            {photoLayout === 'top-to-bottom' ? (
              <>
                {/* Mobile / Tablet View: Visible only below lg breakpoint */}
                <div className="lg:hidden w-full flex justify-center pt-4">
                  <div className="relative group w-full max-w-xs sm:max-w-sm">
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-indigo-500/40 via-cyan-400/30 to-transparent blur-xl" />
                    <img
                      src={displayedPhoto}
                      alt={profile.name}
                      className={`relative w-full aspect-[4/5] object-cover ${objectPositionClass} rounded-3xl border border-slate-700/80 shadow-2xl shadow-indigo-950/50`}
                    />
                    {isLoggedIn && liveEditMode && (
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-indigo-600 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-semibold shadow-xl transition"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Choose Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Desktop View: Live Edit Floating Pill Indicator */}
                {isLoggedIn && liveEditMode && (
                  <div className="hidden lg:flex flex-col items-end gap-2 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-indigo-500/40 shadow-2xl">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Overview Photo: <strong className="text-indigo-400">Top-to-Bottom Active</strong></span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-sm"
                        title="Choose New Hero Photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={cyclePhotoPosition}
                        className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                        title="Cycle vertical framing: Top / Center / Bottom"
                      >
                        Align: {photoPosition}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Card Layout fallback */
              <div className="relative group">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-indigo-500/40 via-cyan-400/30 to-transparent blur-2xl" />
                <img
                  src={displayedPhoto}
                  alt={profile.name}
                  className={`relative w-64 sm:w-72 lg:w-80 xl:w-96 aspect-[4/5] object-cover ${objectPositionClass} rounded-3xl border border-slate-700/80 shadow-2xl shadow-indigo-950/50`}
                />
                {isLoggedIn && liveEditMode && (
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/90 hover:bg-indigo-600 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-semibold shadow-xl transition"
                    title="Choose New Profile Photo"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Choose Photo</span>
                  </button>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
