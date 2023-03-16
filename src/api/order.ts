import axios from 'axios';
import qs from 'query-string';

export interface AddressRecord {
  address: string;
  area: string;
  city: string;
  contact_name: string;
  contact_phone: string;
  province: string;
}

export interface OrderRecord {
  id: number;
  order_no: string;
  trade_order_no: string;
  imtrade_order_no?: string;
  total?: number | string;
  pay_at?: string;
  express_company_name?: string;
  express_no?: string;
  delivery_time?: string;
  receiving_time?: string;
  remark?: string;
  status?: number;
  status_text?: string;
  status_color?: string;
  created_at?: string;
  address?: AddressRecord;
  order_items?: any;
}

export interface PolicyParams extends Partial<OrderRecord> {
  page: number;
  pageSize: number;
}

export interface PaginationLaravel {
  current_page: number;
  total: number;
}

export interface PolicyListRes {
  data: OrderRecord[];
  current_page: number;
  total: number;
}

export function queryOrderList(params: PolicyParams) {
  return axios.get<PolicyListRes>('/order', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getRecord(id: number | string) {
  return axios.get<OrderRecord>(`/order/${id}`);
}

export function getStatusMapping() {
  return axios.get<any>(`/order/status/mapping`);
}
