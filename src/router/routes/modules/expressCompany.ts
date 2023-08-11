import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const EXPRESSCOMPANY: AppRouteRecordRaw = {
  path: '/expressCompany',
  name: 'expressCompany',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.expressCompany',
    requiresAuth: true,
    icon: 'icon-storage',
    order: 8,
  },
  children: [
    {
      path: '',
      name: 'expressCompanyList',
      component: () => import('@/views/expressCompany/index.vue'),
      meta: {
        locale: 'menu.expressCompany.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default EXPRESSCOMPANY;
