import axios from 'axios';
import router from '@/router';

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
});

// 设置请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么，例如添加token
    const token = localStorage.getItem('jwt-token'); // 假设这是一个获取token的函数
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
    function (response) {
      // 对响应数据做点什么
      return response;
    },
    function (error) {
      const originalRequest = error.config;
  
      // 如果是401错误并且没有重试过，尝试刷新token
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        // 清除token并跳转到登录页
        localStorage.removeItem('jwt-token');
        router.push('/loginpage');
  
        return Promise.reject(error);
      }
  
      // 其他错误处理
      return Promise.reject(error);
    }
  );

// 导出配置好的axios实例
export default instance;