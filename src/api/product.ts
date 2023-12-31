import axios from 'axios';
// import qs from 'query-string';
import { PropType } from 'vue';

export interface ProductSku {
  id: number;
  sku_number: string;
  sku_name: string;
  cost_price: number | string;
  sale_price: number | string;
  original_price: string | number;
  unit: string;
  stock: number | string;
}

export interface PolicyRecord {
  id: number;
  title: string;
  image: string;
  product_number: string;
  product_group_id?: number | string;
  category_id?: number | string;
  provider?: string;
  vendor_id?: string | number;
  is_free_post?: 1;
  status?: number;
  product_skus?: ProductSku[];
  created_at?: string;
  companies: PropType<number[]>;
  content: string;
  tags: PropType<number[]>;
}

export interface PolicyParams extends Partial<PolicyRecord> {
  page: number;
  pageSize: number;
  paging?: number;
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
  return axios.get<PolicyListRes | any>('/product', {
    params,
    // paramsSerializer: (obj) => {
    //   return qs.stringify(obj);
    // },
  });
}

export function queryPolicyListSearch(params: PolicyParams | any) {
  return axios.get<any>('/product/for/search', {
    params,
  });
}

export function getRecord(id: number | string) {
  return axios.get<PolicyRecord>(`/product/${id}`);
}

export function saveRecord(id: number, params: PolicyRecord) {
  return axios.put(`/product/${id}`, params);
}

export function addRecord(params: any) {
  return axios.post('/product', params);
}

export function deleteRecord(id: number) {
  return axios.delete(`/product/${id}`);
}

export function getSkuList(productId: number) {
  return axios.get<any>(`/product/${productId}/skuList`);
}

export function queryCompanyList(productId: number) {
  return axios.get<any>(`/product/${productId}/companyList`);
}

export function publishCompany(params: any) {
  return axios.post(`/product/publish/company`, params);
}
