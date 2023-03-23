import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const VENDOR: AppRouteRecordRaw = {
  path: '/vendor',
  name: 'vendor',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.vendor',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 5,
  },
  children: [
    {
      path: '',
      name: 'vendorList',
      component: () => import('@/views/vendor/index.vue'),
      meta: {
        locale: 'menu.vendor.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default VENDOR;
