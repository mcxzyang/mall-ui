import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SETTING: AppRouteRecordRaw = {
  path: '/setting',
  name: 'Settings',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.setting',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 1,
  },
  children: [
    {
      path: '',
      name: 'Setting',
      component: () => import('@/views/setting/index.vue'),
      meta: {
        locale: 'menu.setting.list',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SETTING;
