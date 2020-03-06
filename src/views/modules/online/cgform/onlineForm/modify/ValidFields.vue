<template>
    <div>
        <el-row>
            <fox-table
                    v-if="table.show"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="data"
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
        name: "ValidFields",
        props: {
            data: {
                type: Array,
            },
        },
        components : {
            foxTable
        },
        data() {
            return {
                table: {
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
                            label: '字段Href',
                            prop: 'fieldHref',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.fieldHref}
                                        placeholder = '字段Href'
                                        clearable = {true}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '验证规则',
                            prop: 'fieldValidType',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                let options = [
                                    {itemText: '唯一校验', itemValue: 'only'},
                                    {itemText: '6到16位数字', itemValue: 'n6-16'},
                                    {itemText: '6到16位任意字符', itemValue: '*6-16'},
                                    {itemText: '网址', itemValue: 'url'},
                                    {itemText: '电子邮件', itemValue: 'e'},
                                    {itemText: '手机号码', itemValue: 'm'},
                                    {itemText: '邮政编码', itemValue: 'p'},
                                    {itemText: '字母', itemValue: 's'},
                                    {itemText: '数字', itemValue: 'n'},
                                    {itemText: '整数', itemValue: 'z'},
                                    {itemText: '非空', itemValue: '*'},
                                    {itemText: '6到18位字符', itemValue: 's6-18'},
                                ]
                                return (
                                    <el-select
                                        vModel = {scope.row.fieldValidType}
                                        placeholder = '验证规则'
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
                            label: '校验必填',
                            prop: 'fieldMustInput',
                            width : 80,
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-checkbox vModel = {scope.row.fieldMustInput} true-label = {1} false-lable = {0} disabled = {dbIsKey ? true : false}></el-checkbox>
                                )
                            }
                        },
                        {
                            label: '字典Table',
                            prop: 'dictTable',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.dictTable}
                                        placeholder = '字典Table'
                                        clearable = {true}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '字典Code',
                            prop: 'dictField',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.dictField}
                                        placeholder = '字典Code'
                                        clearable = {true}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '字典Text',
                            prop: 'dictText',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.dictText}
                                        placeholder = '字典Text'
                                        clearable = {true}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                    ]
                }
                this.table = {
                    ...this.table,
                    show : true
                }
            }
        },
        created(){
           this.setI18n()
        },
    }
</script>

<style scoped>

</style>