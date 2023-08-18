import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USERPOINTLOG: AppRouteRecordRaw = {
  path: '/userPointLog',
  name: 'userPointLog',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.userPointLog',
    requiresAuth: true,
    icon: 'icon-book',
    order: 10,
  },
  children: [
    {
      path: '',
      name: 'userPointLogList',
      component: () => import('@/views/userPointLog/index.vue'),
      meta: {
        locale: 'menu.userPointLog.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default USERPOINTLOG;
