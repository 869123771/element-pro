import Vue from 'vue'
import router from './router'
import {store} from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import {setToken, getToken, localSave, localRead, generateIndexRouter} from '@/utils/modules/tools'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/user/login', '/user/register', '/user/register-result'] // no redirect whitelist

router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    store.commit('PAGE_LOADING',true)        //start page loading
    let {matched, path} = to
    if (getToken()) {
        /* has token */
        if (path === '/user/login') {
            next({path: '/dashboard/analysis'})
            NProgress.done()
        } else {
            if (store.getters.permissionList.length === 0) {
                 store.dispatch('GET_PERMISSION_LIST').then( result => {
                    let menuData = result.menu;
                    if (!menuData) {
                        return;
                    }
                    let constRoutes = [];
                    constRoutes = generateIndexRouter(menuData);
                    console.log('constRoutes',constRoutes)
                    // 添加主界面路由
                    store.dispatch('UpdateAppRouter', {constRoutes}).then(() => {
                        // 根据roles权限生成可访问的路由表
                        // 动态添加可访问路由表
                        router.addRoutes(store.getters.addRouters)
                        const redirect = decodeURIComponent(from.query.redirect || path)
                        if (path === redirect) {
                            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                            next({...to, replace: true})
                        } else {
                            // 跳转到目的路由
                            next({path: redirect})
                        }
                    })
                })
                    .catch(() => {
                        store.dispatch('LOGIN_OUT').then(() => {
                            next({path: '/user/login', query: {redirect: to.fullPath}})
                        })
                    })
            } else {
                if(path.includes(':')){
                    next({...from, replace: true})
                    NProgress.done()
                }else{
                    next()
                }
            }
        }
    } else {
        if (whiteList.includes(to.path)) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next({path: '/user/login', query: {redirect: to.fullPath}})
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
    store.commit('PAGE_LOADING',false)        //finish page loading
})
