import axios from 'axios';
import qs from 'query-string';

export interface PolicyRecord {
  id: string | number;
  name: string;
  status?: number;
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
  return axios.get<PolicyListRes | any>('/expressCompany', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function saveRecord(id: any, params: PolicyRecord) {
  return axios.put(`/expressCompany/${id}`, params);
}

export function addRecord(params: any) {
  return axios.post('/expressCompany', params);
}

export function deleteRecord(id: number) {
  return axios.delete(`/expressCompany/${id}`);
}
