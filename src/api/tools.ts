import axios from 'axios';

export function userUploadApi(data: FormData) {
  // const controller = new AbortController();
  return axios.post('/tools/uploadPic', data);
}
