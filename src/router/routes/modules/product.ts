import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PRODUCT: AppRouteRecordRaw = {
  path: '/product',
  name: 'product',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.product',
    requiresAuth: true,
    icon: 'icon-star',
    order: 1,
  },
  children: [
    {
      path: '',
      name: 'ProductList',
      component: () => import('@/views/product/index.vue'),
      meta: {
        locale: 'menu.product.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'operation/:id?',
      name: 'ProductOperation',
      component: () => import('@/views/product/operation.vue'),
      meta: {
        locale: 'menu.product.list.create',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default PRODUCT;
