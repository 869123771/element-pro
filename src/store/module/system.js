import {http,apiList} from '@/utils'
export default {
    state: {
        roles : []                                      //系统角色
    },
    mutations: {
        SET_ALL_ROLES(state,roles){
            state.roles = roles
        },
    },
    actions: {
        async GET_ALL_ROLES({commit}){
            let {success,result} = await http.get(apiList.sys_role_query_all)
            if(success){
                commit('SET_ALL_ROLES',result)
            }
        }
    }
}