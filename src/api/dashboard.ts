import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export interface DataPanelRecord {
  orderTotal: number;
  productTotal: number;
  orderAfterSaleTotal: number;
  paiedOrderTotal: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/dashboard/contentData');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/dashboard/popular', { params });
}

export function queryDataPanel() {
  return axios.get('/dashboard/dataPanel');
}
