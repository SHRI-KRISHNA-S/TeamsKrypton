export interface PointsRule {
  key: string;
  label: string;
  points: number;
}

export const INITIAL_POINTS_RULES: PointsRule[] = [
  { key: 'HACKATHON_WINNER', label: 'Hackathon Winner', points: 100 },
  { key: 'HACKATHON_RUNNER_UP', label: 'Hackathon Runner-up', points: 75 },
  { key: 'COMPETITION_WINNER', label: 'Competition Winner', points: 80 },
  { key: 'COMPETITION_PARTICIPATION', label: 'Competition Participation', points: 25 },
  { key: 'WORKSHOP_PARTICIPATION', label: 'Workshop Participation', points: 15 },
  { key: 'SEMINAR_PARTICIPATION', label: 'Seminar Participation', points: 10 },
  { key: 'EVENT_ATTENDANCE', label: 'Event Attendance', points: 10 },
  { key: 'VOLUNTEER_ACTIVITY', label: 'Volunteer Activity', points: 20 },
  { key: 'EVENT_ORGANIZER', label: 'Event Organizer', points: 50 },
  { key: 'CLUB_PRESIDENT', label: 'Club President', points: 40 },
  { key: 'COMMITTEE_CONTRIBUTION', label: 'Committee Contribution', points: 30 },
  { key: 'LEADERSHIP_POSITION', label: 'Leadership Position', points: 35 },
  { key: 'CERTIFICATE_EARNED', label: 'Certificate Earned', points: 15 },
  { key: 'PERFECT_ATTENDANCE', label: 'Perfect Attendance', points: 20 },
  { key: 'FEEDBACK_SUBMISSION', label: 'Feedback Submission', points: 5 },
  { key: 'WINNING_CLUB_CHALLENGE', label: 'Winning Club Challenge', points: 60 }
];

export const getLevelDetails = (ap: number): { name: string; min: number; max: number } => {
  if (ap < 200) return { name: 'Explorer', min: 0, max: 199 };
  if (ap < 500) return { name: 'Contributor', min: 200, max: 499 };
  if (ap < 900) return { name: 'Leader', min: 500, max: 899 };
  if (ap < 1500) return { name: 'Champion', min: 900, max: 1499 };
  return { name: 'Legend', min: 1500, max: 99999 };
};
