<template>
    <div class="role bg-white p-3 m-3">
        <el-row>
            <el-form ref="form" :model="form" label-width="80px">
                <el-col :md="6" :sm="8">
                    <el-form-item :label="$t('sys_role_name')" prop="roleName">
                        <el-input v-model="form.roleName" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <el-form-item :label="$t('sys_role_start_time')" prop="createTime">
                        <el-date-picker
                                class="w-full"
                                v-model="form.createTime"
                                type="datetimerange"
                                :start-placeholder="$t('sys_role_time_start')"
                                :end-placeholder="$t('sys_role_time_end')"
                                value-format="yyyy-MM-dd hh:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <div class="pl-3">
                        <el-button type="primary" icon="el-icon-search" @click="search">{{$t('common_query')}}
                        </el-button>
                        <el-button plain icon="el-icon-refresh-left" @click="reset">{{$t('common_reset')}}</el-button>
                    </div>
                </el-col>
            </el-form>
        </el-row>

        <el-row class="my-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="addRole">{{$t('common_add')}}</el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    {{$t('common_batch_operate')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>{{$t('common_delete')}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>

        <el-row>
            <collapse :collapse-props = "collapse">
                <div slot = "collapse-title">
                    <span>部门信息</span>
                </div>
                <div slot = "collapse-content">
                    <fox-table
                            v-if="table.show"
                            highlight-current-row
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
                            @cell-click="cellClick">
                    </fox-table>
                </div>
            </collapse>
        </el-row>
        <el-row>
            <role-maintenance :data="role.data" v-show="role.show"></role-maintenance>
        </el-row>
        <drag-drawer v-model="drawer.show"
                     :draggable="drawer.draggable"
                     :title="drawer.title"
                     :width.sync="drawer.width"
                     :direction="drawer.direction"
        >
            <component :is="component.type" :ref="component.ref" :data="component.data"
                       @changeDialogWidth="changeDialogWidth"></component>
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
                <div class="flex">
                    <popover-confirm @confirm="popoverConfirm" class="mx-2">
                        <div slot="popover-title">确定要关闭吗</div>
                        <div slot="popover-content">
                            <el-button plain>取消</el-button>
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
    import Collapse from '@/components/collapse/Collapse'
    import foxTable from '@/components/fox-table'
    import OperBtn from '@/components/table/OperBtn'
    import FileUpload from '@/components/fileUpload'
    import TreeOperation from '@/views/common/TreeOperation'
    import Modify from './roleList/Modify'
    import Auth from './roleList/Auth'
    import RoleMaintenance from './roleList/RoleMaintenance'
    import PopoverConfirm from '@/components/popoverConfirm'

    const uploadAction = () => {
        let {config: {baseUrl: {proxyURL}}} = constant
        return `${proxyURL + apiList.sys_role_import}`
    }

    const drawerDefaultWidth = 500

    export default {
        name: "RoleList",
        components: {
            Collapse,
            DragDrawer,
            DragDialog,
            FileUpload,
            foxTable,
            TreeOperation,
            Modify,
            RoleMaintenance,
            PopoverConfirm
        },
        data() {
            return {
                form: {
                    roleName: '',
                    createTime: [],
                },
                collapse : {
                    name : 'deptInfo'
                },
                table: {
                    show: true,
                    data: [],
                    column: [],
                    loading: false,
                    selection: []
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                drawer: {
                    show: false,
                    direction: 'rtl',
                    draggable: true,
                    width: drawerDefaultWidth + 'px',
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
                role: {
                    data: {},
                    show: false,
                },
                fileUpload: {
                    action: uploadAction()
                },
            }
        },
        computed: {},
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods: {
            ...mapActions({
                getPermissionList: 'GET_PERMISSION_LIST'
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
                let {width} = this.drawer
                if (flag) {
                    if (parseInt(width) !== drawerDefaultWidth) {
                        this.drawer = {
                            ...this.drawer,
                            width: drawerDefaultWidth + 'px'
                        }
                    }
                } else {
                    if (parseInt(width) === drawerDefaultWidth) {
                        this.drawer = {
                            ...this.drawer,
                            width: parseInt(width) + 200 + 'px'
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
                    this.getPermissionList()                    //刷新菜单
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
                this.drawer = {
                    ...this.drawer,
                    title: '角色权限配置',
                    width: drawerDefaultWidth + 'px',
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
            cellClick(row, column) {
                let {property, type} = column
                let exceptCell = ['oper']
                if (type !== 'selection' && !exceptCell.includes(property)) {
                    this.role = {
                        ...this.role,
                        data: row,
                        show: true
                    }
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
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm('删除', '确认要删除吗', this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.sys_role_delete_batch, {ids})
                if (success) {
                    sweetAlert.success(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryList() {
                let {createTime: [createTime_begin, createTime_end], ...res} = this.form
                let {pageNum: pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
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
                            render: (h, {row, $index}) => {
                                let btnInfo = [
                                    {
                                        content: '修改',
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'role:edit',
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
                                                permission: 'role.delete',
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