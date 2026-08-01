import React, { useState, useEffect } from 'react';
import { Modal, Button, useApp } from '../../common';
import { Image, Video, Upload, AlertCircle, Link } from 'lucide-react';

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClubId?: string;
  defaultAlbumId?: string;
}

export const UploadMediaModal: React.FC<UploadMediaModalProps> = ({
  isOpen,
  onClose,
  defaultClubId,
  defaultAlbumId,
}) => {
  const { clubs, galleryAlbums, uploadGalleryMedia } = useApp();

  const activeClubs = clubs.filter(c => c.status === 'Active');

  const defaultFormState = {
    clubId: defaultClubId || activeClubs[0]?.id || 'club-1',
    albumId: defaultAlbumId || galleryAlbums[0]?.id || 'album-1',
    title: '',
    caption: '',
    type: 'image' as 'image' | 'video',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop&q=80',
    thumbnail: '',
    uploadedBy: 'Alex Mercer (President)',
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultAlbumId) {
      const album = galleryAlbums.find(a => a.id === defaultAlbumId);
      setFormData(prev => ({
        ...prev,
        albumId: defaultAlbumId,
        clubId: album ? album.clubId : prev.clubId
      }));
    }
  }, [defaultAlbumId, isOpen]);

  const targetAlbums = galleryAlbums.filter(a => a.clubId === formData.clubId);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Media title is required';
    if (!formData.url.trim()) errs.url = 'Media URL or file is required';
    if (!formData.albumId) errs.albumId = 'Target album must be selected';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ url: 'File size exceeds 10MB limit' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, url: reader.result as string, type: 'image' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      uploadGalleryMedia(formData);
      setIsSubmitting(false);
      onClose();
      setFormData(defaultFormState);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Photo or Embed Video"
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Publish to Gallery'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Media Type Toggle */}
        <div className="flex gap-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'image' })}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
              formData.type === 'image'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Image className="h-4 w-4" /> Photo Image
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' })}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
              formData.type === 'video'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Video className="h-4 w-4" /> Video Embed
          </button>
        </div>

        {/* Target Club & Target Album */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Club <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.clubId}
              onChange={e => setFormData({ ...formData, clubId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-semibold"
            >
              {clubs.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Album <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.albumId}
              onChange={e => setFormData({ ...formData, albumId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-semibold"
            >
              {targetAlbums.length === 0 ? (
                <option value="">No Albums Available (Create one first)</option>
              ) : (
                targetAlbums.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Media Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Media Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Hackathon Keynote Highlights"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3 py-2 text-xs rounded-xl border ${
              errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
          />
          {errors.title && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.title}</p>}
        </div>

        {/* Caption */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Caption / Notes
          </label>
          <input
            type="text"
            placeholder="Brief caption describing the moment..."
            value={formData.caption}
            onChange={e => setFormData({ ...formData, caption: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>

        {/* File Upload or Video Link Input */}
        {formData.type === 'image' ? (
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Upload className="h-4 w-4 text-indigo-500" /> Photo Upload & Preview
            </label>
            <div className="flex items-center gap-3">
              {formData.url && <img src={formData.url} alt="Preview" className="h-16 w-24 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />}
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                <Upload className="h-3.5 w-3.5" /> Select Local File
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <input
              type="text"
              placeholder="Or paste Photo Image URL"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        ) : (
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Link className="h-4 w-4 text-purple-500" /> Video URL / Embed Link
            </label>
            <input
              type="text"
              placeholder="e.g. https://www.youtube.com/embed/..."
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-400">Supports YouTube embed URLs, Vimeo, or direct MP4 video URLs.</p>
          </div>
        )}
      </form>
    </Modal>
  );
};
