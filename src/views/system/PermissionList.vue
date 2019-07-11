<template>
    <div class="menu">
        <el-row>
            <avue-crud
                    :data="table.data"
                    :option="table.option"
                    :table-loading="table.loading"
                    v-model="table.model"
                    @on-load="queryList"
                    @selection-change="selectionChange"
            >
                <template slot="menuLeft">
                    <el-button plain type="primary" icon="el-icon-plus" @click="addMenu">新增</el-button>
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
                <template slot = "menuType" slot-scope = "{row}">
                    <div>
                        {{menuType.length ? menuType.find(item=>item.itemValue == row.menuType).itemText : ''}}
                    </div>
                </template>
                <template slot="oper" slot-scope="scope">
                    <span>
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-pencil" @click="editMenu(scope)"></i>
                        </span>
                        <el-dropdown placement="bottom" className="dropdown">
                            <span class="text-blue-500 text-base">
                              <i class="fa fa-fw fa-ellipsis-h"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="item in dropDownItem">
                                    <template v-if="item.popover">
                                        <popover-confirm @confirm = "item.action(scope)">
                                            <div slot="popover-content">
                                                <el-dropdown-item>{{item.label}}</el-dropdown-item>
                                            </div>
                                        </popover-confirm>
                                    </template>
                                    <template v-else>
                                         <el-dropdown-item
                                                 @click.native="()=>{item.action(scope)}">{{item.label}}</el-dropdown-item>
                                    </template>
                                </template>
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
                       @successClose="successClose"></component>
            <div class="dialog-footer p-2 w-full flex justify-end" v-if = "component.showFooter">
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

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDrawer from '@/components/dragDrawer'
    import DragDialog from '@/components/dragDialog'
    import Modify from './menuList/Modify'
    import Read from './menuList/Read'
    import DataRule from './menuList/DataRule'
    import PopoverConfirm from '@/components/popoverConfirm'

    export default {
        name: "PermissionList",
        components: {
            DragDrawer,
            DragDialog,
            PopoverConfirm
        },
        data() {
            let {table} = constant
            return {
                table: {
                    data: [],
                    option: {
                        ...table,
                        column: [
                            {
                                label: '菜单名称',
                                prop: 'name'
                            },
                            {
                                label: '菜单类型',
                                prop: 'menuType',
                                slot : true
                            },
                            {
                                label: '图标',
                                prop: 'icon'
                            },
                            {
                                label: '组件',
                                prop: 'component',
                                overHidden: true
                            },
                            {
                                label: '路径',
                                prop: 'url',
                                overHidden: true
                            },
                            {
                                label: '排序',
                                prop: 'sortNo',
                                width: 70
                            },
                            {
                                label: '操作',
                                prop: 'oper',
                                slot: true,
                                width: 80
                            },
                        ]
                    },
                    model: {},
                    loading: false,
                    selection: []
                },
                dropDownItem: [
                    {
                        label: '详情',
                        icon: '',
                        action: this.handleDetail,
                        popover: false,
                    },
                    {
                        label: '数据规则',
                        icon: '',
                        action: this.handleDataRule,
                        popover: false,
                    },
                    {
                        label: '删除',
                        icon: '',
                        action: this.handleDel,
                        popover: true,
                    },
                ],
                show: {
                    batch: false
                },
                drawer: {
                    show: false,
                    placement: 'right',
                    draggable: true,
                    data: {}
                },
                component: {
                    type: Modify,
                    ref: 'modify',
                    showFooter : true,
                    data: {}
                },
            }
        },
        computed : {
            ...mapState({
                menuType : ({dict}) => dict.menuType,
            })
        },
        methods: {
            ...mapActions({
                getMenuType : 'GET_MENU_TYPE',
                getAllMenus: 'GET_ALL_MENUS',
                getPermissionType : 'GET_PERMISSION_TYPE',
                getValidStatus : 'GET_VALID_STATUS',
                getPermissionList : 'GET_PERMISSION_LIST'
            }),
            selectionChange(selection) {
                debugger;
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
            addMenu() {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name : 'addMenu',
                    width: 500,
                    title: '新增',
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'add',
                    showFooter : true,
                    data: {}
                }
                let {name} = this.drawer
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            editMenu({row}) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name : 'updateMenu',
                    width: 500,
                    title: '修改',
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'update',
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
            handleDetail({row}) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name : 'readMenu',
                    width: 500,
                    title: '详情',
                }
                this.component = {
                    ...this.component,
                    type: Read,
                    ref: 'read',
                    showFooter : false,
                    data: {
                        ...row
                    }
                }
                let {name} = this.drawer
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            handleDataRule({row}) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name : 'dataRule',
                    width: 600,
                    title: '数据权限规则',
                }
                this.component = {
                    ...this.component,
                    type: DataRule,
                    ref: 'dataRule',
                    showFooter : false,
                    data: {
                        ...row
                    }
                }
                let {name} = this.drawer
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            handleDel({row}) {
                this.confirmDeleteBatch(row.id)
            },
            popoverConfirm() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
            },
            submit() {
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
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm('删除', '确认要删除吗', this.confirmDeleteBatch, ids)
            },
            successClose() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
                this.queryList()
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.sys_menu_delete_batch, {ids})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                    this.getPermissionList()                    //刷新菜单
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryList() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {success, result} = await this.getAllMenus()
                if (success) {
                    this.table = {
                        ...this.table,
                        data: result
                    }
                }
                this.table = {
                    ...this.table,
                    loading: false
                }
            },
        },
        created(){
            this.getMenuType()
            this.getPermissionType()
            this.getValidStatus()
        }
    }
</script>

<style scoped>

</style>