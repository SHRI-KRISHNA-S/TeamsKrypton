import React from 'react';
import { GalleryMediaItem, useApp } from '../../common';
import { X, ChevronLeft, ChevronRight, Trash2, RefreshCw, User, Calendar, Image, Video } from 'lucide-react';

interface MediaLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: GalleryMediaItem | null;
  playlist?: GalleryMediaItem[];
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  isOpen,
  onClose,
  media,
  playlist = [],
  onNavigate,
}) => {
  const { deleteGalleryMedia, restoreGalleryMedia, currentRole } = useApp();

  if (!isOpen || !media) return null;

  const canManage = currentRole === 'admin' || currentRole === 'superadmin' || currentRole === 'president' || currentRole === 'faculty';

  const handleDelete = () => {
    deleteGalleryMedia(media.id);
    onClose();
  };

  const handleRestore = () => {
    restoreGalleryMedia(media.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      {/* Background click to dismiss */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Lightbox Container */}
      <div className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scale-up">
        {/* Top Header Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2 text-white">
            {media.type === 'video' ? <Video className="h-4 w-4 text-purple-400" /> : <Image className="h-4 w-4 text-indigo-400" />}
            <h3 className="text-sm font-bold font-display truncate max-w-xs sm:max-w-md">{media.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              media.isDeleted ? (
                <button
                  onClick={handleRestore}
                  title="Restore from Trash"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Restore
                </button>
              ) : (
                <button
                  onClick={handleDelete}
                  title="Delete Media"
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Move to Trash
                </button>
              )
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Media Preview Area */}
        <div className="relative flex-grow flex items-center justify-center bg-black min-h-[300px] md:min-h-[450px]">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('prev')}
                className="absolute left-4 z-20 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-indigo-600 border border-slate-700/80 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={() => onNavigate('next')}
                className="absolute right-4 z-20 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-indigo-600 border border-slate-700/80 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {media.type === 'video' ? (
            <div className="w-full h-full aspect-video">
              <iframe
                src={media.url}
                title={media.title}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={media.url}
              alt={media.title}
              className="max-h-[70vh] w-auto object-contain mx-auto"
            />
          )}
        </div>

        {/* Footer Details */}
        <div className="p-4 md:p-6 bg-slate-950/80 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-300">
          <div>
            <p className="text-slate-300 font-medium">{media.caption || 'No caption provided.'}</p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-semibold flex-shrink-0">
            <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-indigo-400" /> {media.uploadedBy}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-500" /> {media.uploadedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
