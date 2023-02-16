import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const COMPANY: AppRouteRecordRaw = {
  path: '/company',
  name: 'company',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.company',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 5,
  },
  children: [
    {
      path: '',
      name: 'companyList',
      component: () => import('@/views/company/index.vue'),
      meta: {
        locale: 'menu.company.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default COMPANY;
