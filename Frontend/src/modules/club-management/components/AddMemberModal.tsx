import React, { useState } from 'react';
import { Modal, Button, CommitteeRole, useApp } from '../../common';
import { UserPlus, AlertCircle } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClubId?: string;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  defaultClubId,
}) => {
  const { clubs, addClubMember } = useApp();

  const activeClubs = clubs.filter(c => c.status === 'Active');

  const defaultFormState = {
    clubId: defaultClubId || activeClubs[0]?.id || 'club-1',
    studentId: '',
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    academicYear: 'Year III',
    role: 'General Member' as CommitteeRole,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
    status: 'Active' as 'Active' | 'Inactive',
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Mechanical Engineering',
    'Humanities & Social Sciences',
    'School of Management',
    'Media & Design',
    'Biotechnology',
  ];

  const academicYears = ['Year I', 'Year II', 'Year III', 'Year IV'];
  const roles: CommitteeRole[] = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Core Member', 'General Member'];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Student name is required';
    if (!formData.studentId.trim()) errs.studentId = 'Student ID / Roll No is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email address';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addClubMember(formData);
      setIsSubmitting(false);
      onClose();
      setFormData(defaultFormState);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Member to Club"
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Enrolling...' : 'Enroll Member'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Target Club */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Target Club <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.clubId}
            onChange={e => setFormData({ ...formData, clubId: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-semibold"
          >
            {activeClubs.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.category})
              </option>
            ))}
          </select>
        </div>

        {/* Student Name & Roll No */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Student Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.name && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Student Roll No / ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. STU-2024-089"
              value={formData.studentId}
              onChange={e => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.studentId ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.studentId && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.studentId}</p>}
          </div>
        </div>

        {/* Email & Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Campus Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="student@campus.edu"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.email && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Initial Role Designation
            </label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value as CommitteeRole })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Department & Academic Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Academic Year
            </label>
            <select
              value={formData.academicYear}
              onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              {academicYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};
