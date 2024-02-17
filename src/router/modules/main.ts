import { RouteRecordRaw } from 'vue-router';

export const main: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '登录',
      icon: 'scan',
    },
  },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: () => import('@/views/home/index.vue'),
  //   meta: {
  //     title: '通知',
  //     icon: 'volume-o',
  //   },
  // },
  {
    path: '/user',
    name: 'category',
    component: () => import('@/views/category/index.vue'),
    meta: {
      title: '个人中心',
      icon: 'contact-o',
    },
  },
];
