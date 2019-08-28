<template>
    <div class = "java">
        <el-form ref = "form" :model = "form" label-width="80px" :rules = "rules" status-icon>
            <el-form-item label = "页面按钮" prop = "buttonCode">
                <el-select v-model = "form.buttonCode" filterable clearable class = "w-full">
                    <template v-for = "item in select.buttonType">
                        <el-option :value = "item.itemValue" :label = "item.itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label = "内容">
                <el-input v-model = "form.cgJavaValue" placeholder = "内容" clearable></el-input>
            </el-form-item>
            <el-form-item label = "类型">
                <el-radio-group v-model = "form.cgJavaType">
                    <template v-for = "item in radio.javaType">
                        <el-radio :label = "item.itemValue">{{item.itemText}}</el-radio>
                    </template>
                </el-radio-group>
            </el-form-item>
            <el-form-item label = "事件状态">
                <el-radio-group v-model = "form.event">
                    <template v-for = "item in radio.eventState">
                        <el-radio :label = "item.itemValue">{{item.itemText}}</el-radio>
                    </template>
                </el-radio-group>
            </el-form-item>
            <el-form-item label = "是否生效">
                <el-radio-group v-model = "form.activeStatus">
                    <template v-for = "item in radio.activeStatus">
                        <el-radio :label = "item.itemValue">{{item.itemText}}</el-radio>
                    </template>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'

    export default {
        name: "JavaEnergize",
        props : {
            data : {
                type : Object
            }
        },
        data(){
            return {
                form : {
                    buttonCode : '',                        //页面按钮
                    cgJavaValue : '',                       //内容
                    event : 'end',                        //事件状态
                    cgJavaType : 'spring',                  //类型
                    activeStatus : '1'                      //是否生效
                },
                select : {
                    buttonType : [
                        {itemValue : 'add', itemText : '新增'},
                        {itemValue : 'edit', itemText : '编辑'},
                        {itemValue : 'delete', itemText : '删除'},
                    ]
                },
                radio : {
                    eventState : [
                        {itemValue : 'start', itemText : '开始'},
                        {itemValue : 'end', itemText : '结束'},
                    ],
                    javaType : [
                        {itemValue : 'spring', itemText : 'spring-key'},
                        {itemValue : 'class', itemText : 'java-class'},
                    ],
                    activeStatus : [
                        {itemValue : '1', itemText : '有效'},
                        {itemValue : '0', itemText : '无效'},
                    ]
                },
                rules : {
                    cgJsType : [
                        {required : true, message : '必填',trigger : 'change'}
                    ]
                },
            }
        },
        methods : {
            async saveData(){
                let {id} = this.data
                let params = {
                    ...this.form
                }
                let {success,message} = await http.post(`${apiList.online_form_head_java_enhance}/${id}`,params)
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