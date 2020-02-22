<template>
    <div class = "modify">
        <el-form ref = "form" :model = "form" label-width="90px" :rules = "rules">
            <el-form-item label = "模板CODE" prop = "templateCode">
                <el-input v-model = "form.templateCode" placeholder = "模板CODE" clearable></el-input>
            </el-form-item>
            <el-form-item label="模版类型" prop="templateType">
                <el-select v-model="form.templateType" clearable filterable class="w-full">
                    <template v-for="{itemValue,itemText} in templateType">
                        <el-option :value="itemValue" :label="itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label = "模板标题" prop = "templateName">
                <el-input v-model = "form.templateName" placeholder = "模板标题"></el-input>
            </el-form-item>
            <el-form-item label = "模板内容" prop = "templateContent">
                <el-input type = "textarea" v-model = "form.templateContent" placeholder = "模板内容" :rows = "10"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
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
            return {
                form : {
                    templateCode : '',
                    templateName : '',
                    templateType : '',
                    templateContent : '',
                },
                rules : {
                    templateCode : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                    templateType : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                    templateName : [
                        {required : true, message : '必填', trigger : 'change'}
                    ]
                }
            }
        },
        computed: {
            ...mapState({
                templateType : ({dict}) => dict.templateType
            })
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                            this.form = {
                                ...this.form,
                                ...props
                            }
                    } else {
                        this.resetForm()
                        this.$nextTick(() => {
                            this.$refs.form.resetFields()
                        })
                    }
                },
                immediate: true
            },
        },
        methods : {
            resetForm(){
                this.form = {
                    templateCode : '',
                    templateName : '',
                    templateType : '',
                    templateContent : '',
                }
            },
            saveData(){
                let {id} = this.data
                let params = {
                    ...this.form
                }
                if(id){
                    this.update(params)
                }else{
                    this.add(params)
                }
            },
            async add(params){
                let {success,message} = await http.post(apiList.message_center_template_add,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async update(params){
                let {success,message} = await http.put(apiList.message_center_template_edit,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            }
        }
    }
</script>

<style scoped>

</style>