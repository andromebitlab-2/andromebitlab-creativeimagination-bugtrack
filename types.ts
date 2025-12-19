
export type IssueType = 'Bug' | 'Error crítico' | 'Propuesta' | 'Sugerencia' | 'Otros';

export type GameVersion = 
  | '1.0' | '1.0.1' | '1.0.2' 
  | '1.1' | '1.1.1' 
  | '1.2' | '1.2.1' | '1.2.2' | '1.2.3' | '1.2.4' | '1.2.5';

export interface User {
  id: string;
  username: string;
  userHex: string;
  submissionCount: number;
  isAdmin: boolean;
}

export interface Report {
  id: string;
  userId: string;
  username: string;
  version: GameVersion;
  type: IssueType;
  description: string;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
  reportCode: string;
  createdAt: number;
  status: string;
}

export interface AppSettings {
  logoUrl: string;
  emphasisColor: string;
}
