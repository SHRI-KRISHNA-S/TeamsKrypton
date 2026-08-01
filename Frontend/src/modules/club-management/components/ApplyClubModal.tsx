import React, { useState, useEffect } from 'react';
import { Modal, Button, useApp } from '../../common';
import { UserPlus, AlertCircle, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ApplyClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClubId?: string;
}

export const ApplyClubModal: React.FC<ApplyClubModalProps> = ({
  isOpen,
  onClose,
  defaultClubId,
}) => {
  const { clubs, submitMembershipRequest } = useApp();

  const activeClubs = clubs.filter(c => c.status === 'Active');

  const defaultFormState = {
    clubId: defaultClubId || activeClubs[0]?.id || 'club-1',
    studentName: 'Amit Sharma',
    studentId: 'STU-2024-102',
    studentEmail: 'amit.sharma@student.edu',
    department: 'Computer Science & Engineering',
    year: 'Year II',
    statement: '',
    skills: '',
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultClubId) {
      setFormData(prev => ({ ...prev, clubId: defaultClubId }));
    }
  }, [defaultClubId, isOpen]);

  const selectedClub = clubs.find(c => c.id === formData.clubId);
  const maxCapacity = 150; // Standard club capacity threshold
  const currentMembers = selectedClub?.membersCount || 0;
  const isNearCapacity = currentMembers >= maxCapacity * 0.9;
  const isAtCapacity = currentMembers >= maxCapacity;

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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.studentName.trim()) errs.studentName = 'Student name is required';
    if (!formData.studentId.trim()) errs.studentId = 'Student ID / Roll No is required';
    if (!formData.studentEmail.trim()) errs.studentEmail = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) errs.studentEmail = 'Invalid email address';

    if (!formData.statement.trim()) errs.statement = 'Statement of purpose is required';
    else if (formData.statement.trim().length < 15) errs.statement = 'Please write at least 15 characters describing your interest';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitMembershipRequest(formData.clubId, formData);
      setIsSubmitting(false);
      onClose();
      setFormData(defaultFormState);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Club Membership"
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target Club Selection & Capacity Alert */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Target Organization <span className="text-rose-500">*</span>
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

          {selectedClub && (
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              isAtCapacity 
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 text-amber-800 dark:text-amber-300'
                : isNearCapacity
                ? 'bg-sky-50 dark:bg-sky-950/20 border-sky-200 text-sky-800 dark:text-sky-300'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <div className="flex items-center gap-2">
                {isAtCapacity ? <ShieldAlert className="h-4 w-4 text-amber-500" /> : <Sparkles className="h-4 w-4 text-indigo-500" />}
                <span>
                  Capacity: <strong className="font-bold">{currentMembers}</strong> / {maxCapacity} seats filled
                </span>
              </div>
              {isAtCapacity && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100">
                  Waitlist Active
                </span>
              )}
            </div>
          )}
        </div>

        {/* Student Name & Roll No */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Applicant Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Full Student Name"
              value={formData.studentName}
              onChange={e => setFormData({ ...formData, studentName: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.studentName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.studentName && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.studentName}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Student ID / Roll No <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. STU-2024-102"
              value={formData.studentId}
              onChange={e => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.studentId ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.studentId && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.studentId}</p>}
          </div>
        </div>

        {/* Email & Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Campus Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="student@campus.edu"
              value={formData.studentEmail}
              onChange={e => setFormData({ ...formData, studentEmail: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.studentEmail ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500`}
            />
            {errors.studentEmail && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.studentEmail}</p>}
          </div>

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
        </div>

        {/* Year & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Academic Year
            </label>
            <select
              value={formData.year}
              onChange={e => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              {academicYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Relevant Skills / Experience
            </label>
            <input
              type="text"
              placeholder="e.g. React, CAD, Public Speaking"
              value={formData.skills}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Statement of Purpose */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Statement of Purpose / Why do you want to join? <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Explain why you wish to join this club and what contributions you hope to make..."
            value={formData.statement}
            onChange={e => setFormData({ ...formData, statement: e.target.value })}
            className={`w-full px-3 py-2 text-xs rounded-xl border ${
              errors.statement ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none`}
          />
          {errors.statement && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.statement}</p>}
        </div>
      </form>
    </Modal>
  );
};
