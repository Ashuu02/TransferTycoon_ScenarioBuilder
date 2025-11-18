export interface FormScenario {
  id: string;
  timestamp: string;
  data: Record<string, any>;
  rawInput: string;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  PREVIEW = 'PREVIEW',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}