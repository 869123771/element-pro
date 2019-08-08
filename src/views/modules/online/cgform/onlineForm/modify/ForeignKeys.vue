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
        </avue-crud>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, sweetAlert, constant} from '@/utils'

    export default {
        name: "ForeignKeys",
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
                                slot : true
                            },
                            {
                                label: '字段备注',
                                prop: 'dbFieldTxt',
                                slot : true,
                            },
                            {
                                label: '主表名',
                                prop: 'mainTable',
                                cell: true,
                                clearable : true
                            },
                            {
                                label: '主表字段',
                                prop: 'mainField',
                                cell: true,
                                clearable : true
                            },
                        ]
                    },
                    loading: false,
                },
            }
        },
        methods: {
            setForeignKeys() {
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
            this.setForeignKeys()
        }
    }
</script>

<style scoped>

</style>