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
        const formatted_url = `https://storage.cloud.google.com/${data?.video_url}`
        return formatted_url
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