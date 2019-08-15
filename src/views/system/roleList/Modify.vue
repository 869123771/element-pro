<template>
    <div class = "modify">
        <el-form ref = "form" :model = "form" label-width="80px" :rules = "rules">
            <el-form-item label = "角色名称" prop = "roleName">
                <el-input v-model = "form.roleName" placeholder = "角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item label = "角色编码" prop = "roleCode">
                <el-input v-model = "form.roleCode" placeholder = "角色编码" clearable :disabled="data.id"></el-input>
            </el-form-item>
            <el-form-item label = "描述" prop = "description">
                <el-input
                        type = "textarea"
                        v-model = "form.description"
                        placeholder = "描述"
                        clearable
                        maxlength = "100"
                        showWordLimit
                ></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {http, apiList, constant,sweetAlert} from '@/utils'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "Modify",
        props : {
            data : {
                type : Object
            }
        },
        data(){
            const checkUnique = async (rule, value, callback)=>{
                let {flag,message} = await this.uniqueCheck(value)
                if(!flag){
                    callback(new Error(message));
                }else{
                    callback();
                }
            }

            return {
                form: {
                    roleNam : '',
                    roleCode : '',
                    description : '',
                },
                rules : {
                    ruleName : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                    roleCode : [
                        {required : true, message : '必填', trigger : 'change'},
                        {validator : checkUnique}
                    ]
                },
            }
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
            async uniqueCheck(fieldVal){
                let validReturn = {}
                let {id:dataId} = this.data
                let params = {
                    tableName : 'sys_role',
                    fieldName: 'role_code',
                    fieldVal,
                    dataId
                }
                let {success,message} = await http.get(apiList.sys_dict_unique_check,params)
                if(success){
                    validReturn = {
                        flag : true
                    }
                }else{
                    validReturn = {
                        flag : false,
                        message
                    }
                }
                return validReturn
            },
            saveData(){
                let {id} = this.data
                let {model} = this.form
                let params = {
                    ...model
                }
                if(id){
                    this.updateRole(params)
                }else{
                    this.addRole(params)
                }
            },
            async addRole(params){
                let {success,message} = await http.post(apiList.sys_role_add,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async updateRole(params){
                let {success,message} = await http.put(apiList.sys_role_update,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            }
        },
    }
</script>

<style scoped>

</style>