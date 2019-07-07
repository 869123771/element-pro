<template>
    <div class = "role-maintenance">
        <avue-crud
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
                <el-button plain type="primary" icon="el-icon-plus" @click="addUser">用户录入</el-button>
                <el-button plain icon="iconfont icon-wy-upload" @click="addUserHas">添加已有用户</el-button>
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
                <span class = "flex justify-center">
                     <span class="text-blue-500 text-base cursor-pointer">
                        <i class="fa fa-fw fa-pencil" @click="edit(row)"></i>
                    </span>
                    <span class="text-blue-500 text-base cursor-pointer">
                        <popover-confirm @confirm="confirmDelete(row.id)">
                            <div slot="popover-content">
                                <i class="fa iconfont icon-wy-delete2"></i>
                            </div>
                        </popover-confirm>
                    </span>
                </span>
            </template>
        </avue-crud>
        <drag-drawer v-model="drawer.show"
                     :draggable="drawer.draggable"
                     :title="drawer.title"
                     :width.sync="drawer.width"
                     :placement="drawer.placement"
                     :scrollable="true"
        >
            <component :is="component.type" :data="component.data" @closeFlush="closeFlush"></component>
        </drag-drawer>
        <drag-dialog :drag-dialog="dialog" @confirm="confirmAdd">
            <add-user :ref = "user.ref" :data = "user.data" @handleSuccess = "handleSuccess"></add-user>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {http,apiList,sweetAlert,constant} from '@/utils'
    import DragDrawer from '@/components/dragDrawer'
    import DragDialog from '@/components/dragDialog'
    import Modify from '../userList/Modify'
    import AddUser from './AddUser'
    import PopoverConfirm from '@/components/popoverConfirm'

    export default {
        name: "RoleMaintenance",
        props : {
           data : {
               type : Object
           }
        },
        components : {
            DragDrawer,
            DragDialog,
            AddUser,
            PopoverConfirm
        },
        data(){
            let {table} = constant
            return {
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
                    loading: false,
                    selection: []
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                show : {
                    batch : false
                },
                drawer: {
                    show: false,
                    placement: 'right',
                    draggable: true,
                    data: {}
                },
                component: {
                    type: Modify,
                    data: {}
                },
                dialog: {
                    width: '300',
                    height: '300',
                    name: 'addUserHas',
                    showFooter : true
                },
                user : {
                    ref : 'user',
                    data : {}
                }
            }
        },
        watch : {
            data : {
                handler(props) {
                    if (!this.validatenull(props)) {
                        this.queryList()
                    }
                },
                immediate : true
            },
        },
        methods : {
            ...mapActions({
                getSex: 'GET_SEX',
                getUserStatus: 'GET_USER_STATUS',
                getAllRoles: 'GET_ALL_ROLES',
                getAllDepts: 'GET_ALL_DEPTS',
                getActivitiSync: 'GET_ACTIVIYI_SYNC',
            }),
            addUser() {
                this.drawer = {
                    ...this.drawer,
                    title: '添加用户',
                    width: 500,
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    data: {}
                }
            },
            edit(row) {
                this.drawer = {
                    ...this.drawer,
                    title: '修改用户',
                    width: 500,
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    data: row
                }
            },
            addUserHas(){
                let {name} = this.dialog
                this.$modal.show(name)
                this.dialog = {
                    ...this.dialog,
                    width : 70,
                    height : 80,
                    title: '添加已有用户'
                }
            },
            confirmAdd() {
                let {ref} = this.user
                let {id} = this.data

                this.$refs[ref].saveData(id)
                this.dialog = {
                    ...this.dialog,
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
            async confirmDeleteBatch(userIds){
                let {id : roleId} = this.data
                let params = {
                    userIds,
                    roleId
                }
                let {success, message} = await http.delete(apiList.sys_role_delete_batch_user_role, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async confirmDelete(userId) {
                let {id : roleId} = this.data
                let params = {
                    userId,
                    roleId
                }
                let {success, message} = await http.delete(apiList.sys_role_delete_user_role, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
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
            handleSuccess(){
                let {name} = this.dialog
                this.$modal.hide(name)
                this.queryList()
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
                let {id} = this.data
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    roleId : id
                }
                let {success, result} = await http.get(apiList.sys_user_query_user_by_role, params)
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
        mounted(){
            this.getSex()
            this.getUserStatus()
            this.getAllRoles()
            this.getAllDepts()
            this.getActivitiSync()
        }
    }
</script>

<style scoped>

</style>