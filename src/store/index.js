import Vue from 'vue'
import Vuex from 'vuex'

//import user from './module/user'
import app from './module/app'
import user from './module/user'
import permission from './module/permission'
import dict from './module/dict'
import system from './module/system'
import getters from './getters'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    getters,
    modules: {
        user,
        app,
        permission,
        dict,
        system
    }
})
