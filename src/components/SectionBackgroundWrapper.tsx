import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Image as ImageIcon, Camera } from 'lucide-react';

interface SectionBackgroundWrapperProps {
  sectionId: string;
  sectionTitle?: string;
  defaultImage?: string;
  className?: string;
  children: React.ReactNode;
}

export const SectionBackgroundWrapper: React.FC<SectionBackgroundWrapperProps> = ({
  sectionId,
  sectionTitle,
  defaultImage,
  className = '',
  children,
}) => {
  const {
    sectionBackgrounds,
    isLoggedIn,
    liveEditMode,
    openBackgroundModal
  } = usePortfolio();

  const bgConfig = sectionBackgrounds[sectionId] || {
    imageUrl: '',
    overlayOpacity: 80,
    blur: 0,
    size: 'cover',
    position: 'center'
  };

  const activeImage = bgConfig.imageUrl || defaultImage || '';
  const opacity = (bgConfig.overlayOpacity ?? 80) / 100;
  const blurVal = bgConfig.blur ?? 0;

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {/* Background Photo Layer */}
      {activeImage && (
        <>
          <div
            className="absolute inset-0 -z-20 bg-no-repeat transition-all duration-700"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundSize: bgConfig.size || 'cover',
              backgroundPosition: bgConfig.position || 'center',
              filter: blurVal > 0 ? `blur(${blurVal}px)` : undefined,
              transform: blurVal > 0 ? 'scale(1.05)' : undefined,
            }}
          />
          <div
            className="absolute inset-0 -z-10 pointer-events-none transition-all duration-500"
            style={{
              backgroundColor: `rgba(2, 6, 23, ${opacity})`,
            }}
          />
        </>
      )}

      {/* Floating Admin Background Photo Editor Button */}
      {isLoggedIn && liveEditMode && (
        <div className="absolute top-4 right-4 z-20 no-print">
          <button
            type="button"
            onClick={() => openBackgroundModal(sectionId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-indigo-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold shadow-xl transition backdrop-blur-md"
            title={`Choose or upload background photo for ${sectionTitle || sectionId} section`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Change {sectionTitle || 'Section'} Background</span>
          </button>
        </div>
      )}

      {children}
    </div>
  );
};
