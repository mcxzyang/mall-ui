import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ORDER: AppRouteRecordRaw = {
  path: '/order',
  name: 'order',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.order',
    requiresAuth: true,
    icon: 'icon-trophy',
    order: 1,
  },
  children: [
    {
      path: '',
      name: 'OrderList',
      component: () => import('@/views/order/index.vue'),
      meta: {
        locale: 'menu.order.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'order-after-sale',
      name: 'OrderAfterSale',
      component: () => import('@/views/orderAfterSale/index.vue'),
      meta: {
        locale: 'menu.orderAfterSale.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: ':id',
      name: 'OrderDetail',
      component: () => import('@/views/order/detail.vue'),
      meta: {
        locale: 'menu.order.detail',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'order-after-sale/:id',
      name: 'OrderAfterSaleDetail',
      component: () => import('@/views/orderAfterSale/detail.vue'),
      meta: {
        locale: 'menu.orderAfterSale.detail',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default ORDER;
