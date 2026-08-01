import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Badge, Button, useApp, Club } from '../../common';
import { ClubFormModal } from '../components/ClubFormModal';
import { 
  Building2, 
  Users, 
  Edit3, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FacultyClubs: React.FC = () => {
  const { clubs, changeClubStatus } = useApp();
  const navigate = useNavigate();

  const [selectedClubForEdit, setSelectedClubForEdit] = useState<Club | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // In production, filtered by logged-in faculty user. Showing supervised clubs.
  const supervisedClubs = clubs.slice(0, 3); // Top clubs for faculty view demonstration

  const handleEdit = (club: Club) => {
    setSelectedClubForEdit(club);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          Supervised Clubs Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review parameters, monitor member activity, edit branding, and manage operational status for clubs under your academic supervision.
        </p>
      </div>

      {/* Grid of Supervised Clubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supervisedClubs.map(club => (
          <Card key={club.id} hoverable={true} className="flex flex-col h-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
            <CardBody className="space-y-4 flex-grow">
              {/* Header Banner / Logo */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <img src={club.logo} alt={club.name} className="h-12 w-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
                  <div>
                    <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">{club.name}</h3>
                    <Badge variant="primary" className="py-0.5 px-2 text-[9px] mt-0.5">{club.category}</Badge>
                  </div>
                </div>

                <Badge 
                  variant={club.status === 'Active' ? 'secondary' : 'accent'}
                  className="py-0.5 px-2 text-[10px]"
                >
                  {club.status || 'Active'}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {club.description}
              </p>

              {/* Leadership info */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">President:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{club.president}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Department:</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">{club.department || 'General'}</span>
                </div>
              </div>

              {/* Objectives List sample */}
              {club.objectives && club.objectives.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Key Objectives:</h4>
                  <ul className="space-y-1 text-[10px] text-slate-500 dark:text-slate-400">
                    {club.objectives.slice(0, 2).map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span className="line-clamp-1">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardBody>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center gap-1.5"
                onClick={() => handleEdit(club)}
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Branding
              </Button>

              {club.status === 'Active' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  onClick={() => changeClubStatus(club.id, 'Inactive')}
                >
                  <XCircle className="h-3.5 w-3.5" /> Set Inactive
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  onClick={() => changeClubStatus(club.id, 'Active')}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Set Active
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for editing supervised club */}
      <ClubFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        clubToEdit={selectedClubForEdit}
      />
    </div>
  );
};
