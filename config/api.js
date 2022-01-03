import axios from 'axios';
import vars,{getRemoteConfig} from "../utils/vars";
import Store from "./store";

export const host = __DEV__ ? Store?.remoteConfig?.host ? Store?.remoteConfig?.host : 'https://delivery-api.harveynetwork.com' + '/api' : Store?.remoteConfig?.host ? Store?.remoteConfig?.host : 'https://delivery-api.harveynetwork.com' + '/api';
console.log('[host]',Store?.remoteConfig)
let axiosInstance = axios.create({
    baseURL: vars.host + '/api'
});

axiosInstance.defaults.headers.common['X-Shard'] = Store?.remoteConfig?.xShard ? Store?.remoteConfig?.xShard :'' ;
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

export const setBaseURL = (data) => {
    axiosInstance = axios.create({
        baseURL: data.host+'/api'
    });
    axiosInstance.defaults.headers.common['X-Shard'] = data?.xShard ;
}

axiosInstance.interceptors.request.use((config) => {
    config = {
        ...config,
        baseURL:Store?.remoteConfig?.host+'/api',
        headers:{
            ...config.headers,
            common:{
                ...config.headers.common,
                ['X-Shard']:Store?.remoteConfig?.xShard
            }
        }
    }
    return config;
});

axiosInstance.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;