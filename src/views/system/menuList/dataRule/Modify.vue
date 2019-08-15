<template>
    <div class = "modify">
        <el-form ref = "form" :model = "form" :status-icon="true" label-width="80px" :rules = "rules">
            <el-form-item label = "规则名称" prop = "ruleName">
                <el-input v-model = "form.ruleName" placeholder = "规则名称" clearable ></el-input>
            </el-form-item>
            <el-form-item label = "规则字段" prop = "ruleColumn">
                <el-input v-model = "form.ruleColumn" placeholder = "规则字段" clearable ></el-input>
            </el-form-item>
            <el-form-item label = "条件规则" prop = "ruleConditions">
                <el-select v-model = "form.ruleConditions" placeholder = "条件规则" clearable filterable class = "w-full">
                    <template v-for = "item in ruleConditions">
                        <el-option :value = "item.itemValue" :label = "item.itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label = "规则值" prop = "ruleValue">
                <el-input v-model = "form.ruleValue" placeholder = "规则值" clearable ></el-input>
            </el-form-item>
            <el-form-item label = "状态" prop = "status">
                <el-radio-group v-model = "form.status">
                    <template v-for = "item in validStatus">
                        <el-radio-button :label = "item.itemValue">{{item.itemText}}</el-radio-button>
                    </template>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http,apiList,sweetAlert} from '@/utils'
    import {isEmpty} from '30-seconds-of-code'
    export default {
        name: "Modify",
        props : {
            data : {
                type : Object
            }
        },
        data(){
            return {
                form: {
                    status : 1
                },
                rules : {
                    ruleName : [
                        {required : true, message : '必填',trigger : 'change'}
                    ],
                    ruleConditions : [
                        {required : true, message : '必填',trigger : 'change'}
                    ]
                }
            }
        },
        computed : {
            ...mapState({
                ruleConditions : ({dict}) => dict.ruleConditions,
                validStatus : ({dict}) => dict.validStatus
            })
        },
        watch : {
            data : {
                handler(props) {
                    if (!isEmpty(props)) {
                        this.form = {
                            ...this.form,
                            ...props
                        }
                    }
                },
                immediate : true
            },
        },
        methods : {
            saveData(){
                let {id,permissionId} = this.data
                let params = {
                    ...this.form,
                    permissionId,
                }
                if(id){
                    this.updateRule(params)
                }else{
                    this.addRule(params)
                }
            },
            async addRule(params){
                let {success,message} = await http.post(apiList.sys_menu_add_add_permission_rule,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async updateRule(params){
                let {success,message} = await http.put(apiList.sys_menu_add_edit_permission_rule,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>