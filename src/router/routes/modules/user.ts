import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/users',
  name: 'user',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.users',
    requiresAuth: true,
    icon: 'icon-user',
    order: 9,
  },
  children: [
    {
      path: '',
      name: 'UsersList',
      component: () => import('@/views/user/index.vue'),
      meta: {
        locale: 'menu.users.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default USER;
