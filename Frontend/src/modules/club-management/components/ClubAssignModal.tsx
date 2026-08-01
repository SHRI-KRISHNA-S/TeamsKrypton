import React, { useState, useEffect } from 'react';
import { Modal, Button, Club, useApp } from '../../common';
import { UserCheck, ShieldCheck, Award } from 'lucide-react';

interface ClubAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club | null;
}

export const ClubAssignModal: React.FC<ClubAssignModalProps> = ({
  isOpen,
  onClose,
  club,
}) => {
  const { assignFacultyCoordinator, assignPresident, userProfiles } = useApp();

  const [facultyName, setFacultyName] = useState('');
  const [presidentName, setPresidentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter faculty users and student users from userProfiles if available, or fallback lists
  const availableFaculty = [
    'Dr. Sarah Jenkins (CSE)',
    'Prof. Marcus Vance (Mech)',
    'Dr. Emily Vance (Humanities)',
    'Prof. Alan Vance (MBA)',
    'Prof. Sandra Hall (Fine Arts)',
    'Dr. Robert Chen (Physics)',
    'Prof. Anita Roy (Biotech)',
  ];

  const availablePresidents = [
    'Alex Mercer (Year IV)',
    'Liam Carter (Year IV)',
    'Clara Hughes (Year III)',
    'Ryan Davis (Year IV)',
    'Elena Rostova (Year III)',
    'Vikram Seth (Year IV)',
    'Samantha Wu (Year III)',
    'Devon Miller (Year IV)',
  ];

  useEffect(() => {
    if (club) {
      setFacultyName(club.facultyCoordinator || '');
      setPresidentName(club.president || '');
    }
  }, [club, isOpen]);

  if (!club) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (facultyName !== club.facultyCoordinator) {
        assignFacultyCoordinator(club.id, facultyName);
      }
      if (presidentName !== club.president) {
        assignPresident(club.id, presidentName);
      }
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Leadership: ${club.name}`}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Save Leadership Assignments'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-3">
          <img src={club.logo} alt={club.name} className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">{club.name} ({club.category})</h4>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Manage faculty advisor & student president assignments.</p>
          </div>
        </div>

        {/* Assign Faculty Coordinator */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Faculty Coordinator
          </label>
          <select
            value={facultyName}
            onChange={e => setFacultyName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          >
            {availableFaculty.map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400">Faculty Coordinator approves events, budget, and membership rosters for this club.</p>
        </div>

        {/* Assign Club President */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-500" /> Club President
          </label>
          <select
            value={presidentName}
            onChange={e => setPresidentName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          >
            {availablePresidents.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400">Club President gets executive portal access for managing announcements, members, and events.</p>
        </div>
      </form>
    </Modal>
  );
};
