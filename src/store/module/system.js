import {http,apiList} from '@/utils'
export default {
    state: {
        roles : [],                                       //角色
        dept : [],                                       //部门
        menus : [],                                       //菜单
    },
    mutations: {
        SET_ALL_ROLES(state,roles){
            state.roles = roles
        },
        SET_ALL_DEPT(state,dept){
            state.dept = dept
        },
        SET_ALL_MENUS(state,menus){
            state.menus = menus
        },
    },
    actions: {
        async GET_ALL_ROLES({commit}){
            let {success,result} = await http.get(apiList.sys_role_query_all)
            if(success){
                commit('SET_ALL_ROLES',result)
            }
        },
        async GET_ALL_DEPT({commit}){
            let {success,result} = await http.get(apiList.sys_dept_query_all)
            if(success){
                commit('SET_ALL_DEPT',result)
            }
        },
        async GET_ALL_MENUS({commit}){
            let {success,result} = await http.get(apiList.sys_menu_query_list)
            if(success){
                commit('SET_ALL_MENUS',result)
                return {success,result}
            }
        }
    }
}