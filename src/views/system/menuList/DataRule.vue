<template>
    <div class="data-rule">
        <el-row>
            <el-form :model="form" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="规则名称" prop="ruleName">
                            <el-input v-model="form.ruleName" placeholder="规则名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规则值" prop="ruleValue">
                            <el-input v-model="form.ruleValue" placeholder="规则值" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="text-center">
                    <el-form-item label-width="0px">
                        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                        <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-row>
        <el-row class = "mb-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="addRule">新增</el-button>
        </el-row>
        <el-row>
            <fox-table
                    border
                    stripe
                    fit
                    align="center"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="table.data"
                    pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-count="10"
                    :current-page.sync="page.pageNum"
                    :total="page.total"
                    :page-size="page.pageSize"
                    @size-change="sizeChange"
                    @p-current-change="currentChange"
            ></fox-table>
        </el-row>

        <drag-dialog :drag-dialog="dialog" @confirm="confirmAdd">
            <modify :data="modify.data" ref="modify" @modifySuccess="modifySuccess"></modify>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'
    import Modify from './dataRule/Modify'

    export default {
        name: "DataRule",
        props: {
            data: {
                type: Object
            }
        },
        components: {
            DragDialog,
            Modify,
            foxTable
        },
        data() {
            return {
                form: {},
                table: {
                    data: [],
                    column: [
                        {
                            label: '操作',
                            prop: 'oper',
                            width: 80,
                            render: (h, {row, $index}) => {
                                let btnInfo = [
                                    {
                                        content: '修改',
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'menu:table:update',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        content: '删除',
                                        className: 'iconfont icon-wy-delete2',
                                        popover: true,
                                        popText: '确定要删除吗',
                                        event: () => {
                                            this.confirmDeleteBatch(row.id)
                                        }
                                    }
                                ]
                                return(
                                    <OperBtn btnInfo = {btnInfo}></OperBtn>
                                )
                            }
                        },
                        {
                            label: '规则名称',
                            prop: 'ruleName',
                            showOverflowTooltip: true,
                        },
                        {
                            label: '规则字段',
                            prop: 'ruleColumn',
                            showOverflowTooltip: true,
                        },
                        {
                            label: '规则值',
                            prop: 'ruleValue',
                            showOverflowTooltip: true,
                        },
                    ],
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                dialog: {
                    width: '24',
                    height: '52',
                    showFooter: true,
                },
                modify: {
                    data: {}
                },
            }
        },
        methods: {
            ...mapActions({
                getRuleConditions: 'GET_RULE_CONDITIONS'
            }),
            search() {
                this.page = {
                    ...this.page,
                    pageNum : 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetFields()
            },
            currentChange(pageNum) {
                this.page = {
                    ...this.page,
                    pageNum
                }
                this.queryList()
            },
            sizeChange(pageSize) {
                this.page = {
                    ...this.page,
                    pageSize
                }
                this.queryList()
            },
            closePopover(id) {
                this.$refs[id].doClose();
            },
            addRule() {
                let {id} = this.data
                this.dialog = {
                    ...this.dialog,
                    title: '新增',
                    name: 'addRule',
                }
                this.modify = {
                    ...this.modify,
                    data: {
                        permissionId: id
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            edit(row) {
                let {id} = this.data
                this.dialog = {
                    ...this.dialog,
                    title: '修改',
                    name: 'updateRule',
                }
                this.modify = {
                    ...this.modify,
                    data: {
                        permissionId: id,
                        ...row
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            confirmAdd() {
                let modifyRef = this.$refs.modify
                modifyRef.$refs.form.validate(valid => {
                    if (valid) {
                        this.dialog = {
                            ...this.dialog,
                            loading: true
                        }
                        modifyRef.saveData()
                    }
                    this.dialog = {
                        ...this.dialog,
                        loading: false
                    }
                })
            },
            modifySuccess() {
                let {name} = this.dialog
                this.$modal.hide(name)
                this.queryList()
            },
            async confirmDeleteBatch(id) {
                let {success, message} = await http.delete(apiList.sys_menu_add_delete_permission_rule, {id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryList() {
                let {pageNum: pageNo, pageSize} = this.page
                let {id} = this.data
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...this.form,
                    permissionId: id
                }
                let {success, result} = await http.get(apiList.sys_menu_query_data_rule, params)
                if (success) {
                    this.table = {
                        ...this.table,
                        data: result
                    }
                    this.page = {
                        ...this.page,
                        total: result.length
                    }
                    this.table = {
                        ...this.table,
                        loading: false
                    }
                }
            },
        },
        mounted() {
            this.getRuleConditions()
            this.queryList()
        }
    }
</script>

<style scoped>

</style>