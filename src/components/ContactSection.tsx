import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  MessageCircle,
  Edit2,
  Image as ImageIcon
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const {
    profile,
    isLoggedIn,
    liveEditMode,
    setQuickEditTarget,
    sectionBackgrounds,
    openBackgroundModal
  } = usePortfolio();

  // WhatsApp needs the number in international format, digits only
  const whatsappNumber = (profile.whatsapp || profile.phone).replace(/\D/g, '');
  const phoneNumber = profile.phone.replace(/\D/g, '');

  const bgConfig = sectionBackgrounds['contact'] || {
    imageUrl: '',
    overlayOpacity: 85,
    blur: 0,
    size: 'cover',
    position: 'center'
  };
  const activeBgImage = bgConfig.imageUrl || '';
  const overlayOpacity = (bgConfig.overlayOpacity ?? 85) / 100;
  const blurVal = bgConfig.blur ?? 0;

  const contactItems = [
    {
      label: 'Gmail',
      href: `mailto:${profile.email}`,
      icon: Mail,
      external: false,
    },
    {
      label: 'Mobile',
      href: `tel:+${phoneNumber}`,
      icon: Phone,
      external: false,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/${whatsappNumber}`,
      icon: MessageCircle,
      external: true,
    },
    {
      label: 'LinkedIn',
      href: profile.linkedinUrl,
      icon: Linkedin,
      external: true,
    },
    {
      label: 'GitHub',
      href: profile.githubUrl,
      icon: Github,
      external: true,
    },
  ];

  return (
    <section id="contact" className="py-20 relative isolate overflow-hidden">
      <span id="hire-me" className="absolute -top-20" />

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
        
        {/* Floating Admin Background Photo Editor Button */}
        {isLoggedIn && liveEditMode && (
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => openBackgroundModal('contact')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-semibold shadow-sm transition"
              title="Choose or upload background photo for Contact section"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Change Contact Background Photo</span>
            </button>
          </div>
        )}

        <div className="max-w-md mx-auto">
          <div className="space-y-6">
            
            {/* Contact Details Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-3 relative shadow-2xl backdrop-blur-md">
              {isLoggedIn && liveEditMode && (
                <button
                  onClick={() => setQuickEditTarget({ type: 'contact' })}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition shadow-sm"
                  title="Edit Contact Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}

              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Contact Details</span>
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                {contactItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    title={item.label}
                    aria-label={item.label}
                    className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition shadow-lg"
                  >
                    <item.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
