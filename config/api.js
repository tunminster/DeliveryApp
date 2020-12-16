import axios from 'axios';
import vars from "../utils/vars";

export const host = __DEV__ ? vars.host + '/api' : vars.host + '/api';

let axiosInstance = axios.create({
    baseURL: host
});

axiosInstance.defaults.headers.common['X-Shard'] = 'Da';
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

axiosInstance.interceptors.request.use((config) => {
    return config;
});

axiosInstance.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;