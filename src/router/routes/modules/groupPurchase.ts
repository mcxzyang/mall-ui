import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PRODUCT: AppRouteRecordRaw = {
  path: '/groupPurchase',
  name: 'groupPurchase',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.groupPurchase',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 6,
  },
  children: [
    {
      path: '',
      name: 'GroupPurchase',
      component: () => import('@/views/groupPurchase/index.vue'),
      meta: {
        locale: 'menu.groupPurchase.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // {
    //   path: 'operation/:id?',
    //   name: 'GroupPurchaseOperation',
    //   component: () => import('@/views/product/operation.vue'),
    //   meta: {
    //     locale: 'menu.product.list.create',
    //     requiresAuth: true,
    //     roles: ['*'],
    //     hideInMenu: true,
    //   },
    // },
  ],
};

export default PRODUCT;
