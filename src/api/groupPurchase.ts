import axios from 'axios';
import { PropType } from 'vue';
import { PolicyRecord as ProductRecord } from './product';

export interface PolicyRecord {
  id: number;
  title: string;
  image: string;
  number_count: number;
  start_at?: string;
  end_at?: string;
  price: string;
  finish_type?: number;
  finish_at?: string;
  status?: number;
  product?: ProductRecord;
  companies?: PropType<number[]>;
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

export function queryPolicyList(params: PolicyParams) {
  return axios.get<PolicyListRes>('/groupPurchase', {
    params,
    // paramsSerializer: (obj) => {
    //   return qs.stringify(obj);
    // },
  });
}

export function getRecord(id: number | string) {
  return axios.get<PolicyRecord>(`/groupPurchase/${id}`);
}

export function saveRecord(id: number, params: PolicyRecord | any) {
  return axios.put(`/groupPurchase/${id}`, params);
}

export function addRecord(params: any) {
  return axios.post('/groupPurchase', params);
}

export function deleteRecord(id: number) {
  return axios.delete(`/groupPurchase/${id}`);
}
