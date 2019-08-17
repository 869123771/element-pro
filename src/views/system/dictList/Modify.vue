<template>
    <div class = "modify">
        <el-form ref = "form" :model = "form" :status-icon="true" label-width="80px" :rules = "rules">
            <el-form-item :label = "$t('sys_dict_name')" prop = "dictName">
                <el-input v-model = "form.dictName" :placeholder = "$t('sys_dict_name')" clearable ></el-input>
            </el-form-item>
            <el-form-item :label = "$t('sys_dict_code')" prop = "dictCode">
                <el-input v-model = "form.dictCode" :placeholder = "$t('sys_dict_code')" clearable ></el-input>
            </el-form-item>
            <el-form-item :label = "$t('sys_dict_description')" prop = "description">
                <el-input
                        type = "textarea"
                        v-model = "form.description"
                        :placeholder = "$t('sys_dict_description')"
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
                form: {},
                rules : {
                    dictName : [
                        {required : true,message:'必填',trigger:'change'}
                    ],
                    dictCode : [
                        {required : true,message:'必填',trigger:'change',},
                        {validator : checkUnique}
                    ]
                }
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
                    tableName : 'sys_dict',
                    fieldName: 'dict_code',
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
                let params = {
                    ...this.form
                }
                if(id){
                    this.updateDict(params)
                }else{
                    this.addDict(params)
                }
            },
            async addDict(params){
                let {success,message} = await http.post(apiList.sys_dict_add,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async updateDict(params){
                let {success,message} = await http.put(apiList.sys_dict_edit,params)
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