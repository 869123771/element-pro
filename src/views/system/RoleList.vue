<template>
    <div class="role">
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
                    v-model="table.model"
                    @on-load="queryList"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    @selection-change="selectionChange"
            >
                <template slot="menuLeft">
                    <el-button plain type="primary" icon="el-icon-plus" @click="addRole">新增</el-button>
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
                    <span>
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-pencil" @click="edit(row)"></i>
                        </span>
                        <el-dropdown placement="bottom" class="dropdown">
                            <span class="text-blue-500 text-base">
                              <i class="fa fa-fw fa-ellipsis-h"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <popover-confirm @confirm = "handleDel(row)">
                                    <div slot="popover-content">
                                        <el-dropdown-item>删除</el-dropdown-item>
                                    </div>
                                </popover-confirm>
                                <el-dropdown-item
                                                 @click.native="handleAuth(row)">授权</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
            <component :is="component.type" :ref="component.ref" :data="component.data"
                       @changeDialogWidth = "changeDialogWidth"></component>
            <div class="dialog-footer p-2 w-full flex justify-between">
                <div>
                    <tree-operation
                            @connect="connect"
                            @cancelConnect="cancelConnect"
                            @selectAll="selectAll"
                            @selectNone="selectNone"
                            @expandAll="expandAll"
                            @shrinkAll="shrinkAll"
                    ></tree-operation>
                </div>
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
    import TreeOperation from '@/views/common/TreeOperation'
    import Modify from './roleList/Modify'
    import Auth from './roleList/Auth'
    import PopoverConfirm from '@/components/popoverConfirm'

    const uploadAction = () => {
        let {config: {baseUrl: {proxyURL}}} = constant
        return `${proxyURL + apiList.sys_role_import}`
    }

    const drawerDefaultWidth = 500

    export default {
        name: "RoleList",
        components: {
            DragDrawer,
            DragDialog,
            FileUpload,
            TreeOperation,
            Modify,
            PopoverConfirm
        },
        data() {
            let {table} = constant
            return {
                form: {
                    option: {
                        menuBtn: false,
                        column: [
                            {
                                label: '名称',
                                prop: 'roleName',
                                span: 6,
                            },
                            {
                                label: "开始时间",
                                prop: 'createTime',
                                type: 'datetimerange',
                                span: 12,
                                startPlaceholder: '请输入开始时间',
                                endPlaceholder: '请输入结束时间',
                                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                            },
                            {
                                labelWidth: '0',
                                prop: 'searchBtn',
                                formslot: true,
                                span: 6,
                            }
                        ]
                    },
                    modal: {}
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
                                label: '创建时间',
                                prop: 'createTime'
                            },
                            {
                                label: '更新时间',
                                prop: 'updateTime'
                            },
                        ]
                    },
                    model: {},
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
                    width: drawerDefaultWidth,
                    data: {}
                },
                component: {
                    type: Auth,
                    ref: 'auth',
                    data: {}
                },
                dialog: {
                    width: '24',
                    height: '52',
                    name: 'addRole',
                    showFooter: true,
                },
                modify: {
                    data: {}
                },
                popover: {
                    drawerCancel: false
                },
                show: {
                    batch: false
                },
                fileUpload: {
                    action: uploadAction()
                },
            }
        },
        computed: {},
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
            connect() {
                let {ref} = this.component
                this.$refs[ref].connect()
            },
            cancelConnect() {
                let {ref} = this.component
                this.$refs[ref].cancelConnect()
            },
            selectAll() {
                let {ref} = this.component
                this.$refs[ref].selectAll()
            },
            selectNone() {
                let {ref} = this.component
                this.$refs[ref].selectNone()
            },
            expandAll() {
                let {ref} = this.component
                this.$refs[ref].expandAll()
            },
            shrinkAll() {
                let {ref} = this.component
                this.$refs[ref].shrinkAll()
            },
            changeDialogWidth(flag) {
                debugger;
                let {width} = this.drawer
                if(flag){
                    if (width !== drawerDefaultWidth) {
                        this.drawer = {
                            ...this.drawer,
                            width: drawerDefaultWidth
                        }
                    }
                }else{
                    if (width === drawerDefaultWidth) {
                        this.drawer = {
                            ...this.drawer,
                            width: width + 200
                        }
                    }
                }
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
            addRole() {
                this.dialog = {
                    ...this.dialog,
                    title: '新增角色',
                    name: 'addRole',
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
            fileImport() {
                this.$modal.show('fileUpload')
            },
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.sys_role_export, params)
                downloadFile(data, filename)

            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
            },
            edit(row) {
                debugger;
                this.dialog = {
                    ...this.dialog,
                    title: '编辑角色',
                    name: 'updateRole',
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
            async submit() {
                let {ref} = this.component
                let authRef = this.$refs[ref]
                let {lastpermissionIds, permissionIds} = authRef.getCheckedKeys()
                let {id: roleId} = authRef.data
                let params = {
                    lastpermissionIds,
                    permissionIds,
                    roleId
                }
                let {success, message} = await http.post(apiList.sys_role_save_permission_by_role, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.drawer = {
                        ...this.drawer,
                        show: false
                    }
                } else {
                    sweetAlert.error(message)
                }
            },
            handleDel({id: ids}) {
                this.confirmDeleteBatch(ids)
            },
            handleAuth(row) {
                debugger;
                this.drawer = {
                    ...this.drawer,
                    title: '角色权限配置',
                    width: drawerDefaultWidth,
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: Auth,
                    data: {
                        ...row
                    }
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
            deleteBatch() {
                let {selection} = this.table
                sweetAlert.confirm('删除', '确认要删除吗', this.confirmDeleteBatch, selection.join(','))
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.sys_role_delete_batch, {ids})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryList() {
                let {model: {createTime: [createTime_begin, createTime_end], ...res}} = this.form
                let {currentPage: pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    order: 'desc',
                    column: 'createTime',
                    pageNo,
                    pageSize,
                    ...res,
                    createTime_begin,
                    createTime_end
                }
                let {success, result} = await http.get(apiList.sys_role_query_list, params)
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
            mounted() {

            }
        }
    }
</script>

<style scoped>

</style>