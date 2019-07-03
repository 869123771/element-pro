import {http,apiList} from '@/utils'
export default {
    state : {
        sex : [],                                           //性别
        userStatus : [],                                    //用户状态
        activitiSync : [],                                  //同步工作流引擎,
        permissionType : [],                                 //授权策略
        menuType : [],                                        //菜单类型
        validStatus : [],                                     //有效无效状态
    },
    mutations: {
        SET_SEX(state,sex){
            state.sex = sex
        },
        SET_USER_STATUS(state,userStatus){
           state.userStatus = userStatus
       },
        SET_ACTIVIYI_SYNC(state,activitiSync){
            state.activitiSync = activitiSync
        },
        SET_PERMISSION_TYPE(state,permissionType){
            state.permissionType = permissionType
        },
        SET_MENU_TYPE(state,menuType){
            state.menuType = menuType
        },
        SET_VALID_STATUS(state,validStatus){
            state.validStatus = validStatus
        },
    },
    actions : {
        async GET_SEX({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'sex'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_SEX',records)
            }
        },
        async GET_USER_STATUS({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'user_status'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_USER_STATUS',records)
            }
        },
        async GET_ACTIVIYI_SYNC({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'activiti_sync'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_ACTIVIYI_SYNC',records)
            }
        },
        async GET_PERMISSION_TYPE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'perms_type'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_PERMISSION_TYPE',records)
            }
        },
        async GET_MENU_TYPE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'menu_type'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_MENU_TYPE',records)
            }
        },
        async GET_VALID_STATUS({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'valid_status'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_VALID_STATUS',records)
            }
        },
    }
}
