import { ModelOption } from "./types";

export const BACKEND_API = process.env.REACT_APP_BACKEND_API
export const SOL_ADMIN_RECEIVER_ADDRESS = process.env.REACT_APP_SOL_RECEIVER_ADDRESS as string
export const SOL_WALLET_KEYPAIR = process.env.REACT_APP_SOL_WALLET_KEYPAIR as string

export const MODEL_TYPE = {
  DEFAULT:'default',
  VEO: 'veo2',
  TAVUS: 'tavus'
}

export const modelOptions: ModelOption[] = [
    { id: MODEL_TYPE.DEFAULT, name: 'Default', placeholder: 'Ask claude pro version' },
    { id: MODEL_TYPE.VEO, name: 'Veo2', placeholder: 'Generate or Describe about your video' },
    { id: MODEL_TYPE.TAVUS, name: 'Tavus', placeholder: 'Generate or Describe lipsync video' },
  ];

export const MESSAGE_CHAR_LIMITS = {
  DEFAULT: 4000,
  OTHER: 2000
};