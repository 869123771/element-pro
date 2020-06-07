<template>
    <div class="role bg-white p-3 m-3">
        <el-row>
            <el-button plain type="primary" icon="el-icon-plus" @click="add" v-has="'role:add'">
                {{$t('common_add')}}
            </el-button>
        </el-row>
        <el-row>
            <collapse :collapse-props="collapse">
                <div slot="collapse-title">
                    <span>角色信息</span>
                </div>
                <div slot="collapse-content">
                    <fox-table
                            v-if="table.show"
                            highlight-current-row
                            v-loading="table.loading"
                            :column="table.column"
                            :data="table.data"
                            @selection-change="selection"
                            >
                    </fox-table>
                </div>
            </collapse>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import Collapse from '@/components/collapse/Collapse'
    import foxTable from '@/components/fox-table'
    import OperBtn from '@/components/table/OperBtn'
    export default {
        name: "DataSource",
        components : {
            DragDialog,
            Collapse,
            foxTable
        },
        data(){
            return {
                collapse: {
                    name: 'dataSource'
                },
                show: {
                    batch: false
                },
                table: {
                    show: true,
                    data: [],
                    column: [],
                    loading: false,
                    selection: []
                },
            }
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods : {
            add(){

            },
            selection(selection) {
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
            async queryList() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {success, result} = await http.ajax('get',apiList.data_source_query_list)
                if (success) {
                   debugger;
                    this.table = {
                        ...this.table,
                        data: records
                    }
                    this.table = {
                        ...this.table,
                        loading: false
                    }
                }
            },
            setI18n() {
                this.table = {
                    ...this.table,
                    show: false,
                    column: [
                        {
                            type: 'selection',
                            fixed: true
                        },
                        {
                            label: '操作',
                            prop: 'oper',
                            width: 80,
                            render: (h, {row}) => {
                                let btnInfo = [
                                    {
                                        content: this.$t('common_edit'),
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'role:edit',
                                        popover: false,
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        type: 'dropDown',
                                        className: 'fa fa-fw fa-ellipsis-h',
                                        dropDownItems: [
                                            {
                                                content: '授权',
                                                className: '',
                                                permission: 'role:grant',
                                                popover: false,
                                                event: () => {
                                                    this.handleAuth(row)
                                                }
                                            },
                                            {
                                                content: '删除',
                                                className: '',
                                                popover: true,
                                                popText: '确定要删除吗',
                                                permission: 'role:delete',
                                                event: () => {
                                                    this.handleDel(row)
                                                }
                                            }
                                        ],
                                    },
                                ]
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>
                                )
                            }
                        },
                        {
                            label: '角色名称',
                            prop: 'roleName'
                        },
                        {
                            label: '角色编码',
                            prop: 'roleCode'
                        },
                        {
                            label: '备注',
                            prop: 'description'
                        },
                        {
                            label: '创建人',
                            prop: 'createBy'
                        },
                        {
                            label: '创建时间',
                            prop: 'createTime',
                            sortable: true,
                        },
                        {
                            label: '更新时间',
                            prop: 'updateTime',
                            sortable: true,
                        },
                    ],
                }
                this.$nextTick(() => {
                    this.table = {
                        ...this.table,
                        show: true
                    }
                })
            }
        },
        created() {
            this.setI18n()
        },
        mounted() {
            this.queryList()
        }
    }
</script>

<style scoped>

</style>
