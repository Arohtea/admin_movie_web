import axios from 'axios';
import router from '@/router';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
});

instance.interceptors.request.use(
  function (config) {
    const token = JSON.parse(localStorage.getItem('jwt-token')); 
    console.log(token);
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        localStorage.removeItem('jwt-token');
        router.push('/loginpage');
  
        return Promise.reject(error);
      }
  
      return Promise.reject(error);
    }
  );

export default instance;