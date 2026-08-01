export const POINTS_CONFIG = {
  HACKATHON_WINNER: 300,
  HACKATHON_RUNNER_UP: 200,
  COMPETITION_WINNER: 150,
  COMPETITION_PARTICIPATION: 50,
  WORKSHOP_PARTICIPATION: 30,
  SEMINAR_PARTICIPATION: 20,
  EVENT_ATTENDANCE: 10,
  VOLUNTEER_ACTIVITY: 40,
  EVENT_ORGANIZER: 100,
  CLUB_PRESIDENT: 250,
  LEADERSHIP_POSITION: 150,
  COMMITTEE_CONTRIBUTION: 80,
  CERTIFICATE_EARNED: 50,
  PERFECT_ATTENDANCE: 100,
  FEEDBACK_SUBMISSION: 5,
};

export type ActivityType = keyof typeof POINTS_CONFIG;

export const LEVEL_SYSTEM = [
  { minAp: 0, maxAp: 199, name: 'Explorer' },
  { minAp: 200, maxAp: 499, name: 'Contributor' },
  { minAp: 500, maxAp: 899, name: 'Leader' },
  { minAp: 900, maxAp: 1499, name: 'Champion' },
  { minAp: 1500, maxAp: Infinity, name: 'Legend' },
];

export const getStudentLevel = (points: number): string => {
  const level = LEVEL_SYSTEM.find(lvl => points >= lvl.minAp && points <= lvl.maxAp);
  return level ? level.name : 'Explorer';
};
