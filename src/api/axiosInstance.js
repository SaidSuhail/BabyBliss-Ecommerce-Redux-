// import { error } from "ajv/dist/vocabularies/applicator/dependencies";
import axios from "axios";
export const axiosInstance  = axios.create({
    baseURL:'https://localhost:7055/api',
    headers: {
        'Content-Type': 'application/json', // Explicitly set the content type
      },
});

axiosInstance.interceptors.request.use(
    config=>{
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error=>Promise.reject(error)
);