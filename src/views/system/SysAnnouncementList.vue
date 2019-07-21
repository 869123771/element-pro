<template>
    <div class="announce bg-white p-3 m-3">
        <el-row>
            <el-form ref="form" :model="form" label-width="90px">
                <el-row>
                    <el-col :md="6" :sm="8">
                        <el-form-item label="标题:" prop="titile">
                            <el-input v-model="form.titile" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="8">
                        <el-form-item label="消息类型:" prop="msgCategory">
                            <el-select v-model="form.msgCategory" clearable filterable class="w-full">
                                <template v-for="item in msgCategory">
                                    <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <div v-show="show.collapse">
                        <el-col :md="6" :sm="8">
                            <el-form-item label="发布人:" prop="sender">
                                <el-input v-model="form.sender" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="8">
                            <el-form-item label="发布状态:" prop="sendStatus">
                                <el-select v-model="form.sendStatus" clearable filterable class="w-full">
                                    <template v-for="item in sendStatus">
                                        <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md = "6" :sm = "8">
                            <el-form-item label="优先级:" prop="priority">
                                <el-select v-model="form.priority" clearable filterable class="w-full">
                                    <template v-for="item in priority">
                                        <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </div>
                    <el-col :md="6" :sm="8">
                        <el-form-item label-width="20px">
                            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                            <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                            <span class="cursor-pointer inline-block text-blue-500 pl-2" @click="arrowClick">
                            <span v-if="!show.collapse">
                                <span>展开</span>
                                <i class="el-icon-arrow-down pl-1"></i>
                            </span>
                            <span v-else>
                                <span>收起</span>
                                <i class="el-icon-arrow-up pl-1"></i>
                            </span>
                        </span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-row>
        <el-row>
            <avue-crud
                    ref="crud"
                    :data="table.data"
                    :option="table.option"
                    :page="page"
                    :table-loading="table.loading"
                    @on-load="queryList"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    @selection-change="selectionChange"
            >
                <template slot="menuLeft">
                    <el-button plain type="primary" icon="el-icon-plus" @click="add">新增</el-button>
                    <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">导入</el-button>
                    <el-button plain icon="iconfont icon-wy-download" @click="fileExport">导出</el-button>
                    <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                        <el-button plain>
                            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>删除
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <template slot="oper" slot-scope="{row}">
                    <span class="flex">
                        <el-tooltip content="编辑" placement="top">
                            <span class="text-blue-500 text-base cursor-pointer">
                                <i class="fa fa-fw fa-pencil" @click="edit(row)"></i>
                            </span>
                        </el-tooltip>
                        <popover-confirm @confirm="handleRelease(row)" v-if="Number(row.sendStatus) === 0">
                             <div slot="popover-title">确定要发布吗</div>
                            <div slot="popover-content" class="text-blue-500 text-base cursor-pointer">
                                <i class="fa fa-fw fa-mail-forward"></i>
                            </div>
                        </popover-confirm>
                         <popover-confirm @confirm="handleReply(row)" v-else-if="Number(row.sendStatus) === 1">
                             <div slot="popover-title">确定要撤销吗</div>
                             <div slot="popover-content" class="text-blue-500 text-base cursor-pointer">
                                  <span class="text-blue-500 text-base cursor-pointer">
                                    <i class="fa fa-fw fa-mail-reply"></i>
                                </span>
                             </div>
                        </popover-confirm>
                        <popover-confirm @confirm="handleDel(row)">
                            <div slot="popover-content" class="text-blue-500 text-base cursor-pointer">
                                <i class="icon iconfont icon-wy-delete2"></i>
                            </div>
                        </popover-confirm>
                    </span>
                </template>
            </avue-crud>
        </el-row>
        <drag-drawer v-model="drawer.show"
                     :draggable="drawer.draggable"
                     :title="drawer.title"
                     :width.sync="drawer.width"
                     :placement="drawer.placement"
        >
            <modify :data="modify.data" ref="modify" @modifySuccess="modifySuccess"></modify>
            <div class="dialog-footer p-2 w-full flex justify-end">
                <div class = "flex">
                    <popover-confirm @confirm = "popoverConfirm" class="mx-2">
                        <div slot = "popover-title">确定要关闭吗</div>
                        <div slot="popover-content">
                            <el-button plain >取消</el-button>
                        </div>
                    </popover-confirm>
                    <el-button type="primary" @click="submit">提交</el-button>
                </div>
            </div>
        </drag-drawer>
        <file-upload :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {downloadFile} from '@/utils/modules/tools'
    import PopoverConfirm from '@/components/popoverConfirm'
    import Modify from './sysAnnouncementList/Modify'
    import DragDrawer from '@/components/dragDrawer'
    import FileUpload from '@/components/fileUpload'

    const uploadAction = () => {
        let {config: {baseUrl: {proxyURL}}} = constant
        return `${proxyURL + apiList.sys_sys_announcement_importExcel}`
    }

    export default {
        name: "SysAnnouncementList",
        components: {
            DragDrawer,
            FileUpload,
            PopoverConfirm,
            Modify
        },
        data() {
            let {table} = constant
            return {
                form: {
                    titile: '',                                    //标题
                    msgCategory: '',                               //消息类型
                    sender: '',                                    //发布人
                    sendStatus: '',                                //发布状态
                    priority : '',                                  //优先级
                },
                show: {
                    collapse: false,
                    batch: false
                },
                table: {
                    data: [],
                    option: {
                        ...table,
                        column: [
                            {
                                label: '操作',
                                prop: 'oper',
                                slot: true,
                                width: 80
                            },
                            {
                                label: '标题',
                                prop: 'titile',
                                width: 150,
                                overHidden: true
                            },
                            {
                                label: '消息类型',
                                prop: 'msgCategory_dictText',
                            },
                            {
                                label: '发布人',
                                prop: 'sender'
                            },
                            {
                                label: '优先级',
                                prop: 'priority_dictText'
                            },
                            {
                                label: '通告对象',
                                prop: 'msgType_dictText'
                            },
                            {
                                label: '发布状态',
                                prop: 'sendStatus_dictText'
                            },
                            {
                                label: '发布时间',
                                prop: 'sendTime',
                                sortable: true,
                            },
                            {
                                label: '撤销时间',
                                prop: 'endTime'
                            },
                        ]
                    },
                    loading: false,
                    selection: []
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                drawer: {
                    show: false,
                    placement: 'right',
                    draggable: true,
                    width: 900,
                    data: {}
                },
                modify: {
                    data: {}
                },
                fileUpload: {
                    action: uploadAction()
                },
            }
        },
        computed: {
            ...mapState({
                msgCategory: ({dict}) => dict.msgCategory,
                priority: ({dict}) => dict.priority,
                sendStatus: ({dict}) => dict.sendStatus,
            })
        },
        methods: {
            ...mapActions({
                getMsgCategory: 'GET_MSG_CATEGORY',
                getPriority: 'GET_PRIORITY',
                getSendStatus: 'GET_SEND_STATUS',
                getMsgType: 'GET_MSG_TYPE'
            }),
            search() {
                this.page = {
                    ...this.page,
                    currentPage: 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetFields()
            },
            edit(row) {
                this.drawer = {
                    ...this.drawer,
                    title: '编辑',
                    show: true,
                }
                this.modify = {
                    ...this.modify,
                    data: {
                        ...row
                    }
                }
            },
            async handleRelease({id}) {
                let {success,message} = await http.get(apiList.sys_sys_announcement_release,{id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async handleReply({id}) {
                let {success,message} = await http.get(apiList.sys_sys_announcement_revoke,{id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            add() {
                this.drawer = {
                    ...this.drawer,
                    show : true,
                    title: '新增',
                }
                this.modify = {
                    ...this.modify,
                    data: {}
                }
            },
            submit() {
                let modifyRef = this.$refs.modify
                modifyRef.$refs.form.validate(valid => {
                    if (valid) {
                        this.dialog = {
                            ...this.dialog,
                            loading: true
                        }
                        modifyRef.saveData()
                    }
                })
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm('删除', '确认要删除吗', this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.sys_sys_announcement_delete_batch, {ids})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                    this.show = {
                        ...this.show,
                        batch: false
                    }
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
                let {data, filename} = await http.getFileDownload(apiList.sys_sys_announcement_exportXls, params)
                downloadFile(data, filename)

            },
            modifySuccess() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
                this.queryList()
            },
            popoverConfirm() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
                this.popover = {
                    ...this.popover,
                    drawerCancel: false
                }
            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
            },
            async handleDel({id}) {
                let {success, message} = await http.delete(apiList.sys_sys_announcement_delete, {id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            arrowClick() {
                let {collapse} = this.show
                this.show = {
                    ...this.show,
                    collapse: !collapse
                }
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
            async queryList() {
                let {currentPage: pageNo, pageSize} = this.page
                let {titile, msgCategory, sender, sendStatus,priority} = this.form
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    titile : titile ? titile : undefined,
                    msgCategory : msgCategory ? msgCategory : undefined,
                    sender : sender ? sender : undefined ,
                    sendStatus : sendStatus ? sendStatus : undefined,
                    priority : priority ? priority : undefined,
                }
                let {success, result} = await http.get(apiList.sys_sys_announcement_query_list, params)
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
                    this.table = {
                        ...this.table,
                        loading: false
                    }
                }
            },
        },
        mounted() {
            this.getMsgCategory()
            this.getPriority()
            this.getSendStatus()
            this.getMsgType()
        }
    }
</script>

<style scoped>

</style>