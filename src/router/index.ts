import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/alert/:id',
      name: 'alert-detail',
      component: () => import('@/views/AlertDetail.vue'),
      props: true
    },
    {
      path: '/global-list',
      name: 'global-list',
      component: () => import('@/views/GlobalList.vue')
    }
  ]
})

export default router 