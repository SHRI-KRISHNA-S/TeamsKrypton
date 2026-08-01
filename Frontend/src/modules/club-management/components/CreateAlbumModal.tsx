import React, { useState, useEffect } from 'react';
import { Modal, Button, GalleryAlbum, useApp } from '../../common';
import { Image, Upload, Calendar, AlertCircle } from 'lucide-react';

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumToEdit?: GalleryAlbum | null;
  defaultClubId?: string;
}

export const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  isOpen,
  onClose,
  albumToEdit,
  defaultClubId,
}) => {
  const { clubs, events, createGalleryAlbum, updateGalleryAlbum } = useApp();

  const defaultFormState = {
    clubId: defaultClubId || clubs[0]?.id || 'club-1',
    title: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&q=80',
    eventId: '',
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (albumToEdit) {
      setFormData({
        clubId: albumToEdit.clubId || defaultClubId || 'club-1',
        title: albumToEdit.title || '',
        description: albumToEdit.description || '',
        coverImage: albumToEdit.coverImage || defaultFormState.coverImage,
        eventId: albumToEdit.eventId || '',
      });
    } else {
      setFormData(defaultFormState);
    }
    setErrors({});
  }, [albumToEdit, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Album title is required';
    if (!formData.description.trim()) errs.description = 'Album description is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      if (albumToEdit) {
        updateGalleryAlbum(albumToEdit.id, formData);
      } else {
        createGalleryAlbum(formData);
      }
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={albumToEdit ? `Edit Album: ${albumToEdit.title}` : 'Create New Gallery Album'}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : albumToEdit ? 'Save Album' : 'Create Album'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target Club */}
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
                {c.name} ({c.category})
              </option>
            ))}
          </select>
        </div>

        {/* Album Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Album Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Annual Hackathon 2026 Highlights"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3 py-2 text-xs rounded-xl border ${
              errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
          />
          {errors.title && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Brief summary of photos and videos in this album..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3 py-2 text-xs rounded-xl border ${
              errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none`}
          />
          {errors.description && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.description}</p>}
        </div>

        {/* Linked Event (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Linked Event Tag (Optional)
          </label>
          <select
            value={formData.eventId}
            onChange={e => setFormData({ ...formData, eventId: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          >
            <option value="">None (General Album)</option>
            {events.map(evt => (
              <option key={evt.id} value={evt.id}>{evt.title} ({evt.date})</option>
            ))}
          </select>
        </div>

        {/* Cover Photo Selection */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Image className="h-4 w-4 text-indigo-500" /> Album Cover Photo
          </label>
          <div className="flex items-center gap-3">
            <img src={formData.coverImage} alt="Cover Preview" className="h-16 w-24 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
              <Upload className="h-3.5 w-3.5" /> Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <input
            type="text"
            placeholder="Or paste Cover Image URL"
            value={formData.coverImage}
            onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
            className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </form>
    </Modal>
  );
};
