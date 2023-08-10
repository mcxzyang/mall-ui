import axios from 'axios';
import { PolicyRecord as CompanyRecord } from './company';

export interface AddressRecord {
  address: string;
  area: string;
  city: string;
  contact_name: string;
  contact_phone: string;
  province: string;
}

export interface OrderUser {
  name?: string;
  nickname?: string;
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
  source_text?: string;
  source_color?: string;
  pay_type_text?: string;
  pay_type_color?: string;
  created_at?: string;
  address?: AddressRecord;
  order_items?: any;
  user: OrderUser;
  type?: number;
  company?: CompanyRecord;
}

export interface sourceType {
  id: number;
  name: string;
}

export interface statusRecord {
  id: number;
  name: string;
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
  });
}

export function getRecord(id: number | string) {
  return axios.get<OrderRecord>(`/order/${id}`);
}

export function deleteRecord(id: number | string) {
  return axios.delete(`/order/${id}`);
}

export function getStatusMapping() {
  return axios.get<statusRecord[]>(`/order/status/mapping`);
}

export function deliveryOrderItem(id: number | string, params: any) {
  return axios.post<any>(`/orderItem/${id}/delivery`, params);
}

export function getSourceTypeList() {
  return axios.get<sourceType[]>(`/order/sourceType/list`);
}

export function downloadExcel(params: PolicyParams) {
  return axios.get<any>('/order/list/export', {
    params,
    responseType: 'blob',
  });
}
