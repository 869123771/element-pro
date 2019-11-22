<template>
    <div class="announce bg-white p-3 m-3">
        <el-row>
            <el-form ref="form" :model="form" label-width="90px">
                <form-query @search="search" @reset="reset">
                    <template slot="show">
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
                    </template>
                    <template slot="hide">
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
                        <el-col :md="6" :sm="8">
                            <el-form-item label="优先级:" prop="priority">
                                <el-select v-model="form.priority" clearable filterable class="w-full">
                                    <template v-for="item in priority">
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
                    <span>系统通告信息</span>
                </div>
                <div slot="collapse-content">
                    <fox-table
                            ref = "table"
                            row-key = "id"
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
                        <template slot="oper" slot-scope="{scope:{row}}">
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
                    </fox-table>
                </div>
            </collapse>
        </el-row>

        <slide-out :visible.sync="drawer.show"
                   :dock ="drawer.direction"
                   :title="drawer.title"
                   :size="drawer.width"
                   :close-on-mask-click = "false"
                   allow-resize
        >
            <modify :data="modify.data" ref="modify" @modifySuccess="modifySuccess"></modify>
            <div slot = "footer" v-if = "drawer.showFooter">
                <div class="flex justify-end">
                    <popover-confirm @confirm="popoverConfirm" class="mx-2">
                        <div slot="popover-title">{{$t('common_sure_to_close_popover')}}</div>
                        <div slot="popover-content">
                            <el-button plain>{{$t('common_cancel')}}</el-button>
                        </div>
                    </popover-confirm>
                    <el-button type="primary" @click="submit" v-loading = "drawer.loading">{{$t('common_submit')}}</el-button>
                </div>
            </div>
        </slide-out>
        <file-upload :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {downloadFile} from '@/utils/modules/tools'
    import Collapse from '@/components/collapse/Collapse'
    import PopoverConfirm from '@/components/popoverConfirm'
    import Modify from './sysAnnouncementList/Modify'
    import FileUpload from '@/components/fileUpload'
    import foxTable from '@/components/fox-table/'
    import FormQuery from '@/components/form/query'

    const uploadAction = () => {
        let {config: {baseUrl: {proxyURL}}} = constant
        return `${proxyURL + apiList.sys_sys_announcement_importExcel}`
    }

    export default {
        name: "SysAnnouncementList",
        components: {
            Collapse,
            FileUpload,
            PopoverConfirm,
            Modify,
            foxTable,
            FormQuery
        },
        data() {
            return {
                collapse : {
                    name : 'sysAnnounce',
                },
                form: {
                    titile: '',                                    //标题
                    msgCategory: '',                               //消息类型
                    sender: '',                                    //发布人
                    sendStatus: '',                                //发布状态
                    priority: '',                                  //优先级
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
                drawer: {
                    show: false,
                    direction: 'right',
                    draggable: true,
                    width: '900px',
                    showFooter : true,
                    loading : false,
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
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
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
                    pageNum: 1
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
                let {success, message} = await http.get(apiList.sys_sys_announcement_release, {id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async handleReply({id}) {
                let {success, message} = await http.get(apiList.sys_sys_announcement_revoke, {id})
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
                    show: true,
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
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_del'), this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.sys_sys_announcement_delete_batch, {ids})
                if (success) {
                    sweetAlert.success(message)
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
                let {titile, msgCategory, sender, sendStatus, priority} = this.form
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    titile: titile ? titile : undefined,
                    msgCategory: msgCategory ? msgCategory : undefined,
                    sender: sender ? sender : undefined,
                    sendStatus: sendStatus ? sendStatus : undefined,
                    priority: priority ? priority : undefined,
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
                    this.$refs.table.rowDrop()
                    this.$refs.table.columnDrop()
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
                            slot: true,
                        },
                        {
                            label: '标题',
                            prop: 'titile',
                            width: 150,
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
            this.getMsgCategory()
            this.getPriority()
            this.getSendStatus()
            this.getMsgType()
            this.queryList()
        }
    }
</script>

<style scoped>

</style>