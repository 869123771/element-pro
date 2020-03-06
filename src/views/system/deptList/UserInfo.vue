<template>
    <div class="role-maintenance">
        <el-row>
            <el-button plain type="primary" icon="el-icon-plus" @click="addUser">用户录入</el-button>
            <el-button plain icon="el-icon-plus" @click="addUserHas">添加已有用户</el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    批量操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>删除
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row class="my-3">
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
                    :current-page="page.pageNum"
                    :total="page.total"
                    :page-size="page.pageSize"
                    @size-change="sizeChange"
                    @p-current-change="currentChange"
                    @selection-change="selectionChange"
            ></fox-table>
        </el-row>

        <slide-out :visible.sync="drawer.show"
                   :dock ="drawer.direction"
                   :title="drawer.title"
                   :size="drawer.width"
                   :close-on-mask-click = "false"
                   allow-resize
        >
            <component :is="component.type" :data="component.data" @closeFlush="closeFlush" :ref = "component.ref"></component>
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

        <drag-dialog :drag-dialog="dialog" @confirm="confirmAdd">
            <add-user :ref="user.ref" :data="user.data" @handleSuccess="handleSuccess"></add-user>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {http, apiList, sweetAlert, constant} from '@/utils'
    import list from '@/utils/modules/mixins/list'
    import foxTable from '@/components/fox-table'
    import OperBtn from '@/components/table/OperBtn'
    import DragDrawer from '@/components/dragDrawer'
    import DragDialog from '@/components/dragDialog'
    import Modify from '../userList/Modify'
    import AddUser from './AddUser'
    import PopoverConfirm from '@/components/popoverConfirm'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "UserInfo",
        props: {
            userInfo: {
                type: Object
            },
        },
        components: {
            foxTable,
            DragDrawer,
            DragDialog,
            AddUser,
            PopoverConfirm
        },
        mixins: [list],
        data() {
            return {
                table: {
                    loading: false,
                    selection: [],
                    data: [],
                    column: [
                        {type: 'selection', fixed: true},
                        {
                            label: '操作',
                            prop: 'oper',
                            width: 80,
                            render: (h, {row, $index}) => {
                                let btnInfo = [
                                    {
                                        content: '修改',
                                        className: 'fa fa -fw fa-pencil',
                                        permission: 'dept:user:edit',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        content: '删除',
                                        popover: true,
                                        popText: '确定要删除吗',
                                        className: 'iconfont icon-wy-delete2',
                                        permission: 'dept:user:delete',
                                        event: (event,index) => {
                                            this.confirmDelete(row.id, event,index)
                                        }
                                    },
                                ]
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>
                                )
                            }
                        },
                        {
                            label: '用户账号',
                            prop: 'username'
                        },
                        {
                            label: '用户名称',
                            prop: 'realname'
                        },
                        {
                            label: '状态',
                            prop: 'status_dictText'
                        },
                    ]
                },

                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                show: {
                    batch: false,
                },
                drawer: {
                    show: false,
                    direction: 'right',
                    draggable: true,
                    showFooter : true,
                    loading : false,
                    data: {}
                },
                component: {
                    type: Modify,
                    ref : 'modify',
                    data: {}
                },
                dialog: {
                    width: 300,
                    height: 300,
                    name: 'addUserHas',
                    showFooter: true
                },
                user: {
                    ref: 'user',
                    data: {}
                }
            }
        },
        watch: {
            userInfo: {
                handler(props) {
                    if (!isEmpty(props)) {
                        this.queryList()
                    }
                },
                immediate: true
            },
        },
        methods: {
            ...mapActions({
                getSex: 'GET_SEX',
                getUserStatus: 'GET_USER_STATUS',
                getAllRoles: 'GET_ALL_ROLES',
                getAllDept: 'GET_ALL_DEPT',
                getActivitySync: 'GET_ACTIVITY_SYNC',
            }),
            addUser() {
                let {id} = this.userInfo
                if (!id) {
                    sweetAlert.warnWithTimer('请选择一个部门')
                    return
                }
                this.drawer = {
                    ...this.drawer,
                    title: '添加用户',
                    width: '500px',
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    data: {
                        deptId: id
                    }
                }
            },
            edit(row) {
                let {id} = this.userInfo
                this.drawer = {
                    ...this.drawer,
                    title: '修改用户',
                    width: '500px',
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    data: {
                        ...row,
                        deptId: id
                    }
                }
            },
            addUserHas() {
                let {id} = this.userInfo
                if (!id) {
                    sweetAlert.warnWithTimer('请选择一个部门')
                    return
                }
                let {name} = this.dialog
                this.$modal.show(name)
                this.dialog = {
                    ...this.dialog,
                    width: 90,
                    height: 96,
                    title: '添加已有用户'
                }
            },
            confirmAdd() {
                let {ref} = this.user
                let {id} = this.userInfo

                this.$refs[ref].saveData(id)
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
            },
            submit() {
                let {ref} = this.component
                let modifyRef = this.$refs[ref]
                modifyRef.$refs.modify.validate(valid => {
                    if (valid) {
                        this.drawer = {
                            ...this.drawer,
                            loading : true
                        }
                        modifyRef.commitData()
                    }
                })
                this.drawer = {
                    ...this.drawer,
                    loading: false
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
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm('删除', '确认要删除吗', this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(userIds) {
                let {id: depId} = this.userInfo
                let params = {
                    userIds,
                    depId
                }
                let {success, message} = await http.delete(apiList.sys_user_delete_batch_dept_user, params)
                if (success) {
                    sweetAlert.success(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async confirmDelete(userId, event,index) {
                let {id: depId} = this.userInfo
                let params = {
                    userId,
                    depId
                }
                let {success, message} = await http.delete(apiList.sys_user_delete_dept_user, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    event(index)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            closeFlush() {
                this.drawer = {
                    ...this.drawer,
                    show: false,
                }
                this.queryList()
            },
            handleSuccess() {
                let {name} = this.dialog
                this.$modal.hide(name)
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
                let {id} = this.userInfo
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    depId: id
                }
                let {success, result} = await http.get(apiList.sys_user_query_user_by_dept, params)
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
            this.getSex()
            this.getUserStatus()
            this.getAllRoles()
            this.getAllDept()
            this.getActivitySync()
        }
    }
</script>

<style scoped>

</style>