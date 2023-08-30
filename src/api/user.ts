import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { PolicyRecord as CompanyRecord } from './company';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
}

export function updatePassword(params: any) {
  return axios.put('/auth/updatePassword', params);
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/auth/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/auth/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/auth/me');
}

export function getMenuList() {
  return axios.get<RouteRecordNormalized[]>('/auth/menu');
}

export interface PolicyRecord {
  id: string | number;
  name: string;
  nickname: string;
  company: CompanyRecord;
  phone: string;
  point: number;
  status: number;
  created_at: string;
}

export interface PolicyParams extends Partial<PolicyRecord> {
  page: number;
  pageSize: number;
}

export interface PaginationLaravel {
  current_page: number;
  total: number;
}

export interface PolicyListRes {
  data: PolicyRecord[];
  current_page: number;
  total: number;
}

export function queryPolicyList(params: PolicyParams | any) {
  return axios.get<PolicyListRes | any>('/user', {
    params,
  });
}

export function saveRecord(id: number, params: any) {
  return axios.put(`/user/${id}`, params);
}

export function operatePoint(userId: any, params: any) {
  return axios.post(`/user/${userId}/operatePoint`, params);
}
