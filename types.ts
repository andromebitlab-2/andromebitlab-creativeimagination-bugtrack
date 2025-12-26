
export type IssueType = 'Bug' | 'Error crítico' | 'Propuesta' | 'Sugerencia' | 'Otros';

// Ahora la versión es un string dinámico
export type GameVersion = string;

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
