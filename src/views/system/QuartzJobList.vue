<template>
    <div class="user bg-white p-3 m-3">
        <el-row>
            <el-form ref="form" :model="form" label-width="80px">
                <form-query @search="search" @reset="reset" :show-arrow = "false">
                    <template slot = "show">
                        <el-col  :xs = "24" :sm = "24" :md="12" :lg = "12" :xl = "12">
                            <el-form-item label="任务名称" prop="jobClassName">
                                <el-input v-model="form.jobClassName" placeholder="任务名称" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "24" :md="12" :lg = "12" :xl = "12">
                            <el-form-item label="任务状态" prop="status">
                                <el-select v-model="form.status" clearable filterable class="w-full">
                                    <template v-for="item in taskStatus">
                                        <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row>
            <el-button plain type="primary" icon="el-icon-plus" @click="add" v-waves>
                {{$t('common_add')}}
            </el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    {{$t('common_batch_operate')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>{{$t('common_delete')}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row class = "mt-3">
            <collapse :collapse-props = "collapse">
                <div slot = "collapse-title">
                    <span>定时任务</span>
                </div>
                <div slot = "collapse-content">
                    <fox-table
                            ref = "table"
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
                            @selection-change="selection"
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
                    @modifySuccess="modifySuccess"
            >
            </component>
        </drag-dialog>
        <file-upload ref="fileUpload" :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import FormQuery from '@/components/form/query'
    import foxTable from '@/components/fox-table'
    import OperBtn from '@/components/table/OperBtn'
    import Collapse from '@/components/collapse/Collapse'
    import FileUpload from '@/components/fileUpload'
    import DragDialog from '@/components/dragDialog'
    import {downloadFile} from '@/utils/modules/tools'
    import Read from "./userList/Read";
    import PopDropdown from "./userList/PopDropdown";
    import Modify from './quartzJobList/Modify'

    export default {
        name: "QuartzJobList",
        components : {
            FormQuery,
            foxTable,
            Collapse,
            FileUpload,
            DragDialog
        },
        data(){
            return {
                form : {},
                show: {
                    batch: false,
                },
                collapse : {
                    name : 'quartzJobList'
                },
                dialog: {
                    width: 300,
                    height: 300,
                    name: 'job',
                    loading : false,
                    title: this.$t('common_add'),
                    showFooter : true,
                    confirmText : '保存并安排任务'
                },
                fileUpload: {
                    action: apiList.sys_quertz_job_import
                },
                component: {
                    is: Read,
                    ref: 'read',
                    data: {}
                },
                props: {
                    resetPwd: {},
                    proxyMan: {}
                },
                table: {
                    column: [],
                    data: [],
                    selection: [],
                    handleMenus : [],
                    loading: false,
                    show: true
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        computed : {
            ...mapState({
                taskStatus : ({dict}) => dict.taskStatus
            })
        },
        methods : {
            ...mapActions({
                getTaskStatus : 'GET_TASK_STATUS'
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
            add(){
                this.dialog = {
                    ...this.dialog,
                    title: this.$t('common_add'),
                    name: 'add',
                    width : 40,
                    height : 490
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
            edit(row){
                this.dialog = {
                    ...this.dialog,
                    title: this.$t('common_edit'),
                    name: 'edit',
                    width : 40,
                    height : 490
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
            async start({jobClassName},event,index){
                let {success,message} = await http.get(apiList.sys_quertz_job_resume,{jobClassName})
                if(success){
                    sweetAlert.successWithTimer(message)
                    event(index)
                    this.queryList()
                }else{
                    sweetAlert.error(message)
                }
            },
            fileImport() {
                this.$modal.show('fileUpload')
            },
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.sys_quertz_job_export, params)
                downloadFile(data, filename)

            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
            },
            confirm() {
                let {ref} = this.component
                let modifyRef = this.$refs[ref]
                modifyRef.$refs.form.validate(valid => {
                    if (valid) {
                        this.dialog = {
                            ...this.dialog,
                            loading: true
                        }
                        modifyRef.saveData()
                    }
                })
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
            },
            modifySuccess() {
                let {name} = this.dialog
                this.$modal.hide(name)
                this.queryList()
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_do'), this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids,event,index) {
                let {success, message} = await http.delete(apiList.sys_quertz_job_delete_batch, {ids})
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
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {pageSize, pageNum: pageNo} = this.page
                let params = {
                    ...this.form,
                    pageSize,
                    pageNo
                }
                let {success, result: {total, records: data}} = await http.get(apiList.sys_quartz_job_query_list, params)
                if (success) {
                    this.table = {
                        ...this.table,
                        loading: false,
                        data
                    }
                    this.page = {
                        ...this.page,
                        total
                    }
                }
            },
            setI18n() {
                let column = [
                    {type: 'selection', fixed: true},
                    {
                        label: this.$t('common_operate'),
                        prop: 'oper',
                        width: '100',
                        fixed : true,
                        render: (h, {row}) => {
                            let btnInfo = [
                                {
                                    content: '启动',
                                    className: 'fa fa-fw fa-play-circle',
                                    permission: 'quartzJob:start',
                                    popover: true,
                                    popText: '是否启动选中任务?',
                                    event: (event,index) => {
                                        this.start(row,event,index)
                                    }
                                },
                                {
                                    content: this.$t('common_edit'),
                                    className: 'fa fa-fw fa-pencil',
                                    permission: 'quartzJob:edit',
                                    event: () => {
                                        this.edit(row)
                                    }
                                },
                                {
                                    content: this.$t('common_delete'),
                                    className: 'iconfont icon-wy-delete2',
                                    popover: true,
                                    popText: this.$t('common_confirm_do'),
                                    permission: 'quartzJob:delete',
                                    event: (event,index) => {
                                        this.confirmDeleteBatch(row.id,event,index)
                                    }
                                },
                            ]
                            return (
                                <OperBtn btnInfo={btnInfo}></OperBtn>

                            )
                        },
                    },
                    {
                        label: '任务类名',
                        prop: 'jobClassName',
                    },
                    {
                        label: 'corn表达式',
                        prop: 'cronExpression',
                    },
                    {
                        label: '参数',
                        prop: 'parameter',
                    },
                    {
                        label: '描述',
                        prop: 'description',
                    },
                    {
                        label: '状态',
                        prop: 'status',
                        render : (h,{row:{status}})=>{
                            let type = ''
                            switch (status) {
                                case -1 : type = 'info'; break
                                case 0 : type = 'success'; break
                                case 1 : type = 'danger'; break
                            }
                            return (
                                <el-tag size = "small" effect="plain" type = {type}>{this.taskStatus.length ? this.taskStatus.find(item=>item.itemValue === status.toString()).itemText : ''}</el-tag>
                            )
                        }
                    },
                ]
                this.table = {
                    ...this.table,
                    show: false,
                    column,
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
        mounted(){
            this.getTaskStatus()
            this.queryList()
        },
    }
</script>

<style scoped>

</style>