export enum TimerMode {
  STANDARD = 'STANDARD',
  CHESS = 'CHESS'
}

export enum SpeakerState {
  IDLE = 'IDLE',
  SPEAKER_A = 'SPEAKER_A',
  SPEAKER_B = 'SPEAKER_B'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  WIDE = '16:9',
  TALL = '9:16'
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  aspectRatio: AspectRatio;
}

export interface DebateTopic {
  id: string;
  topic: string;
  category: string;
}

export type RoundType = 'NORMAL' | 'CHESS';

export interface Round {
  id: string;
  title: string;
  type: RoundType;
  durationMinutes: number;
  speaker?: 'A' | 'B'; // Only for NORMAL
}