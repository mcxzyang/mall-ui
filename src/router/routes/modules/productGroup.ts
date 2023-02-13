import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PRODUCTGROUP: AppRouteRecordRaw = {
  path: '/productGroup',
  name: 'productGroup',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.productGroup',
    requiresAuth: true,
    icon: 'icon-star',
    order: 0,
  },
  children: [
    {
      path: '',
      name: 'ProductGroupList',
      component: () => import('@/views/productGroup/index.vue'),
      meta: {
        locale: 'menu.productGroup.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default PRODUCTGROUP;
