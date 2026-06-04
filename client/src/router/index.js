import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('./views/Search.vue')
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('./views/Detail.vue')
  },
  {
    path: '/category/:id?',
    name: 'Category',
    component: () => import('./views/Category.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue')
  },
  {
    path: '/my-collections',
    name: 'MyCollections',
    component: () => import('./views/MyCollections.vue')
  },
  {
    path: '/browse-history',
    name: 'BrowseHistory',
    component: () => import('./views/BrowseHistory.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/Settings.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('./views/admin/Admin.vue'),
    children: [
      { path: '', redirect: '/admin/banner' },
      { path: 'banner', name: 'AdminBanner', component: () => import('./views/admin/BannerManage.vue') },
      { path: 'category', name: 'AdminCategory', component: () => import('./views/admin/CategoryManage.vue') },
      { path: 'content', name: 'AdminContent', component: () => import('./views/admin/ContentManage.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
