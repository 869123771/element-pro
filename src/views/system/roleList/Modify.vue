<template>
    <div class = "modify">
        <avue-form v-model="form.model" :option="form.option" ref="form">
        </avue-form>
    </div>
</template>

<script>
    import {http, apiList, constant,sweetAlert} from '@/utils'

    export default {
        name: "Modify",
        props : {
            data : {
                type : Object
            }
        },
        data(){
            let {id} = this.data
            const checkUnique = async (rule, value, callback)=>{
                let {flag,message} = await this.uniqueCheck(value)
                debugger;
                if(!flag){
                    callback(new Error(message));
                }else{
                    callback();
                }
            }
            const codeDisabled = id ? true : false
            return {
                form: {
                    option: {
                        menuBtn: false,
                        column: [
                            {
                                label : '角色名称',
                                prop: 'roleName',
                                span: 24,
                                rules : [
                                    {required : true,message:'必填',trigger:'change'}
                                ]
                            },
                            {
                                label : '角色编码',
                                prop: 'roleCode',
                                span: 24,
                                disabled : codeDisabled,
                                rules : [
                                    {required : true,message:'必填',trigger:'change',},
                                    {validator : checkUnique}
                                ]
                            },
                            {
                                label : '描述',
                                prop: 'description',
                                type : 'textarea',
                                span: 24
                            },
                        ]
                    },
                    model: {}
                }
            }
        },
        watch : {
            data : {
                handler(props) {
                    if (!this.validatenull(props)) {
                        let {model} = this.form
                        this.form = {
                            ...this.form,
                            model : {
                                ...model,
                                ...props
                            }
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