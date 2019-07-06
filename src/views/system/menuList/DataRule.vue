<template>
    <div class="data-rule">
        <avue-form v-model="form.model" :option="form.option" ref="form">
            <template slot-scope="scope" slot="operBtn">
                <div class="text-center">
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                </div>
            </template>
        </avue-form>
        <avue-crud
                :data="table.data"
                :option="table.option"
                :page="page"
                :table-loading="table.loading"
                v-model="table.model"
                @on-load="queryList"
                @current-change="currentChange"
        >
            <template slot="menuLeft">
                <el-button plain type="primary" icon="el-icon-plus" @click="addRule">新增</el-button>
            </template>
            <template slot="oper" slot-scope="{row}">
                    <span>
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-pencil" @click="edit(row)"></i>
                        </span>
                        <span class="text-blue-500 text-base cursor-pointer px-1">
                             <el-popover placement="top"
                                         width="160"
                                         :ref="row.id"
                             >
                                 <p class="pb-3">确定要删除吗</p>
                                 <div class="text-right">
                                    <el-button size="mini" type="text" @click="closePopover(row.id)">取消
                                    </el-button>
                                    <el-button type="primary" size="mini"
                                               @click="confirmDeleteBatch(row.id)">确定
                                    </el-button>
                                </div>
                                 <i slot="reference" class="iconfont icon-wy-delete2"></i>
                             </el-popover>
                        </span>
                    </span>
            </template>
        </avue-crud>
        <drag-dialog :drag-dialog="dialog" @confirm="confirmAdd">
            <modify :data="modify.data" ref="modify" @modifySuccess="modifySuccess"></modify>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import Modify from './dataRule/Modify'

    export default {
        name: "DataRule",
        props : {
            data : {
                type : Object
            }
        },
        components : {
            DragDialog,
            Modify
        },
        data() {
            let {table} = constant
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth: 70,
                        column: [
                            {
                                label: '规则名称',
                                prop: 'ruleName',
                                span: 12
                            },
                            {
                                label: '规则值',
                                prop: 'ruleValue',
                                span: 12
                            },
                            {
                                prop: 'operBtn',
                                formslot: true,
                                span: 24
                            }
                        ]
                    },
                    model: {}
                },
                table: {
                    data: [],
                    option: {
                        ...table,
                        index: false,
                        selection: false,
                        column: [
                            {
                                label: '操作',
                                prop: 'oper',
                                slot: true,
                                width: 80
                            },
                            {
                                label: '规则名称',
                                prop: 'ruleName',
                                overHidden: true
                            },
                            {
                                label: '规则字段',
                                prop: 'ruleColumn',
                                overHidden: true
                            },
                            {
                                label: '规则值',
                                prop: 'ruleValue',
                                overHidden: true
                            },
                        ]
                    },
                    model: {},
                    loading: false,
                },
                page: {
                    currentPage: 1,
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
                getRuleConditions : 'GET_RULE_CONDITIONS'
            }),
            search() {
                this.page = {
                    ...this.page,
                    currentPage: 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetForm()
            },
            currentChange(currentPage) {
                this.page = {
                    ...this.page,
                    currentPage
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
            closePopover(id){
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
            confirmAdd(){
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
            modifySuccess(){
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
                let {currentPage: pageNo, pageSize} = this.page
                let {model} = this.form
                let {id} = this.data
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...model,
                    permissionId : id
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
        mounted(){
            this.getRuleConditions()
        }
    }
</script>

<style scoped>

</style>