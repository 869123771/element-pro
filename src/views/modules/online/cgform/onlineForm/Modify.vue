<template>
    <div class = "modify">
        <div>
            <avue-form v-model="form.model" :option="form.option" ref="form"></avue-form>
        </div>
        <div>
            <el-tabs v-model="tabs.current" @tab-click="handleClick">
                <el-tab-pane label="数据库属性" name="dbProps">
                    <dbprops :data = "tabs.data"></dbprops>
                </el-tab-pane>
                <el-tab-pane label="页面属性" name="pageProps">

                </el-tab-pane>
                <el-tab-pane label="校验字段" name="validFields">

                </el-tab-pane>
                <el-tab-pane label="外键" name="foreignKeys">

                </el-tab-pane>
                <el-tab-pane label="索引" name="index">

                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http,apiList,sweetAlert} from '@/utils'
    import Dbprops from './modify/DbProps'

    export default {
        name: "Modify",
        props : {
            data : {
                type : Object
            }
        },
        components : {
            Dbprops
        },
        data(){
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth: 100,
                        props : {
                            label : 'itemText',
                            value : 'itemValue'
                        },
                        column: [
                            {
                                label: '表名',
                                prop: 'tableName',
                                span: 8,
                                rules : [
                                    {required : true, message : '必填',trigger : 'change'}
                                ]
                            },
                            {
                                label: '表描述',
                                prop: 'tableTxt',
                                span: 8,
                                maxlength:50,
                                showWordLimit:true,
                                rules : [
                                    {required : true, message : '必填',trigger : 'change'}
                                ]
                            },
                            {
                                label: '表类型',
                                prop: 'tableType',
                                type : 'select',
                                span: 8,
                            },
                            {
                                label: '表单分类',
                                prop: 'formCategory',
                                type : 'select',
                                span: 8,
                            },
                            {
                                label: '主键策略',
                                prop: 'idType',
                                type : 'select',
                                span: 8,
                                row : true
                            },
                            {
                                label: 'PC表单风格',
                                prop: 'formTemplate',
                                type : 'select',
                                span: 8,
                            },
                            {
                                label: '查询模式',
                                prop: 'queryMode',
                                type : 'select',
                                span: 8,
                                row : true
                            },
                            {
                                label: '显示复选框',
                                prop: 'isCheckbox',
                                type : 'select',
                                span: 8,
                                dicData : [
                                    {itemText : '否',itemValue : 'N'},
                                    {itemText : '是',itemValue : 'Y'},
                                ]
                            },
                            {
                                label: '是否分页',
                                prop: 'isPage',
                                type : 'select',
                                span: 8,
                                dicData : [
                                    {itemText : '否',itemValue : 'N'},
                                    {itemText : '是',itemValue : 'Y'},
                                ]
                            },
                            {
                                label: '是否树',
                                prop: 'isTree',
                                type : 'select',
                                span: 8,
                                dicData : [
                                    {itemText : '否',itemValue : 'N'},
                                    {itemText : '是',itemValue : 'Y'},
                                ]
                            },

                        ]
                    },
                    model: {
                        isCheckbox : 'N',
                        isPage : 'Y',
                        isTree : 'N',
                    }
                },
                tabs : {
                    current :'dbProps',
                    data : {}
                }
            }
        },
        computed : {
            ...mapState({
                formTableType: ({dict}) => dict.formTableType
            })
        },
        watch : {
            data : {
                handler(props) {
                    if (!this.validatenull(props)) {
                        let {model} = this.form
                        let  {tableType} = props
                        this.form = {
                            ...this.form,
                            model : {
                                ...model,
                                ...props,
                                tableType : tableType.toString()
                            }
                        }
                        this.tabs = {
                            ...this.tabs,
                            data : props
                        }
                    }
                },
                immediate : true
            },
        },
        methods : {
            updateTableType(){
                this.$refs.form.updateDic('tableType', this.formTableType)
            },
            handleClick(){

            },
        },
        mounted(){
            this.updateTableType()
        }
    }
</script>

<style scoped>

</style>