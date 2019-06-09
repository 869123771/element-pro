import {http,apiList} from '@/utils'
export default {
    state : {
        sex : [],                               //性别
        userStatus : []                         //用户状态
    },
    mutations: {
        SET_SEX(state,sex){
            state.sex = sex
        },
        SET_USER_STATUS(state,userStatus){
           state.userStatus = userStatus
       },
    },
    actions : {
        async GET_SEX({commit}){
            let {success,result} = await http.get(apiList.sys_dict,{dictId:'3d9a351be3436fbefb1307d4cfb49bf2'})
            if(success){
                commit('SET_SEX',result.records)
            }
        },
        async GET_USER_STATUS({commit}){
            let {success,result} = await http.get(apiList.sys_dict,{dictId:'fc6cd58fde2e8481db10d3a1e68ce70c'})
            if(success){
                commit('SET_USER_STATUS',result.records)
            }
        }
    }
}
