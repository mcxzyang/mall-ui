import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PRODUCT: AppRouteRecordRaw = {
  path: '/recommendProductCompany',
  name: 'recommendProductCompany',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.recommendProductCompany',
    requiresAuth: true,
    icon: 'icon-star',
    order: 7,
  },
  children: [
    {
      path: '',
      name: 'recommendProductCompanyList',
      component: () => import('@/views/recommendProductCompany/index.vue'),
      meta: {
        locale: 'menu.recommendProductCompany.list',
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
