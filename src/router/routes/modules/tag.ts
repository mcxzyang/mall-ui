import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TAG: AppRouteRecordRaw = {
  path: '/tag',
  name: 'tag',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.tag',
    requiresAuth: true,
    icon: 'icon-tag',
    order: 11,
  },
  children: [
    {
      path: '',
      name: 'tagList',
      component: () => import('@/views/tag/index.vue'),
      meta: {
        locale: 'menu.tag.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default TAG;
