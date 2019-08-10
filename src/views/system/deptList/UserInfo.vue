<template>
    <div class = "role-maintenance">
        <vxe-grid
                border
                show-overflow
                class="vxe-table-element"
                height="460"
                :loading="table.loading"
                :data.sync="table.data"
                :columns="table.column"
        >
        </vxe-grid>

        <!--<avue-crud
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
        </avue-crud>-->
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
        name: "UserInfo",
        props : {
            userInfo : {
                type : Object
            },
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
                /*table: {
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
                },*/

               table : {
                   loading: false,
                   selection: [],
                   data: [
                       {}
                   ],
                   column: [
                       { type: 'selection', width: 60 },
                       { type: 'index', title: 'Number', width: 80 },
                       { field: 'name', title: 'ElInput', minWidth: 140, editRender: { name: 'ElInput' } },
                       { field: 'role', title: 'ElAutocomplete', width: 160, },
                       { field: 'age', title: 'ElInputNumber', width: 160, },
                       { field: 'sex', title: 'ElSelect', width: 140, editRender: { name: 'ElSelect', options: [] } },
                       { field: 'sex1', title: 'ElSelect', width: 160, },
                       { field: 'sex2', title: 'ElSelect', width: 140, },
                       { field: 'region', title: 'ElCascader', width: 200},
                       { field: 'date', title: 'ElDatePicker', width: 200},
                       { field: 'date1', title: 'DateTimePicker', width: 220 },
                       { field: 'date5', title: 'ElTimeSelect', width: 200 },
                       { field: 'flag', title: 'ElSwitch', width: 100},
                       { field: 'rate', title: 'ElRate', width: 200}
                   ],
                   restaurants: [
                       { value: '前端', name: '前端' },
                       { value: '后端', name: '后端' },
                       { value: '开发', name: '开发' },
                       { value: '测试', name: '测试' }
                   ]
               },



                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                show : {
                    batch : false,
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
            userInfo : {
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
                let {id} = this.userInfo
                if(!id){
                    sweetAlert.warnWithTimer('请选择一个部门')
                    return
                }
                this.drawer = {
                    ...this.drawer,
                    title: '添加用户',
                    width: 500,
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    data: {
                        deptId : id
                    }
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
                let {id} = this.userInfo
                if(!id){
                    sweetAlert.warnWithTimer('请选择一个部门')
                    return
                }
                let {name} = this.dialog
                this.$modal.show(name)
                this.dialog = {
                    ...this.dialog,
                    width : 70,
                    height : 85,
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
                let {id : depId} = this.userInfo
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
            async confirmDelete(userId) {
                let {id : depId} = this.userInfo
                let params = {
                    userId,
                    depId
                }
                let {success, message} = await http.delete(apiList.sys_user_delete_dept_user, params)
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
                let {id} = this.userInfo
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    depId : id
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