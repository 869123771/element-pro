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
    component: resolve => {
      require(['@/views/login/Regist'], resolve)
    },
  },
]

export const layout = [{
  path: '/',
  name: 'layout',
  redirect: '/layout',
  component: Layout,
  meta: {

  },
  children: []
}]

export const routers = [
  ...index, ...layout
]