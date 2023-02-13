import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // console.log('res', res);
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 200) {
    //   Message.error({
    //     content: res.msg || 'Error',
    //     duration: 5 * 1000,
    //   });
    //   return Promise.reject(new Error(res.msg || 'Error'));
    // }
    return res;
  },
  (error) => {
    const { message, status } = error.response.data;
    if (status === 401) {
      Modal.error({
        title: 'Confirm logout',
        content:
          'You have been logged out, you can cancel to stay on this page, or log in again',
        okText: 'Re-Login',
        async onOk() {
          const userStore = useUserStore();

          await userStore.logout();
          window.location.reload();
        },
      });
    }
    Message.error({
      content: message || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(message);
  }
);
