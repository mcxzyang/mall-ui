import axios from 'axios';
import qs from 'query-string';

export interface PolicyRecord {
  id: string | number;
  pid?: number;
  name: string;
  status?: number;
  remark?: string | null;
  created_at?: string;
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
  return axios.get<PolicyListRes | any>('/category', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getCategoryList() {
  return axios.get('/category/get/list');
}

export function saveRecord(id: number, params: PolicyRecord) {
  return axios.put(`/category/${id}`, params);
}

export function addRecord(params: any) {
  return axios.post('/category', params);
}

export function deleteRecord(id: number) {
  return axios.delete(`/category/${id}`);
}
