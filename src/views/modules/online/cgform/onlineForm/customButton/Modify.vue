<template>
    <div class = "modify">
        <el-row>
            <el-form ref = "form" :model = "form" label-width="80px" status-icon :rules = "rules">
               <el-col :span = "24">
                   <el-form-item label = "按钮编码" prop = "buttonCode">
                        <el-input v-model = "form.buttonCode" placeholder = "按钮编码" clearable></el-input>
                   </el-form-item>
               </el-col>
                <el-col :span = "24">
                    <el-form-item label = "按钮名称" prop = "buttonName">
                        <el-input v-model = "form.buttonName" placeholder = "按钮名称" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span = "24">
                    <el-form-item label = "按钮样式" prop = "buttonName">
                        <el-select v-model = "form.buttonStyle" placeholder = "按钮样式" clearable filterable class = "w-full">
                            <el-option value = "link" label = "link"></el-option>
                            <el-option value = "button" label = "button"></el-option>
                            <el-option value = "form" label = "form"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span = "24">
                    <el-form-item label = "按钮类型" prop = "buttonName">
                        <el-select v-model = "form.optType" placeholder = "按钮类型" clearable filterable class = "w-full">
                            <el-option value = "js" label = "js"></el-option>
                            <el-option value = "action" label = "action"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span = "24">
                    <el-form-item label = "排序" prop = "orderNum">
                        <el-input-number :min = "0" v-model = "form.orderNum" placeholder = "排序" class = "w-full"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span = "24">
                    <el-form-item label = "按钮图标" prop = "buttonIcon">
                        <el-input v-model = "form.buttonIcon" placeholder = "按钮图标" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span = "24">
                    <el-form-item label = "表达式" prop = "exp">
                        <el-input v-model = "form.exp" placeholder = "表达式" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span = "24">
                    <el-form-item label = "按钮状态" prop = "buttonStatus">
                        <el-select v-model = "form.buttonStatus" placeholder = "按钮状态" clearable filterable class = "w-full">
                            <el-option value = "0" label = "未激活"></el-option>
                            <el-option value = "1" label = "激活"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'

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
                    buttonCode : '',                //按钮编码
                    buttonName : '',                //按钮名称
                    buttonStyle : 'link',           //按钮样式
                    optType : 'js',                 //按钮类型
                    orderNum : '',                  //排序
                    buttonIcon : 'icon-edit',       //按钮图标
                    exp : '',                       //表达式
                    buttonStatus : '0',              //按钮状态
                },
                rules : {

                },
            }
        },
        watch : {
            data : {
                handler(props){
                    let {id} = props
                    if(id){
                        this.form = {
                            ...this.form,
                            ...props
                        }
                    }
                },
            },
        },
        methods : {
            saveData(){
                let {id,} = this.data
                let params = {
                    ...this.data,
                    ...this.form,
                }
                if(id){
                    this.update(params)
                }else{
                    this.add(params)
                }
            },
            async add(params){
                let {success,message} = await http.post(apiList.online_form_button_custom_add,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('closeFlush')
                } else {
                    sweetAlert.error(message)
                }
            },
            async update(params){
                let {success,message} = await http.put(apiList.online_form_button_custom_edit,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('closeFlush')
                } else {
                    sweetAlert.error(message)
                }
            },
        },
    }
</script>

<style scoped>

</style>