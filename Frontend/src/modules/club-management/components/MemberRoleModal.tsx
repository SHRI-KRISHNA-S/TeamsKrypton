import React, { useState, useEffect } from 'react';
import { Modal, Button, ClubMember, CommitteeRole, useApp } from '../../common';
import { ShieldAlert, Award, UserCheck } from 'lucide-react';

interface MemberRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: ClubMember | null;
}

export const MemberRoleModal: React.FC<MemberRoleModalProps> = ({
  isOpen,
  onClose,
  member,
}) => {
  const { updateMemberRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<CommitteeRole>('General Member');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles: CommitteeRole[] = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Core Member',
    'General Member',
  ];

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
    }
  }, [member, isOpen]);

  if (!member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      updateMemberRole(member.id, selectedRole);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Designation: ${member.name}`}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Save Designation'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Member Profile Header Card */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {member.name}
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{member.studentId}</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold">{member.department} • {member.academicYear}</p>
          </div>
        </div>

        {/* Role Select Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-indigo-500" /> Assign Committee Designation
          </label>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value as CommitteeRole)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-semibold"
          >
            {roles.map(r => (
              <option key={r} value={r}>
                {r} {r === 'President' ? '(Executive Head)' : r === 'Vice President' ? '(Executive Deputy)' : ''}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400 leading-normal">
            Promoting a member to an executive or core role grants elevated dashboard management permissions for club operations.
          </p>
        </div>
      </form>
    </Modal>
  );
};
