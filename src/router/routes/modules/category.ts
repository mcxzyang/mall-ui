import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CATEGORY: AppRouteRecordRaw = {
  path: '/category',
  name: 'category',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.category',
    requiresAuth: true,
    icon: 'icon-star',
    order: 3,
  },
  children: [
    {
      path: '',
      name: 'categoryList',
      component: () => import('@/views/category/index.vue'),
      meta: {
        locale: 'menu.category.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default CATEGORY;
