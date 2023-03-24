import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'menu.product.list': '商品列表',
  'menu.product': '商品管理',
  'menu.product.list.create': '创建商品',
  'menu.productGroup': '商品分组管理',
  'menu.productGroup.list': '商品分组列表',
  'menu.category': '分类管理',
  'menu.category.list': '分类列表',
  'menu.company': '商城管理',
  'menu.company.list': '商城列表',
  'menu.order': '订单管理',
  'menu.order.list': '订单列表',
  'menu.order.detail': '订单详情',
  'menu.vendor': '供应商管理',
  'menu.vendor.list': '供应商列表',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
};
