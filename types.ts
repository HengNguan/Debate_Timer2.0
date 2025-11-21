
export enum TimerMode {
  STANDARD = 'STANDARD',
  CHESS = 'CHESS'
}

export enum SpeakerState {
  IDLE = 'IDLE',
  SPEAKER_A = 'SPEAKER_A',
  SPEAKER_B = 'SPEAKER_B'
}

export type RoundType = 'NORMAL' | 'CHESS';

export interface Round {
  id: string;
  title: string;
  type: RoundType;
  durationMinutes: number;
  speaker?: 'A' | 'B'; // Only for NORMAL
}
