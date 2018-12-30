import Vue from 'vue'
import Router from 'vue-router'
import {routers} from './router'
import {LoadingBar, Message, Spin} from 'iview'
import {store} from '@/store'

console.log(store)

Vue.use(Router)

const router = new Router({
    //mode: 'history',
    routes: routers
})


router.beforeEach((to, from, next) => {
    debugger;
    let {path,matched,meta:{title}} = to
    store.commit('activeMenu', {path})
    store.commit('activeBreadcrumb', {matched})
    store.commit('activeNavTag',{path,title})
    Spin.show()
    next();
});

router.afterEach((to, from, next) => {
    Spin.hide()
});

export default router
