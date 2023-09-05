import axios from 'axios';

export interface ImageCaptchaRes {
  key: string;
  img: string;
}
export function getImageCaptcha() {
  return axios.get<ImageCaptchaRes>('/common/captcha/img');
}
