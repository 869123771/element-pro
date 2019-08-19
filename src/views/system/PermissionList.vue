<template>
    <div class="menu bg-white p-3 m-3">
        <el-row>
            <el-button plain type="primary" icon="el-icon-plus" @click="addMenu">新增</el-button>
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
                    align="center"
                    row-key="id"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="table.data"
                    @selection-change="selectionChange"
            >
            </fox-table>
        </el-row>

        <drag-drawer v-model="drawer.show"
                     :draggable="drawer.draggable"
                     :title="drawer.title"
                     :width.sync="drawer.width"
                     :direction="drawer.direction"
        >
            <component :is="component.type" :ref="component.ref" :data="component.data"
                       @successClose="successClose"></component>
            <div class="dialog-footer p-2 w-full flex justify-end" v-if="component.showFooter">
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

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDrawer from '@/components/dragDrawer'
    import DragDialog from '@/components/dragDialog'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'
    import Modify from './menuList/Modify'
    import Read from './menuList/Read'
    import DataRule from './menuList/DataRule'
    import PopoverConfirm from '@/components/popoverConfirm'

    export default {
        name: "PermissionList",
        components: {
            DragDrawer,
            DragDialog,
            foxTable,
            PopoverConfirm
        },
        data() {
            return {
                table: {
                    loading: false,
                    selection: [],
                    data: [],
                    column: [
                        {
                            type: 'index',
                            width: 70
                        },
                        {
                            label: '菜单名称',
                            prop: 'name',
                            headerAlign: 'center',
                            align: 'left',
                        },
                        {
                            label: '菜单类型',
                            prop: 'menuType',
                            render: (h, {row, $index, column}) => {
                                let {menuType} = row
                                return (
                                    <span>
                                        {
                                            this.menuType.length ? this.menuType.find(item => item.itemValue === menuType.toString()).itemText : ''
                                        }
                                    </span>
                                )

                            }
                        },
                        {
                            label: '图标',
                            prop: 'icon',
                            showOverflowTooltip: true
                        },
                        {
                            label: '组件',
                            prop: 'component',
                            showOverflowTooltip: true
                        },
                        {
                            label: '路径',
                            prop: 'url',
                            showOverflowTooltip: true
                        },
                        {
                            label: '排序',
                            prop: 'sortNo',
                            width: 70
                        },
                        {
                            label: '操作',
                            width: 80,
                            prop: 'oper',
                            render: (h, {row, $index}) => {
                                let btnInfo = [
                                    {
                                        content: '修改',
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'menu:table:update',
                                        event: () => {
                                            this.editMenu(row)
                                        }
                                    },
                                    {
                                        type: 'dropDown',
                                        className: 'fa fa-fw fa-ellipsis-h',
                                        dropDownItems: [
                                            {
                                                content: '详情',
                                                className: '',
                                                popover: false,
                                                event: () => {
                                                    this.handleDetail(row)
                                                }
                                            },
                                            {
                                                content: '数据规则',
                                                className: '',
                                                popover: false,
                                                event: () => {
                                                    this.handleDataRule(row)
                                                }
                                            },
                                            {
                                                content: '删除',
                                                className: '',
                                                popover: true,
                                                popText: '确定要删除吗',
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
                    ]
                },
                show: {
                    batch: false
                },
                drawer: {
                    show: false,
                    direction: 'rtl',
                    draggable: true,
                    data: {}
                },
                component: {
                    type: Modify,
                    ref: 'modify',
                    showFooter: true,
                    data: {}
                },
            }
        },
        computed: {
            ...mapState({
                menuType: ({dict}) => dict.menuType,
            })
        },
        methods: {
            ...mapActions({
                getMenuType: 'GET_MENU_TYPE',
                getAllMenus: 'GET_ALL_MENUS',
                getPermissionType: 'GET_PERMISSION_TYPE',
                getValidStatus: 'GET_VALID_STATUS',
                getPermissionList: 'GET_PERMISSION_LIST'
            }),
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
            addMenu() {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name: 'addMenu',
                    width: '500px',
                    title: '新增',
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'add',
                    showFooter: true,
                    data: {}
                }
                let {name} = this.drawer
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            editMenu(row) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name: 'updateMenu',
                    width: '500px',
                    title: '修改',
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'update',
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
            handleDetail(row) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name: 'readMenu',
                    width: '500px',
                    title: '详情',
                }
                this.component = {
                    ...this.component,
                    type: Read,
                    ref: 'read',
                    showFooter: false,
                    data: {
                        ...row
                    }
                }
                let {name} = this.drawer
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            handleDataRule(row) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    name: 'dataRule',
                    width: '600px',
                    title: '数据权限规则',
                }
                this.component = {
                    ...this.component,
                    type: DataRule,
                    ref: 'dataRule',
                    showFooter: false,
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
                    sweetAlert.success(message)
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
                    this.$nextTick(() => {
                        this.table = {
                            ...this.table,
                            data: result
                        }
                    })
                }
                this.table = {
                    ...this.table,
                    loading: false
                }
            },
        },
        created() {
            this.getMenuType()
            this.getPermissionType()
            this.getValidStatus()
        },
        mounted() {
            this.queryList()
        }
    }
</script>

<style scoped>

</style>