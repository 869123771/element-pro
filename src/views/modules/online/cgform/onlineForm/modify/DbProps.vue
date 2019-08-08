<template>
    <div>
        <avue-crud
                ref="crud"
                :data="table.data"
                :option="table.option"
                :table-loading="table.loading"
                @selection-change="selectionChange"
        >
            <template slot="menuLeft">
                <el-button plain type="primary" icon="el-icon-plus" @click="add">新增</el-button>
                <template v-if="show.batch">
                    <el-button plain icon="el-icon-minus" @click="del">删除</el-button>
                    <el-button plain @click="clear">
                        <span class="iconfont icon-wy-delete2"></span>
                        <span>清空选择</span>
                    </el-button>
                </template>
            </template>
            <template slot="dbIsNull" slot-scope="{row}">
                <el-checkbox v-model="row.dbIsNull" :true-label="1" :false-label="0"></el-checkbox>
            </template>
        </avue-crud>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, sweetAlert, constant} from '@/utils'

    export default {
        name: "DbProps",
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
                        selectable : (row,index)=>{
                            debugger;
                            console.log(row)
                        },
                        props: {
                            label: 'itemText',
                            value: 'itemValue'
                        },
                        column: [
                            {
                                label: '字段名称',
                                prop: 'dbFieldName',
                                cell: true,
                            },
                            {
                                label: '字段备注',
                                prop: 'dbFieldTxt',
                                cell: true,
                            },
                            {
                                label: '字段长度',
                                prop: 'dbLength',
                                cell: true,
                                type: 'number',
                            },
                            {
                                label: '小数点',
                                prop: 'dbPointLength',
                                cell: true,
                                type: 'number'
                            },
                            {
                                label: '默认值',
                                prop: 'dbDefaultVal',
                                cell: true,
                            },
                            {
                                label: '字段类型',
                                prop: 'dbType',
                                type: 'select',
                                cell: true,
                                dicData: [
                                    {itemText: 'String', itemValue: 'string'},
                                    {itemText: 'Integer', itemValue: 'Integer'},
                                    {itemText: 'Double', itemValue: 'double'},
                                    {itemText: 'Date', itemValue: 'Date'},
                                    {itemText: 'BigDecimal', itemValue: 'BigDecimal'},
                                    {itemText: 'Text', itemValue: 'Text'},
                                    {itemText: 'Blob', itemValue: 'Blob'},
                                ]
                            },
                            {
                                label: '主键',
                                prop: 'dbIsKey',
                                type: 'switch',
                                cell: true,
                                dicData: [
                                    {itemText: '', itemValue: 0},
                                    {itemText: '', itemValue: 1},
                                ]
                            },
                            {
                                label: '允许空值',
                                prop: 'dbIsNull',
                                slot: true,
                            },
                            {
                                label: '排序',
                                prop: 'orderNum',
                                cell: true,
                                type: 'number'
                            },
                        ]
                    },
                    loading: false,
                    selection: []
                },
                show: {
                    batch: false
                }
            }
        },
        methods: {
            add() {

            },
            del() {

            },
            clear() {

            },
            selectionChange(selection) {
                if (selection.length) {
                    this.show = {
                        ...this.show,
                        batch: true
                    }
                } else {
                    this.show = {
                        ...this.show,
                        batch: false
                    }
                }
                this.table = {
                    ...this.table,
                    selection
                }
            },
            setDbInfo() {
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
            this.setDbInfo()
        }
    }
</script>

<style scoped>

</style>