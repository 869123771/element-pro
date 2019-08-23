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
        name: "ForeignKeys",
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
                    show : true,
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
                            label: '主表名',
                            prop: 'mainTable',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.mainTable}
                                        placeholder = '主表名'
                                        clearable = {true}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '主表字段',
                            prop: 'mainField',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.mainField}
                                        placeholder = '主表字段'
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