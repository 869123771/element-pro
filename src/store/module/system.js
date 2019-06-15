import {http,apiList} from '@/utils'
export default {
    state: {
        roles : [],                                      //角色
        depts : []                                       //部门
    },
    mutations: {
        SET_ALL_ROLES(state,roles){
            state.roles = roles
        },
        SET_ALL_DEPTS(state,depts){
            state.depts = depts
        },
    },
    actions: {
        async GET_ALL_ROLES({commit}){
            let {success,result} = await http.get(apiList.sys_role_query_all)
            if(success){
                commit('SET_ALL_ROLES',result)
            }
        },
        async GET_ALL_DEPTS({commit}){
            let {success,result} = await http.get(apiList.sys_dept_query_all)
            if(success){
                commit('SET_ALL_DEPTS',result)
            }
        }
    }
}