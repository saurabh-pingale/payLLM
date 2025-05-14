import { fetchVideoByTarus, fetchVideoByVeo, fetchResponseByCluade } from "../common/api.action"
import { MODEL_TYPE } from "../common/constants"

export const convertSolToLamports = (sol: number) => {
    return sol*1e9
}

export const fetchResource = async ({modelType, query}: {query: string, modelType: string}) => {
    if(modelType === MODEL_TYPE.VEO){
        const data = await fetchVideoByVeo(query)
        return data
    } else if(modelType === MODEL_TYPE.TAVUS){
        const data = await fetchVideoByTarus(query)
        return data
    } else if(modelType === MODEL_TYPE.DEFAULT){
        const data = await fetchResponseByCluade(query)
        return data
    }
}

export const generateRandomId = (prefix = 'rb') => {
    const random = Math.random().toString(16).slice(2, 12); // 10 hex chars
    return `${prefix}${random}`;
  };

export const getSolFee = () => {
    return 0.001
}