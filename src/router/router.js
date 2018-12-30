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
        meta: {
            title: '注冊'
        },
        component: resolve => {
            require(['@/views/login/Regist'], resolve)
        },
    },
]

export const layout = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    title: '首頁',
                    icon: 'icon-home',
                },
                component: () => import('@/views/Home'),
            },
        ]
    },
    {
        path : '',
        component: Layout,
        children : [
            {
                path: '/api_design',
                name: 'apiDesign',
                meta: {
                    title: 'API設計',
                    icon: 'icon-api-design',
                },
                component: () => import('@/views/apiDesign/ApiDesign'),
            },
        ]
    },
    {
        path: 'api_analyze',
        name: 'apiAnalyze',
        component: Layout,
        meta: {
            title: 'API分析',
            icon: 'icon-api-analyze',
            link : false,
        },
        children : [
            {
                path: '/log_search',
                name: 'logSearch',
                meta: {
                    title: '日志检索',
                    icon: 'icon-log-search',
                },
                component: () => import('@/views/apiAnalyze/LogSearch'),
            }
        ]
    },
]

export const routers = [
    ...index, ...layout
]
