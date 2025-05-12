import { ModelOption } from "./types";

export const BACKEND_API = process.env.REACT_APP_BACKEND_API
export const FIREBASE_DB_API = process.env.REACT_APP_FIREBASE_DB_API
export const SOL_ADMIN_RECEIVER_ADDRESS = process.env.REACT_APP_SOL_RECEIVER_ADDRESS as string
export const SOL_WALLET_KEYPAIR = JSON.parse(process.env.REACT_APP_SOL_WALLET_KEYPAIR as string)

export const MODEL_TYPE = {
  DEFAULT:'default',
  VEO: 'veo2',
  TAVUS: 'tavus'
}

export const modelOptions: ModelOption[] = [
    { id: MODEL_TYPE.DEFAULT, name: 'Default', placeholder: 'Ask general text queries' },
    { id: MODEL_TYPE.VEO, name: 'Veo2', placeholder: 'Generate or Describe about your video' },
    { id: MODEL_TYPE.TAVUS, name: 'Tavus', placeholder: 'Generate or Describe lipsync video' },
  ];