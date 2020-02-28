<template>
    <div class = "p-3 m-3 bg-white">
        <el-row>
            <el-form ref="form" :model="form" label-width="90px">
                <form-query @search="search" @reset="reset" :show-arrow = "false">
                    <template slot="show">
                        <el-col  :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                            <el-form-item label="规则名称" prop="ruleName">
                                <el-input v-model="form.ruleName" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                            <el-form-item label="规则code" prop="ruleCode">
                                <el-input v-model="form.ruleCode" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row>
            <el-button plain type="primary" icon="el-icon-plus" @click="add">{{$t('common_add')}}</el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    {{$t('common_batch_operate')}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>{{$t('common_delete')}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row class="my-3">
            <collapse :collapse-props="collapse">
                <div slot="collapse-title">
                    <span>系统编码校验规则列表</span>
                </div>
                <div slot="collapse-content">
                    <fox-table
                            v-if="table.show"
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
                            @selection-change="selectionChange"
                    >
                    </fox-table>
                </div>
            </collapse>
        </el-row>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component
                    :is="component.is"
                    :ref="component.ref"
                    :data="component.data"
                    @modifyResult="modifyResult"
            >
            </component>
        </drag-dialog>
        <file-upload ref="fileUpload" :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {downloadFile} from '@/utils/modules/tools'
    import Collapse from '@/components/collapse/Collapse'
    import PopoverConfirm from '@/components/popoverConfirm'
    import FileUpload from '@/components/fileUpload'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'
    import FormQuery from '@/components/form/query'
    import DragDialog from '@/components/dragDialog'
    import Modify from './sysCheckRuleList/Modify'
    import FunctionalTest from "./sysCheckRuleList/FunctionalTest";

    export default {
        name: "SysCheckRuleList",
        components: {
            Collapse,
            FileUpload,
            PopoverConfirm,
            Modify,
            foxTable,
            FormQuery,
            DragDialog
        },
        data() {
            return {
                collapse : {
                    name : 'CheckRule',
                },
                form: {

                },
                show: {
                    batch: false
                },
                table: {
                    data: [],
                    column: [],
                    loading: false,
                    show: false,
                    selection: []
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                dialog: {
                    width: 32,
                    height: 72,
                    showFooter: true,
                    loading : false
                },
                component: {
                    is: Modify,
                    ref: 'modify',
                    data: {}
                },
                fileUpload: {
                    action: apiList.sys_check_rule_import
                },
            }
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods: {
            ...mapActions({

            }),
            search() {
                this.page = {
                    ...this.page,
                    pageNum: 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetFields()
            },
            confirm() {
                let {ref} = this.component
                let modifyRef = this.$refs[ref]
                if(modifyRef.$refs.form){
                    modifyRef.$refs.form.validate(valid => {
                        if (valid) {
                            this.dialog = {
                                ...this.dialog,
                                loading: true
                            }
                            modifyRef.saveData()
                        }
                    })
                }else{
                    this.closeDialog(true)
                }
            },
            modifyResult(flag) {
                if(flag){
                    this.closeDialog()
                    this.queryList()
                }
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
            },
            closeDialog(){
                let {name} = this.dialog
                this.$modal.hide(name)
            },
            add() {
                this.dialog = {
                    ...this.dialog,
                    title: this.$t('common_add'),
                    name: 'add',
                    width : 50,
                    height : 88,
                    loading : false,
                    showFooter : true,
                }
                this.component = {
                    ...this.component,
                    is: Modify,
                    ref: 'add',
                    data: {}
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            edit(row) {
                this.dialog = {
                    ...this.dialog,
                    title: this.$t('common_edit'),
                    name: 'edit',
                    width : 50,
                    height : 88,
                    loading : false,
                    showFooter : true,
                }
                this.component = {
                    ...this.component,
                    is: Modify,
                    ref: 'edit',
                    data: {
                        ...row
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            functionalTest(row){
                this.dialog = {
                    ...this.dialog,
                    title: '功能测试',
                    name: 'functionalTest',
                    width : 30,
                    height : 250,
                    minHeight :250
                }
                this.component = {
                    ...this.component,
                    is: FunctionalTest,
                    ref: 'functionalTest',
                    data: {
                        ...row
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_do'), this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids,event,index) {
                let {success, message} = await http.delete(apiList.sys_check_rule_delete_batch, {ids})
                if (success) {
                    if(typeof index === 'number'){
                        sweetAlert.successWithTimer(message)
                        event(index)
                    }else{
                        sweetAlert.success(message)
                    }
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
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
            fileImport() {
                this.$modal.show('fileUpload')
            },
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.sys_check_rule_export, params)
                downloadFile(data, filename)
            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
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
            async queryList() {
                let {pageNum: pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...this.form,
                }
                let {success, result} = await http.get(apiList.sys_check_rule_query_list, params)
                if (success) {
                    let {total, records} = result
                    this.table = {
                        ...this.table,
                        data: records
                    }
                    this.page = {
                        ...this.page,
                        total
                    }
                }
                this.table = {
                    ...this.table,
                    loading: false
                }
            },
            setI18n() {
                this.table = {
                    ...this.table,
                    show: false,
                    column: [
                        {
                            type : 'selection',
                        },
                        {
                            type : 'index',
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
                                        permission: 'fillRule:edit',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        type: 'dropDown',
                                        className: 'fa fa-fw fa-ellipsis-h',
                                        permission: 'role.grant',
                                        dropDownItems: [
                                            {
                                                content: '功能测试',
                                                className: '',
                                                permission: 'fillRule:test',
                                                popover: false,
                                                event: () => {
                                                    this.functionalTest(row)
                                                }
                                            },
                                            {
                                                content: '删除',
                                                className: '',
                                                popover: true,
                                                popText: '确定要删除吗',
                                                permission: 'fillRule:delete',
                                                event: (event,index) => {
                                                    this.confirmDeleteBatch(row.id,event,index)
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
                            label: '规则名称',
                            prop: 'ruleName',
                        },
                        {
                            label: '规则Code',
                            prop: 'ruleCode',
                        },
                        {
                            label: '规则描述',
                            prop: 'ruleDescription',
                            width : 700
                        },
                    ]
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