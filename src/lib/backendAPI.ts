import axios from 'axios';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
console.log("API_BASE_URL:", NEXT_PUBLIC_API_URL);

const apibackend = axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apibackend;
