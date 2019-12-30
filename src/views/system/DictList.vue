<template>
    <div class="dict bg-white p-3 m-3">
        <el-row>
            <el-form ref="form" :model="form" label-width="80px">
                <el-col :md="6" :sm="8">
                    <el-form-item :label="$t('sys_dict_name')" prop="dictName">
                        <el-input v-model="form.dictName" clearable :placeholder="$t('sys_dict_name')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <el-form-item :label="$t('sys_dict_code')" prop="dictCode">
                        <el-input v-model="form.dictCode" clearable :placeholder="$t('sys_dict_code')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8" class="pl-3">
                    <el-button type="primary" icon="el-icon-search" @click="search">{{$t('common_query')}}</el-button>
                    <el-button plain icon="el-icon-refresh-left" @click="reset">{{$t('common_reset')}}</el-button>
                </el-col>
            </el-form>
        </el-row>

        <el-row>
            <el-button plain type="primary" icon="el-icon-plus" @click="addDict">{{$t('common_add')}}</el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
            <template v-if = "recycleBin.total">
                <el-popover
                        placement="bottom"
                        trigger="manual"
                        v-model="show.recycle">
                    <fox-table
                            v-if = "recycleBin.show"
                            :column="recycleBin.column"
                            :data="recycleBin.data"
                    >
                    </fox-table>
                    <el-badge :value = "recycleBin.total" slot="reference">
                        <el-button plain icon="el-icon-refresh" @click="recycle">{{$t('sys_dict_recycle_bin')}}</el-button>
                    </el-badge>
                </el-popover>
            </template>
        </el-row>
        <el-row class="my-3">
            <collapse :collapse-props = "collapse">
                <div slot = "collapse-title">
                    <span>{{$t('sys_dict_info_head')}}</span>
                </div>
                <div slot = "collapse-content">
                    <fox-table
                            v-if="table.show"
                            v-loading="table.loading"
                            :column="table.column"
                            :data="table.data"
                            pagination
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-sizes="[5, 10, 20, 30]"
                            :page-count="5"
                            :current-page.sync="page.pageNum"
                            :total="page.total"
                            :page-size="page.pageSize"
                            @size-change="sizeChange"
                            @p-current-change="currentChange"
                    >
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
            <component :is="component.type" :ref="component.ref" :data="component.data"></component>
        </slide-out>
        <drag-dialog :drag-dialog="dialog" @confirm="confirmAdd">
            <modify :data="modify.data" ref="modify" @modifySuccess="modifySuccess"></modify>
        </drag-dialog>
        <file-upload :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {downloadFile} from '@/utils/modules/tools'
    import Collapse from '@/components/collapse/Collapse'
    import DragDrawer from '@/components/dragDrawer'
    import DragDialog from '@/components/dragDialog'
    import FileUpload from '@/components/fileUpload'
    import foxTable from '@/components/fox-table'
    import OperBtn from '@/components/table/OperBtn'
    import PopoverConfirm from '@/components/popoverConfirm'
    import DictConfig from './dictList/DictConfig'
    import Modify from './dictList/Modify'

    const uploadAction = () => {
        let {config: {baseUrl: {proxyURL}}} = constant
        return `${proxyURL + apiList.sys_dict_import}`
    }

    export default {
        name: "DictList",
        components: {
            Collapse,
            DragDrawer,
            DragDialog,
            FileUpload,
            foxTable,
            PopoverConfirm,
            Modify,
        },
        data() {
            return {
                collapse : {
                    name : 'dataDict',
                },
                form: {
                    dictName: '',      //字典名称
                    dictCode: '',      //字典编号
                },
                show : {
                    recycle : false
                },
                table: {
                    show: true,
                    column: [],
                    data: [],
                    loading: false,
                    selection: []
                },
                page: {
                    background: true,
                    layout: "total, sizes, prev, pager, next, jumper",
                    pageNum : 1,
                    pageSize: 10,
                    total: 0
                },
                recycleBin : {
                    total : '',
                    show : true,
                    data: [],
                    column : []
                },
                drawer: {
                    show: false,
                    direction: 'right',
                    width: '600px',
                    data: {}
                },
                component: {
                    type: DictConfig,
                    ref: 'dictConfig',
                    data: {}
                },
                dialog: {
                    width: '500',
                    height: '300',
                    name: 'add',
                    showFooter: true,
                },
                modify: {
                    data: {}
                },
                fileUpload: {
                    action: uploadAction()
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
            modifySuccess() {
                let {name} = this.dialog
                this.$modal.hide(name)
                this.queryList()
            },
            popoverConfirm() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
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
            fileImport() {
                this.$modal.show('fileUpload')
            },
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.sys_dict_export, params)
                downloadFile(data, filename)

            },
            recycle(){
                let {recycle} = this.show
                this.show = {
                    ...this.show,
                    recycle : !recycle
                }
            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
            },
            addDict() {
                this.dialog = {
                    ...this.dialog,
                    title: this.$t('common_add'),
                    name: 'addDict',
                }
                this.modify = {
                    ...this.modify,
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
                    name: 'updateDict',
                }
                this.modify = {
                    ...this.modify,
                    data: {
                        ...row
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            dictConfig(row) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name: 'dictConfig',
                    title: this.$t('sys_dict_dict_config'),
                }
                this.component = {
                    ...this.component,
                    type: DictConfig,
                    ref: 'dictConfig',
                    showFooter: true,
                    data: {
                        ...row
                    }
                }
                let {name} = this.drawer
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
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
            async dictRecycle(id){
                let {success, message} = await http.put(apiList.sys_dict_recycle + id)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.getDeleteList()
                    this.queryList()
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            async deletePhysic(id){
                let {success, message} = await http.delete(apiList.sys_dict_delete_physic + id)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.getDeleteList()
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            async confirmDeleteBatch(id,event,index) {
                let {success, message} = await http.delete(apiList.sys_dict_delete, {id})
                if (success) {
                    if(typeof index === 'number'){
                        sweetAlert.successWithTimer(message)
                        event(index)
                    }else{
                        sweetAlert.success(message)
                    }
                    this.queryList()
                    this.getDeleteList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async getDeleteList(){
                let {success,result = []} = await http.get(apiList.sys_dict_delete_list)
                if(success){
                    this.recycleBin = {
                        ...this.recycleBin,
                        total : result.length,
                        data : result
                    }
                }
            },
            async queryList() {
                let {pageNum : pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...this.form
                }
                let {success, result} = await http.get(apiList.sys_dict_query_list, params)
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
                            label: this.$t('common_operate'),
                            prop: 'oper',
                            width: '100',
                            render: (h, {row,$index}) => {
                                let btnInfo = [
                                    {
                                        content: this.$t('common_edit'),
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'dictList:edit',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        content: this.$t('sys_dict_dict_config'),
                                        className: 'fa-fw el-icon-s-tools',
                                        permission: 'dictList:config',
                                        event: () => {
                                            this.dictConfig(row)
                                        }
                                    },
                                    {
                                        content: this.$t('common_delete'),
                                        className: 'iconfont icon-wy-delete2',
                                        popover: true,
                                        popText: this.$t('common_confirm_do'),
                                        permission: 'dictList:delete',
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
                            label: this.$t('sys_dict_name'),
                            prop: 'dictName',
                        },
                        {
                            label: this.$t('sys_dict_code'),
                            prop: 'dictCode',
                        },
                        {
                            label: this.$t('sys_dict_description'),
                            prop: 'description',
                        },
                    ]
                }
                this.recycleBin = {
                    ...this.recycleBin,
                    show: false,
                    column : [
                        {
                            label: this.$t('common_operate'),
                            prop: 'oper',
                            width: '100',
                            render: (h, {row:{id},$index}) => {
                                let btnInfo = [
                                    {
                                        content: this.$t('sys_dict_fetch'),
                                        className: 'fa fa-fw fa-reply',
                                        permission: 'dictList:config',
                                        event: () => {
                                            this.dictRecycle(id)
                                        }
                                    },
                                    {
                                        content: this.$t('sys_dict_delete_thorough'),
                                        className: 'fa fa-fw fa-remove',
                                        permission: 'dictList:delete',
                                        event: () => {
                                            this.deletePhysic(id)
                                        }
                                    },
                                ]
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>

                                )
                            },
                        },
                        {
                            label: this.$t('sys_dict_name'),
                            prop: 'dictName',
                            width : 120
                        },
                        {
                            label: this.$t('sys_dict_code'),
                            prop: 'dictCode',
                            width : 120
                        },
                        {
                            label: this.$t('sys_dict_description'),
                            prop: 'description',
                            width : 120
                        },
                    ]
                }
                this.$nextTick(() => {
                    this.table = {
                        ...this.table,
                        show: true
                    }
                    this.recycleBin = {
                        ...this.recycleBin,
                        show : true
                    }
                })
            }
        },
        created() {
            this.setI18n()
        },
        mounted() {
            this.queryList()
            this.getDeleteList()
        },
    }
</script>

<style scoped lang = "less">
    .el-badge.el-popover__reference{
        margin-left : 10px;
    }
</style>