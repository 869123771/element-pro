<template>
    <div>
        <el-row>
            <fox-table
                    v-if="table.show"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="table.data"
            >
            </fox-table>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, sweetAlert, constant} from '@/utils'
    import foxTable from '@/components/fox-table/'

    export default {
        name: "PageProps",
        props: {
            data: {
                type: Array,
            },
        },
        components : {
            foxTable,
        },
        data() {
            return {
                table: {
                    data: this.data,
                    column : [],
                    show : true,
                    loading: false,
                },
            }
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
            }
        },
        methods: {
            setI18n(){
                this.table = {
                    ...this.table,
                    show : false,
                    column : [
                        {type : 'index'},
                        {
                            label: '字段名称',
                            prop: 'dbFieldName',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.dbFieldName}
                                        placeholder = '字段名称'
                                        clearable = {true}
                                        disabled = {true}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '字段备注',
                            prop: 'dbFieldTxt',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.dbFieldTxt}
                                        placeholder = '字段备注'
                                        clearable = {true}
                                        disabled = {true}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '表单显示',
                            prop: 'isShowForm',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-checkbox vModel = {scope.row.isShowForm} true-label = {1} false-lable = {0} disabled = {dbIsKey ? true : false}></el-checkbox>
                                )
                            }
                        },
                        {
                            label: '列表显示',
                            prop: 'isShowList',
                            width : 80,
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-checkbox vModel = {scope.row.isShowList} true-label = {1} false-lable = {0} disabled = {dbIsKey ? true : false}></el-checkbox>
                                )
                            }
                        },
                        {
                            label: '控件类型',
                            prop: 'fieldShowType',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                let options = [
                                    {itemText:'文本框',itemValue:'text'},
                                    {itemText:'密码',itemValue:'password'},
                                    {itemText:'单选框',itemValue:'radio'},
                                    {itemText:'多选',itemValue:'checkbox'},
                                    {itemText:'日期(yyyy-MM-dd)',itemValue:'date'},
                                    {itemText:'日期(yyyy-MM-dd HH:mm:ss)',itemValue:'datetime'},
                                    {itemText:'文件',itemValue:'file'},
                                    {itemText:'多行文本',itemValue:'textarea'},
                                    {itemText:'下拉框',itemValue:'list'},
                                    {itemText:'下拉多选框',itemValue:'"list_multi"'},
                                    {itemText:'下拉搜索框',itemValue:'sel_search'},
                                    {itemText:'popup弹出框',itemValue:'popup'},
                                    {itemText:'图片',itemValue:'image'},
                                    {itemText:'富文本编辑器',itemValue:'umeditor'},
                                ]
                                return (
                                    <el-select
                                        vModel = {scope.row.fieldShowType}
                                        placeholder = '控件类型'
                                        clearable = {true}
                                        filterable = {true}
                                        size = {'mini'}
                                        class = "w-full"
                                        disabled = {dbIsKey ? true : false}>
                                        {
                                            options.map(({itemValue,itemText})=>{
                                                return (
                                                    <el-option value = {itemValue} label = {itemText}></el-option>
                                                )
                                            })
                                        }
                                    </el-select>
                                )
                            }
                        },
                        {
                            label: '控件长度',
                            prop: 'fieldLength',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input-number
                                        vModel = {scope.row.fieldLength}
                                        placeholder = '控件长度'
                                        min = {0}
                                        controls = {false}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                        class = "w-full"
                                    ></el-input-number>
                                )
                            }
                        },
                        {
                            label: '是否查询',
                            prop: 'isQuery',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-checkbox vModel = {scope.row.isQuery} true-label = {1} false-lable = {0} disabled = {dbIsKey ? true : false}></el-checkbox>
                                )
                            }
                        },
                        {
                            label: '查询类型',
                            prop: 'queryMode',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                let options = [
                                    {itemText : '普通查询',itemValue:'single'},
                                    {itemText : '范围查询',itemValue:'group'},
                                ]
                                return (
                                    <el-select
                                        vModel = {scope.row.queryMode}
                                        placeholder = '查询类型'
                                        clearable = {true}
                                        filterable = {true}
                                        size = {'mini'}
                                        class = "w-full"
                                        disabled = {dbIsKey ? true : false}>
                                        {
                                            options.map(({itemValue,itemText})=>{
                                                return (
                                                    <el-option value = {itemValue} label = {itemText}></el-option>
                                                )
                                            })
                                        }
                                    </el-select>
                                )
                            }
                        },
                        {
                            label: '扩展参数',
                            prop: 'fieldExtendJson',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.fieldExtendJson}
                                        placeholder = '扩展参数'
                                        clearable = {true}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '填值规则',
                            prop: 'fieldValueRuleCode',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.fieldValueRuleCode}
                                        placeholder = '填值规则'
                                        clearable = {true}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                    ]
                }
                this.$nextTick(()=>{
                    this.table = {
                        ...this.table,
                        show : true
                    }
                })
            },
        },
        created(){
            this.setI18n()
        },
    }
</script>

<style scoped>

</style>