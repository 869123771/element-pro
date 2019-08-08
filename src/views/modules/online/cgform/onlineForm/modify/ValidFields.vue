<template>
    <div>
        <avue-crud
                ref="crud"
                :data="table.data"
                :option="table.option"
                :table-loading="table.loading"
        >
            <template slot="menuLeft">

            </template>
            <template slot="dbFieldName" slot-scope="{row}">
                <el-input v-model="row.dbFieldName" placeholder = "字段名称" size = "mini" disabled></el-input>
            </template>
            <template slot="dbFieldTxt" slot-scope="{row}">
                <el-input v-model="row.dbFieldTxt" placeholder = "字段备注" size = "mini" disabled></el-input>
            </template>
            <template slot="fieldMustInput" slot-scope="{row}">
                <el-checkbox v-model="row.fieldMustInput" :true-label="1" :false-label="0"></el-checkbox>
            </template>
        </avue-crud>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, sweetAlert, constant} from '@/utils'

    export default {
        name: "ValidFields",
        props: {
            data: {
                type: Array,
            },
        },
        data() {
            const {table} = constant
            return {
                table: {
                    data: [],
                    option: {
                        ...table,
                        page: false,
                        selection : false,
                        props: {
                            label: 'itemText',
                            value: 'itemValue'
                        },
                        column: [
                            {
                                label: '字段名称',
                                prop: 'dbFieldName',
                                cell: true,
                                slot : true
                            },
                            {
                                label: '字段备注',
                                prop: 'dbFieldTxt',
                                slot : true
                            },
                            {
                                label: '字段Href',
                                prop: 'fieldHref',
                                cell: true,
                                clearable : true,
                            },
                            {
                                label: '验证规则',
                                prop: 'fieldValidType',
                                cell: true,
                                type : 'select',
                                clearable : true,
                                dicData : [
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
                            },
                            {
                                label: '校验必填',
                                prop: 'fieldMustInput',
                                cell: true,
                                slot : true,
                            },
                            {
                                label: '字典Table',
                                prop: 'dictTable',
                                cell: true,
                                clearable : true,
                            },
                            {
                                label: '字典Code',
                                prop: 'dictField',
                                cell: true,
                                clearable : true,
                            },
                            {
                                label: '字典Text',
                                prop: 'dictText',
                                cell: true,
                                clearable : true,
                            },
                        ]
                    },
                    loading: false,
                    selection: []
                },
            }
        },
        methods: {
            setValidFieldsInfo() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                this.table = {
                    ...this.table,
                    data: this.data
                }
                this.$nextTick(() => {
                    this.data.forEach((item, index) => {
                        this.$refs.crud.rowCell(item, index)
                    })
                })
                this.table = {
                    ...this.table,
                    loading: false
                }
            }
        },
        mounted() {
            this.setValidFieldsInfo()
        }
    }
</script>

<style scoped>

</style>