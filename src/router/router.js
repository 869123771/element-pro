import Layout from '@/views/Layout.vue'
export const index = [{
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录'
    },
    component: resolve => {
      require(['@/views/login/Login'], resolve);
    },
  },
  {
    path: '/regist',
    name: 'regist',
    meta : {
      title: '注冊'
    },
    component: resolve => {
      require(['@/views/login/Regist'], resolve)
    },
  },
]

export const layout = [{
  path: '/',
  redirect: '/home',
  component: Layout,
  meta: {
    
  },
  children: [
    {
      path: '/home',
      name: 'home',
      meta: {
        title : '首頁'
      },
      component: ()=>import('@/views/Home'),
    },
    {
      path: '/api_design',
      name: 'apiDesign',
      meta: {
        title : 'API設計'
      },
      component: ()=>import('@/views/apiDesign/ApiDesign'),
    }
  ]
}]

export const routers = [
  ...index, ...layout
]