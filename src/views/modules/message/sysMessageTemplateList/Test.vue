<template>
    <div>
        <el-form :model="form" label-width="90px">
            <el-form-item label = "模板标题">
                <el-input v-model = "form.templateTitle" placeholder = "模板标题" disabled></el-input>
            </el-form-item>
            <el-form-item label = "模板内容">
                <el-input type = "textarea" v-model = "form.templateContent" placeholder = "模板内容" :rows = "4" disabled></el-input>
            </el-form-item>
            <el-form-item label = "测试数据">
                <el-input type = "textarea" v-model = "form.testData" placeholder = "测试数据" :rows = "6"></el-input>
            </el-form-item>
            <el-form-item label="模版类型" prop="templateType">
                <el-select v-model="form.templateType" clearable filterable class="w-full">
                    <template v-for="{itemValue,itemText} in templateType">
                        <el-option :value="itemValue" :label="itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label = "消息接收方">
                <el-input v-model = "form.receiver" placeholder = "消息接收方" clearable></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http,apiList,sweetAlert} from "@/utils";
    export default {
        name: "Test",
        props : {
            data : {
                type : Object
            }
        },
        data(){
            return {
                form : {
                    templateTitle : '',
                    templateContent : '',
                    testData : '',
                    templateType : '',
                    receiver : '',
                }
            }
        },
        watch : {
            data : {
                handler(props){
                    if(props){
                        let {templateTestJson} = props
                        this.form = {
                            ...props,
                            testData : templateTestJson
                        }
                    }
                },
                immediate : true
            }
        },
        computed : {
            ...mapState({
                templateType : ({dict}) => dict.templateType
            })
        },
        methods : {
            async testData(){
                let {success,message} = await http.post(apiList.message_center_template_test,this.form)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.$emit('testResult',true)
                }else{
                    sweetAlert.error(message)
                    this.$emit('testResult',false)
                }
            }
        }
    }
</script>

<style scoped>

</style>