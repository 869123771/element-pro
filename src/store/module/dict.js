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
        positionRank : [],                                      //职位级别
        orgCategory : [],                                       //机构类别
        onlineGraphDisplayTemplate : [],                        //展示模板
        onlineGraphDataType : [],                               //数据类型
        onlineGraphType : [],                                   //图表类型
        signType : [],                                          //打卡类型
        signStatus: [],                                         //打卡状态
        taskStatus : [],                                        //任务状态
        templateType : [],                                      //模版类型,
        databaseType : [],                                      //数据库类型
        identity : [],                                          //身份
        formCategory : [],                                      //表单分类
        formTemplate : [],                                      //表单风格
        queryMode : [],                                        //查询模式
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
        SET_POSITION_RANK(state,positionRank){
            state.positionRank = positionRank
        },
        SET_ORG_CATEGORY(state,orgCategory){
            state.orgCategory = orgCategory
        },
        SET_ONLINE_GRAPH_DISPLAY_TEMPLATE(state,onlineGraphDisplayTemplate){
            state.onlineGraphDisplayTemplate = onlineGraphDisplayTemplate
        },
        SET_ONLINE_GRAPH_DATA_TYPE(state,onlineGraphDataType){
            state.onlineGraphDataType = onlineGraphDataType
        },
        SET_ONLINE_GRAPH_TYPE(state,onlineGraphType){
            state.onlineGraphType = onlineGraphType
        },
        SET_SIGN_TYPE(state,signType){
            state.signType = signType
        },
        SET_SIGN_STATUS(state,signStatus){
            state.signStatus = signStatus
        },
        SET_TASK_STATUS(state,taskStatus){
            state.taskStatus = taskStatus
        },
        SET_TEMPLATE_TYPE(state,templateType){
            state.templateType = templateType
        },
        SET_DATABASE_TYPE(state,databaseType){
            state.databaseType = databaseType
        },
        SET_IDENTITY(state,identity){
            state.identity = identity
        },
        SET_FORM_CATEGORY(state,formCategory){
            state.formCategory = formCategory
        },
        SET_FORM_TEMPLATE(state,formTemplate){
            state.formTemplate = formTemplate
        },
        SET_QUERY_MODE(state,queryMode){
            state.queryMode = queryMode
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
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'form_perms_type'})
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
        async GET_POSITION_RANK({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'position_rank'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_POSITION_RANK',records)
            }
        },
        async GET_ORG_CATEGORY({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'org_category'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_ORG_CATEGORY',records)
            }
        },
        async GET_ONLINE_GRAPH_DISPLAY_TEMPLATE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'online_graph_display_template'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_ONLINE_GRAPH_DISPLAY_TEMPLATE',records)
            }
        },
        async GET_ONLINE_GRAPH_DATA_TYPE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'online_graph_data_type'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_ONLINE_GRAPH_DATA_TYPE',records)
            }
        },
        async GET_ONLINE_GRAPH_TYPE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'online_graph_type'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_ONLINE_GRAPH_TYPE',records)
            }
        },
        async GET_SIGN_TYPE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'sign_type'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_SIGN_TYPE',records)
            }
        },
        async GET_SIGN_STATUS({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'sign_status'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_SIGN_STATUS',records)
            }
        },
        async GET_TASK_STATUS({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'task_status'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_TASK_STATUS',records)
            }
        },
        async GET_TEMPLATE_TYPE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'template_type'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_TEMPLATE_TYPE',records)
            }
        },
        async GET_DATABASE_TYPE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'database_type'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_DATABASE_TYPE',records)
            }
        },
        async GET_IDENTITY({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'identity'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_IDENTITY',records)
            }
        },
        async GET_FORM_CATEGORY({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'form_category'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_FORM_CATEGORY',records)
            }
        },
        async GET_FORM_TEMPLATE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'form_template'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_FORM_TEMPLATE',records)
            }
        },
        async GET_QUERY_MODE({commit}){
            let {success,result:{records:[{id:dictId}]}} = await http.get(apiList.sys_common_dict,{dictCode:'query_mode'})
            if(success) {
                let {result:{records}} = await http.get(apiList.sys_common_dict_item,{dictId})
                commit('SET_QUERY_MODE',records)
            }
        },
    }
}
