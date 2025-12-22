
export enum OpportunityType {
  INTERNSHIP = 'Internship',
  SCHOLARSHIP = 'Scholarship',
  COMPETITION = 'Competition',
  LEARNING_PROGRAM = 'Learning Program',
  RESEARCH = 'Research'
}

export enum ApplicationStatus {
  SAVED = 'Saved',
  IN_PROGRESS = 'In Progress',
  SUBMITTED = 'Submitted',
  INTERVIEWING = 'Interviewing',
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined'
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  deadline: string;
  description: string;
  link: string;
  tags: string[];
  diversityFocus: boolean;
  financialSupport: boolean;
}

export interface UserProfile {
  name: string;
  major: string;
  interests: string[];
  skills: string[];
  careerGoals: string;
  educationLevel: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TrackingItem {
  opportunityId: string;
  status: ApplicationStatus;
  notes: string;
  reminderSet: boolean;
}
