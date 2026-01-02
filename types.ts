
export type AppView = 'home' | 'chat' | 'gallery' | 'media-lab' | 'special';
export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
export type CharacterType = 'bear' | 'frog' | 'dog' | 'hippo' | 'banana' | 'fox';

export interface AudioSettings {
  bass: number; // Gain in dB, e.g. -10 to 10
  treble: number; // Gain in dB, e.g. -10 to 10
}

export interface VoicePersona {
  id: string;
  name: string;
  gender: 'female' | 'male';
  voice: VoiceName;
  desc: string;
  icon: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface GeneratedMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
}
