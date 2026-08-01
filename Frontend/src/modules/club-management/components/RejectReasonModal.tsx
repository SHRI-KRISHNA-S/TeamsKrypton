import React, { useState, useEffect } from 'react';
import { Modal, Button, MembershipRequest, useApp } from '../../common';
import { AlertTriangle, Clock, Send } from 'lucide-react';

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: MembershipRequest | null;
  actionType: 'reject' | 'waitlist';
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  isOpen,
  onClose,
  request,
  actionType,
}) => {
  const { handleMembership } = useApp();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (actionType === 'waitlist') {
      setReason('Maximum club capacity reached for current semester. Application placed on waitlist.');
    } else {
      setReason('');
    }
  }, [actionType, request, isOpen]);

  if (!request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      handleMembership(request.id, actionType, reason.trim() || undefined);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={actionType === 'waitlist' ? `Place on Waitlist: ${request.studentName}` : `Reject Application: ${request.studentName}`}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant={actionType === 'waitlist' ? 'accent' : 'danger'} 
            size="sm" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex items-center gap-1.5"
          >
            {isSubmitting ? 'Processing...' : actionType === 'waitlist' ? 'Confirm Waitlist' : 'Confirm Rejection'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Applicant summary card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{request.studentName}</h4>
              <p className="text-[10px] text-slate-400 font-semibold">{request.department} • {request.year}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              {request.clubName}
            </span>
          </div>
          {request.statement && (
            <p className="text-[11px] text-slate-650 dark:text-slate-350 italic pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 line-clamp-2">
              "{request.statement}"
            </p>
          )}
        </div>

        {/* Reason / Feedback field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            {actionType === 'waitlist' ? <Clock className="h-4 w-4 text-amber-500" /> : <AlertTriangle className="h-4 w-4 text-rose-500" />}
            {actionType === 'waitlist' ? 'Waitlist Reason / Note' : 'Rejection Feedback (Optional)'}
          </label>
          <textarea
            rows={3}
            placeholder={actionType === 'waitlist' ? 'Note for waitlisting applicant...' : 'Reason for rejecting this membership application...'}
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            This message will be included in the automated notification sent to the student applicant.
          </p>
        </div>
      </form>
    </Modal>
  );
};
