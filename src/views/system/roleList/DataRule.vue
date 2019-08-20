<template>
   <div class = "dataRule px-2">
       <el-tabs v-model = "tabs.active">
           <el-tab-pane :label = "tabs.label" :name = "tabs.name"></el-tab-pane>
       </el-tabs>
       <el-row>
           <el-checkbox-group v-model = "dataRule.dataRuleIds">
               <template v-for = "{id,ruleName} in dataRule.list">
                   <el-row class = "my-2">
                       <el-checkbox :label = "id">{{ruleName}}</el-checkbox>
                   </el-row>
               </template>
           </el-checkbox-group>
       </el-row>
       <el-row class = "my-2">
           <el-button size = "small" type = "primary" icon = "el-icon-check" @click = "save">点击保存</el-button>
       </el-row>
   </div>
</template>

<script>
    import {http,apiList,sweetAlert} from '@/utils'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "DataRule",
        props : {
            dataRuleProps : {
                type : Object
            }
        },
        data(){
            return {
                tabs : {
                    active : '',
                    label : '数据规则',
                    name : 'dataRule',
                },
                dataRule : {
                    dataRuleIds : [],
                    list : []
                }
            }
        },
        watch : {
            dataRuleProps : {
                handler(props){
                   if(!isEmpty(props)){
                       let {dataRuleId,roleId} = props
                       this.loadDataRule(dataRuleId,roleId)
                   }
                },
                immediate : true
            }
        },
        methods : {
            async save(){
                let {dataRuleIds} = this.dataRule
                let {dataRuleId,roleId} = this.dataRuleProps
                let params = {
                    roleId,
                    permissionId : dataRuleId,
                    dataRuleIds : dataRuleIds.join(',')
                }
                if(!dataRuleIds.length){
                    sweetAlert.warn('至少勾选一条')
                    return
                }
               let {success,message} = await http.post(apiList.sys_role_data_rule,params)
               if(success){
                   sweetAlert.successWithTimer(message)
                   this.$emit('closeDataRuleDialog')
               }else{
                   sweetAlert.error(message)
               }
            },
            async loadDataRule(dataRuleId,roleId){
                let {success,result} = await http.get(`${apiList.sys_role_data_rule}/${dataRuleId}/${roleId}`)
                if(success){
                    let {datarule:list} = result
                    this.dataRule = {
                        ...this.dataRule,
                        list
                    }
                }else{
                    this.dataRule = {
                        ...this.dataRule,
                        list : []
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>