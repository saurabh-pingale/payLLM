PayLLM app build using [React.js](https://react.dev/)

## Prerequisite

| Prerequisite | Version          |
| ------------ | ---------------- |
| Node         | Latest (v21.2.0) |
| NPM          | Latest (v10.2.3) |
| Python       | >= v3.10         |
| Typescript   | Latest (v4.8.3)  |
| FastAPI      | >= 0.115.0       |
| Uvicorn      | >= 0.34.0        |

## Getting Started

### Installation (Frontend)

Navigate to the payllm-app directory:

```bash
  cd payllm-app
  npm install
```

Copy the contents of .env.template into a new .env file and update the variables:

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Installation (Backend)

Navigate to the payllm-server directory:

```bash
  cd payllm-server
  pip install -r requirements.txt
```

Create a .env file using the below template:

```py
  GOOGLE_CLOUD_PROJECT=
  GOOGLE_APPLICATION_CREDENTIALS=
  DEFAULT_GCP_BUCKET=
  DEFAULT_GCP_BUCKET_NAME=
  TAVUS_API_KEY=
  CLAUDE_API_KEY=
```

Run the backend server:

```bash
python main.py
```

API will be available at [http://localhost:8000](http://localhost:8000)

## Frontend File Structure

    .
    ├── public/
    ├── src/
    │   ├── common/
    │   │   ├── api.action.ts
    │   │   ├── constants.ts
    │   │   ├── contracts.ts
    │   │   ├── idl.json
    │   │   ├── idl.ts
    │   │   └── types.ts
    │   ├── components/
    │   │   ├── chatPage/
    │   │   ├── Popup/
    │   │   ├── SearchBox/
    │   │   ├── TypingLoader/
    │   │   └── WelcomeMessage/
    │   ├── styles/
    │   ├── utils/
    │   └── App.tsx
    ├── .env
    └── package.json

## Backend File Structure

    .
    ├── .env
    ├── config.py
    ├── constants.py
    ├── external_api_service.py
    ├── main.py
    ├── models.py
    ├── services/
    └── requirements.txt

## Design Overview

- Frontend (React + Solana):

    - Built using React with Typescript and SCSS.
     
    - Integrated Solana wallet using @solana/web3.js and wallet adapter packages.
    
    - UI is modular and follows reusable component structure.
    
    - Easily customizable themes, messages, and interactions.

- Backend (FastAPI + Google Cloud):
 
    - FastAPI-based server with endpoints interacting with Claude and Tavus APIs.
    
    - Handles cloud storage, AI response generation, and secure API access.
    
    - Credentials and API keys managed via environment variables.
    
    - Ready for deployment on GCP or Docker.
