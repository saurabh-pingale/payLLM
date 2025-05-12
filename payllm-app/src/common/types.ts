export interface ModelOption {
    id: string;
    name: string;
    placeholder: string;
  }
  
 export interface VideoContent {
  type: 'video';
  url: string;
}

export interface TextMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export interface VideoMessage {
  id: number;
  text: VideoContent;
  sender: 'user' | 'ai';
}

export type Message = TextMessage | VideoMessage; 