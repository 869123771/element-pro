<template>
    <div class="dict bg-white p-3">
        <el-row>
            <avue-form :option="form.option" v-model="form.model" ref="form">
                <template slot-scope="scope" slot="searchBtn">
                    <div>
                        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                        <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                    </div>
                </template>
            </avue-form>
        </el-row>
        <el-row>
            <avue-crud
                    :data="table.data"
                    :option="table.option"
                    :page="page"
                    :table-loading="table.loading"
                    @on-load="queryList"
                    @size-change="sizeChange"
                    @current-change="currentChange"
            >
                <template slot="menuLeft">
                    <el-button plain type="primary" icon="el-icon-plus" @click="addDict">新增</el-button>
                    <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">导入</el-button>
                    <el-button plain icon="iconfont icon-wy-download" @click="fileExport">导出</el-button>
                </template>
                <template slot="oper" slot-scope="{row}">
                    <span class = "flex">
                         <el-tooltip content="编辑" placement="top">
                             <span class="text-blue-500 text-base cursor-pointer">
                                 <i class="fa fa-fw fa-pencil" @click="edit(row)"></i>
                            </span>
                         </el-tooltip>
                        <el-tooltip content="字典配置" placement="top">
                             <span class="text-blue-500 text-base cursor-pointer">
                                <i class="fa-fw el-icon-s-tools" @click="dictConfig(row)"></i>
                            </span>
                        </el-tooltip>
                        <popover-confirm @confirm="confirmDeleteBatch(row.id)">
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
            <component :is="component.type" :ref="component.ref" :data="component.data"></component>
        </drag-drawer>
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
    import DragDrawer from '@/components/dragDrawer'
    import DragDialog from '@/components/dragDialog'
    import FileUpload from '@/components/fileUpload'
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
            DragDrawer,
            DragDialog,
            FileUpload,
            PopoverConfirm,
            Modify,
        },
        data() {
            let {table} = constant
            return {
                form: {
                    option: {
                        menuBtn: false,
                        column: [
                            {
                                label: '字典名称',
                                prop: 'dictName',
                                span: 7,
                            },
                            {
                                label: "字典编号",
                                prop: 'dictCode',
                                span: 7,
                            },
                            {
                                labelWidth: '0',
                                prop: 'searchBtn',
                                formslot: true,
                                span: 6,
                            }
                        ]
                    },
                    model: {}
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
                                label: '字典名称',
                                prop: 'dictName'
                            },
                            {
                                label: '字典编号',
                                prop: 'dictCode'
                            },
                            {
                                label: '描述',
                                prop: 'description'
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
                    width: 600,
                    data: {}
                },
                component: {
                    type: DictConfig,
                    ref: 'dictConfig',
                    data: {}
                },
                dialog: {
                    width: '24',
                    height: '52',
                    name: 'addRole',
                    showFooter: true,
                },
                modify : {
                    data : {}
                },
                fileUpload: {
                    action: uploadAction()
                },
            }
        },
        methods: {
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
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
            },
            addDict() {
                this.dialog = {
                    ...this.dialog,
                    title: '新增字典',
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
            edit(row){
                this.dialog = {
                    ...this.dialog,
                    title: '编辑字典',
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
            dictConfig(row){
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name : 'dictConfig',
                    title: '字典配置',
                }
                this.component = {
                    ...this.component,
                    type: DictConfig,
                    ref: 'dictConfig',
                    showFooter : true,
                    data: {
                        ...row
                    }
                }
                let {name} = this.drawer
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
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
            async confirmDeleteBatch(id) {
                let {success, message} = await http.delete(apiList.sys_dict_delete, {id})
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
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...model
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
        }
    }
</script>

<style scoped>

</style>