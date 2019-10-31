import {http,apiList} from '@/utils'
export default {
    state : {
        sex : [],                                           //性别
        userStatus : [],                                    //用户状态
        activitiSync : [],                                  //同步工作流引擎,
        permissionType : [],                                 //授权策略
        menuType : [],                                        //菜单类型
        validStatus : [],                                     //有效无效状态
        ruleConditions : [],                                    //条件规则
        dictItemStatus : [],                                    //字典状态
        msgCategory : [],                                       //消息类型
        priority : [],                                          //优先级
        sendStatus : [],                                        //发布状态
        msgType : [],                                           //推送类别
        formTableType : [],                                     //Online表单类型
    },
    mutations: {
        SET_SEX(state,sex){
            state.sex = sex
        },
        SET_USER_STATUS(state,userStatus){
           state.userStatus = userStatus
       },
        SET_ACTIVITY_SYNC(state,activitiSync){
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
        SET_RULE_CONDITIONS(state,ruleConditions){
            state.ruleConditions = ruleConditions
        },
        SET_DICT_ITEM_STATUS(state,dictItemStatus){
            state.dictItemStatus = dictItemStatus
        },
        SET_MSG_CATEGORY(state,msgCategory){
            state.msgCategory = msgCategory
        },
        SET_PRIORITY(state,priority){
            state.priority = priority
        },
        SET_SEND_STATUS(state,sendStatus){
            state.sendStatus = sendStatus
        },
        SET_MSG_TYPE(state,msgType){
            state.msgType = msgType
        },
        SET_FORM_TABLE_TYPE(state,formTableType){
            state.formTableType = formTableType
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
        async GET_ACTIVITY_SYNC({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'activiti_sync'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_ACTIVITY_SYNC',records)
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
        async GET_RULE_CONDITIONS({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'rule_conditions'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_RULE_CONDITIONS',records)
            }
        },
        async GET_DICT_ITEM_STATUS({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'dict_item_status'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_DICT_ITEM_STATUS',records)
            }
        },
        async GET_MSG_CATEGORY({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'msg_category'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_MSG_CATEGORY',records)
            }
        },
        async GET_PRIORITY({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'priority'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_PRIORITY',records)
            }
        },
        async GET_SEND_STATUS({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'send_status'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_SEND_STATUS',records)
            }
        },
        async GET_MSG_TYPE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'msg_type'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_MSG_TYPE',records)
            }
        },
        async GET_FORM_TABLE_TYPE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'cgform_table_type'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_FORM_TABLE_TYPE',records)
            }
        },
    }
}
