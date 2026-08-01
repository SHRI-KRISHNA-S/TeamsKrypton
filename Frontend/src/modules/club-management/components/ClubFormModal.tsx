import React, { useState, useEffect } from 'react';
import { Modal, Button, Club, useApp } from '../../common';
import { Image, Upload, Plus, Trash2, AlertCircle } from 'lucide-react';

interface ClubFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubToEdit?: Club | null;
}

export const ClubFormModal: React.FC<ClubFormModalProps> = ({
  isOpen,
  onClose,
  clubToEdit,
}) => {
  const { createClub, updateClub } = useApp();

  const categories = [
    'Technical',
    'Engineering',
    'Arts & Humanities',
    'Business',
    'Creative Arts',
    'Sports',
    'Media',
  ];

  const defaultFormState = {
    name: '',
    code: '',
    category: 'Technical',
    description: '',
    department: 'Computer Science & Engineering',
    contactEmail: '',
    facultyCoordinator: '',
    president: '',
    logo: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=150&h=150&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop&q=80',
    status: 'Active' as 'Active' | 'Inactive' | 'Archived',
    visibility: 'Public' as 'Public' | 'Private',
    objectives: ['Conduct technical bootcamps and workshops on modern stacks.'],
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [newObjective, setNewObjective] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (clubToEdit) {
      setFormData({
        name: clubToEdit.name || '',
        code: clubToEdit.code || '',
        category: clubToEdit.category || 'Technical',
        description: clubToEdit.description || '',
        department: clubToEdit.department || 'Computer Science & Engineering',
        contactEmail: clubToEdit.contactEmail || '',
        facultyCoordinator: clubToEdit.facultyCoordinator || '',
        president: clubToEdit.president || '',
        logo: clubToEdit.logo || defaultFormState.logo,
        banner: clubToEdit.banner || defaultFormState.banner,
        status: clubToEdit.status || 'Active',
        visibility: clubToEdit.visibility || 'Public',
        objectives: clubToEdit.objectives && clubToEdit.objectives.length > 0 ? clubToEdit.objectives : defaultFormState.objectives,
      });
    } else {
      setFormData(defaultFormState);
    }
    setErrors({});
  }, [clubToEdit, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Club name is required';
    else if (formData.name.trim().length < 3) errs.name = 'Name must be at least 3 characters';

    if (!formData.description.trim()) errs.description = 'Description is required';
    else if (formData.description.trim().length < 15) errs.description = 'Description must be at least 15 characters';

    if (!formData.facultyCoordinator.trim()) errs.facultyCoordinator = 'Faculty Coordinator is required';
    if (!formData.president.trim()) errs.president = 'President is required';

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errs.contactEmail = 'Invalid email address format';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [targetField]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      if (clubToEdit) {
        updateClub(clubToEdit.id, formData);
      } else {
        createClub(formData);
      }
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clubToEdit ? `Edit Club: ${clubToEdit.name}` : 'Create New Club'}
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : clubToEdit ? 'Save Changes' : 'Create Club'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Club Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Coding Club"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.name && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Short Code / Tag
            </label>
            <input
              type="text"
              placeholder="e.g. CODING"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <input
              type="text"
              placeholder="e.g. Computer Science & Engineering"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Detailed description of the club purpose, activities, and target audience..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3 py-2 text-xs rounded-xl border ${
              errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none`}
          />
          {errors.description && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.description}</p>}
        </div>

        {/* Governance & Leadership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Faculty Coordinator <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Sarah Jenkins (CSE)"
              value={formData.facultyCoordinator}
              onChange={e => setFormData({ ...formData, facultyCoordinator: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.facultyCoordinator ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.facultyCoordinator && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.facultyCoordinator}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Club President <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Mercer (Year IV)"
              value={formData.president}
              onChange={e => setFormData({ ...formData, president: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.president ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.president && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.president}</p>}
          </div>
        </div>

        {/* Status & Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Archived' })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={e => setFormData({ ...formData, visibility: e.target.value as 'Public' | 'Private' })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              <option value="Public">Public (All Students)</option>
              <option value="Private">Private (Invite Only)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              placeholder="club@campus.edu"
              value={formData.contactEmail}
              onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.contactEmail ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.contactEmail && <p className="text-[10px] text-rose-500 mt-1">{errors.contactEmail}</p>}
          </div>
        </div>

        {/* Media Assets (Logo & Banner) */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Image className="h-4 w-4 text-indigo-500" /> Branding & Media Assets
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logo field */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Club Logo Avatar
              </label>
              <div className="flex items-center gap-3">
                <img src={formData.logo} alt="Logo Preview" className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                  <Upload className="h-3.5 w-3.5" /> Upload File
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'logo')} />
                </label>
              </div>
              <input
                type="text"
                placeholder="Or paste Logo Image URL"
                value={formData.logo}
                onChange={e => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Banner field */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Header Banner Image
              </label>
              <div className="flex items-center gap-3">
                <img src={formData.banner} alt="Banner Preview" className="h-12 w-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                  <Upload className="h-3.5 w-3.5" /> Upload File
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'banner')} />
                </label>
              </div>
              <input
                type="text"
                placeholder="Or paste Banner Image URL"
                value={formData.banner}
                onChange={e => setFormData({ ...formData, banner: e.target.value })}
                className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Key Objectives
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add objective statement..."
              value={newObjective}
              onChange={e => setNewObjective(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addObjective(); } }}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
            <Button type="button" variant="outline" size="sm" onClick={addObjective} className="flex-shrink-0">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          <ul className="space-y-1.5 pt-1">
            {formData.objectives.map((obj, idx) => (
              <li key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <span>• {obj}</span>
                <button
                  type="button"
                  onClick={() => removeObjective(idx)}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </Modal>
  );
};
