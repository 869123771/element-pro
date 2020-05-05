<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-col :md="24">
                <template v-for = "{label,prop} in formList">
                    <el-form-item :label="label" :prop="prop">
                        <template v-if = "schemaType(prop) === 'popup'">
                            <el-input v-model="form[prop]" :placeholder="label"
                                      clearable suffix-icon="el-icon-more"
                                      @click.native = "showPopup"
                            ></el-input>
                        </template>
                        <template v-if = "schemaType(prop) === 'text'">
                            <el-input v-model="form[prop]" :placeholder="label" clearable></el-input>
                        </template>
                        <template v-if = "schemaType(prop) === 'list' || schemaType(prop) === 'sel_search'">
                            <el-select v-model="form[prop]" clearable filterable class="w-full" :placeholder="label">
                                <template v-for="{value,text} in data.dictOptions[[prop]]">
                                    <el-option :value="value" :label="text"></el-option>
                                </template>
                            </el-select>
                        </template>
                        <template v-if = "schemaType(prop) === 'date'">
                            <el-date-picker  v-model="form[prop]" :placeholder="label" value-format="yyyy-MM-dd" class = "w-full"></el-date-picker>
                        </template>
                    </el-form-item>
                </template>
            </el-col>
        </el-form>
        <drag-dialog :drag-dialog="dialog" @confirm="">
            <component :is="component.is" :data="component.data" :ref="component.ref"
                       @showPopup = "showPopup"
                       @modifySuccess=""></component>
        </drag-dialog>
    </div>
</template>

<script>
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import Popup from "./modify/Popup";

    export default {
        name: "Modify",
        props : {
            data : {
                type : Object
            }
        },
        components : {
            DragDialog
        },
        data(){
            return {
                form : {},
                dialog: {
                    width: 25,
                    height: 320,
                    name: 'add',
                    showFooter: true,
                },
                component: {
                    data: {},
                    ref: '',
                    is : Popup
                }
            }
        },
        watch : {
            data : {
                handler(props){
                    this.setForm()
                    if(props.row){
                       this.$nextTick(()=>{
                           this.form = {
                               ...this.form,
                               ...props.row
                           }
                       })
                    }
                },
                immediate : true
            }
        },
        computed : {
            formList(){
                let {column} = this.data
                let formList = column.filter(item=>item.prop !== 'oper')
                return formList
            },
        },
        methods : {
            async showPopup({form,page}={}){
                let params = {}
                if(form){
                    params = {
                        ...params,
                        ...form
                    }
                }
                if(page){
                    params = {
                        ...params,
                        ...page
                    }
                }
                let {success,result:{cgRpConfigId,cgRpConfigName,columns,dictOptions}} = await http.get(`${apiList.online_report_get_report_use}`)
                let {result:formList} = await http.get(apiList.online_report_api_get_query_info + cgRpConfigId)
                let {result:{total,records}} = await http.get(`${apiList.online_report_get_report_user_data + cgRpConfigId}`,params)
                if(success){
                    this.dialog = {
                        ...this.dialog,
                        title: cgRpConfigName,
                        width: 80,
                        height: 80,
                        name: 'popup',
                        showFooter: true,
                    }
                    this.component = {
                        ...this.component,
                        data: {
                            columns,
                            dictOptions,
                            total,
                            records,
                            formList
                        },
                        is: Popup
                    }
                    let {name} = this.dialog
                    this.$nextTick(() => {
                        this.$modal.show(name)
                    })
                }
            },
            schemaType(prop){
                return this.data.schema.properties[prop].view
            },
            setForm(){
                this.formList.map(item=>item.prop).forEach(item=>{
                    this.$set(this.form,item,'')
                })
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>