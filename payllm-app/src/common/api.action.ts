import { generateRandomId } from "../utils/helper"
import { BACKEND_API } from "./constants"

const headers =  {
    'Content-Type': 'application/json',
  }

export const fetchVideoByVeo = async (query: string) => {
    const response = await fetch(`${BACKEND_API}/video/veo`,{
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ prompt: query })
    })
    const data = await response.json()
    if(data?.video_url){
        const parts = data.video_url.split('/');
        if (parts.length < 2) return 'Invalid video path format.';
        const blob_path = `${parts[1]}/${parts[2]}`;

        const signedUrlRes = await fetch(`${BACKEND_API}/video/veo/signed-url?blob_path=${encodeURIComponent(blob_path)}`,{
            method: 'POST'
        });
        const signedUrlData = await signedUrlRes.json();

        if (signedUrlData?.url) {
            return { type: 'video', url: signedUrlData.url };
        } else {
            return 'Failed to generate signed URL.';
        }
    }else{
        return 'Your prompt is prohited current safety rules, Try rephrasing the prompt.'
    }
}

export const fetchVideoByTarus = async (query: string) => {
    const response = await fetch(`${BACKEND_API}/video/tavus`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ replica_id: generateRandomId(), script: query })
    })
    const data = await response.json()
    if(data?.video_url){
        return data?.video_url
    }else{
        return 'Something went wrong'
    }
    
}