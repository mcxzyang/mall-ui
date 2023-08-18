import axios from 'axios';
import qs from 'query-string';
import { PolicyRecord as UserRecord } from './user';

export interface PolicyRecord {
  id: string | number;
  user: UserRecord;
  type_text: string;
  change_before: string;
  change_number: string;
  change_after: string;
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
  return axios.get<PolicyListRes | any>('/userPointLog', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
