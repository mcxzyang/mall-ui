import axios from 'axios';
import { PolicyRecord as ProductRecord } from './product';
import { PolicyRecord as CompanyRecord } from './company';

export interface PolicyRecord {
  id: number;
  product: ProductRecord;
  company: CompanyRecord;
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
  return axios.get<PolicyListRes>('/recommendProductCompany', {
    params,
    // paramsSerializer: (obj) => {
    //   return qs.stringify(obj);
    // },
  });
}

export function addRecord(params: any) {
  return axios.post('/recommendProductCompany', params);
}

export function deleteRecord(id: number) {
  return axios.delete(`/recommendProductCompany/${id}`);
}
