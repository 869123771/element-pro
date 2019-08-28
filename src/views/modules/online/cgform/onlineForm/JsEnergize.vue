<template>
    <div>
        <el-form ref = "form" :model = "form" label-width="80px" :rules = "rules" status-icon>
            <el-form-item label = "增强类型" prop = "cgJsType">
                <el-select v-model = "form.cgJsType" filterable clearable class = "w-full">
                    <template v-for = "item in select.jsTypeList">
                        <el-option :value = "item.value" :label = "item.label"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label = "js代码">
                <monaco-editor :editor-props = "editor"
                        @onCodeChange = "onCodeChange"
                >

                </monaco-editor>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import MonacoEditor from '@/components/editor/MonacoEditor'
    import {http, apiList, constant, sweetAlert} from '@/utils'

    export default {
        name: "JsEnergize",
        components: {
            MonacoEditor
        },
        props : {
           data : {
               type : Object
           }
        },
        data(){
            return {
                form : {
                    cgJsType : '',
                    cgJs : ''
                },
                select : {
                    jsTypeList : [
                        {value : 'list', label : 'list'},
                        {value : 'form', label : 'form'},
                    ]
                },
                editor: {
                    code: '',
                    language: 'javascript',
                    theme : 'vs-dark'
                },
                rules : {
                    cgJsType : [
                        {required : true, message : '必填',trigger : 'change'}
                    ]
                },
            }
        },
        methods : {
            onCodeChange(code){
               this.form = {
                   ...this.form,
                   cgJs : code
               }
            },
            async saveData(){
                let {id} = this.data
                let params = {
                    ...this.form
                }
                let {success,message} = await http.post(`${apiList.online_form_head_js_enhance}/${id}`,params)
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