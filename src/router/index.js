import Vue from 'vue'
import Router from 'vue-router'
import {constantRouterMap} from './router'

Vue.use(Router)

export default new Router({
    //mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})
