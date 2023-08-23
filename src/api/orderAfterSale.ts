import axios from 'axios';
import { OrderRecord } from './order';

export interface AddressRecord {
  address: string;
  area: string;
  city: string;
  contact_name: string;
  contact_phone: string;
  province: string;
}

export interface OrderAfterSaleUser {
  name?: string;
  nickname?: string;
}

export interface OrderAfterSaleRecord {
  id: number;
  no: string;
  order?: OrderRecord;
  order_item?: any;
  type?: string;
  type_text?: string;
  price?: string;
  reason?: string;
  after_status?: number;
  after_status_text?: number;
  created_at?: string;
  updated_at?: string;
  order_items?: any;
  order_after_sale_items?: any;
  user: OrderAfterSaleUser;
}

export interface afterStatusRecord {
  id: number;
  name: string;
}

export interface PolicyParams extends Partial<OrderAfterSaleRecord> {
  page: number;
  pageSize: number;
}

export interface PaginationLaravel {
  current_page: number;
  total: number;
}

export interface PolicyListRes {
  data: OrderAfterSaleRecord[];
  current_page: number;
  total: number;
}

export function queryOrderAfterSaleList(params: PolicyParams) {
  return axios.get<PolicyListRes>('/orderAfterSale', {
    params,
  });
}

export function getRecord(id: number | string) {
  return axios.get<OrderAfterSaleRecord>(`/orderAfterSale/${id}`);
}

export function deleteRecord(id: number | string) {
  return axios.delete(`/orderAfterSale/${id}`);
}

export function getStatusMapping() {
  return axios.get<any>(`/orderAfterSale/status/mapping`);
}

export function auditRecord(id: number | string, params: any) {
  return axios.post(`/orderAfterSale/${id}/audit`, params);
}

export function downloadExcel(params: PolicyParams) {
  return axios.get<any>('/orderAfterSale/list/export', {
    params,
    responseType: 'blob',
  });
}

export function statusSuccess(id: any) {
  return axios.post(`/orderAfterSale/${id}/statusSuccess`);
}
