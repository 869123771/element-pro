<template>
    <div class="menu bg-white p-3 m-3">
        <el-row>
            <el-button plain type="primary" icon="el-icon-plus" @click="addMenu" v-has="'menu:add'">新增</el-button>
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
            <collapse :collapse-props="collapse">
                <div slot="collapse-title">
                    <span>菜单信息</span>
                </div>
                <div slot="collapse-content">
                    <fox-table
                            row-key="id"
                            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                            v-loading="table.loading"
                            :column="table.column"
                            :data="table.data"
                            @selection-change="selectionChange"
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
            <component :is="component.type" :ref="component.ref" :data="component.data"
                       @successClose="successClose"></component>
            <div slot = "footer" v-if = "drawer.showFooter">
                <div class="flex justify-end">
                    <popover-confirm @confirm="popoverConfirm" class="mx-2">
                        <div slot="popover-title">{{$t('common_sure_to_close_popover')}}</div>
                        <div slot="popover-content">
                            <el-button plain>{{$t('common_cancel')}}</el-button>
                        </div>
                    </popover-confirm>
                    <el-button :plain = "!isEdit" type = "primary"  @click="submit(true)" v-loading = "drawer.loading">{{$t('common_submit')}}</el-button>
                    <el-button type="primary" v-show = "!isEdit" @click = "continueAdd(false)" v-loading = "drawer.loading">继续添加</el-button>
                </div>
            </div>
        </slide-out>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import Collapse from '@/components/collapse/Collapse'
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
            Collapse,
            DragDialog,
            foxTable,
            PopoverConfirm
        },
        data() {
            return {
                collapse : {
                    name : 'menuInfo',
                },
                table: {
                    loading: false,
                    selection: [],
                    data: [],
                    column: [
                        {
                            type: 'selection',
                            width: 70
                        },
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
                            render: (h, {row}) => {
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
                            prop: 'operate',
                            render: (h, {row}) => {
                                let btnInfo = [
                                    {
                                        content: '修改',
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'menu:edit',
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
                                                permission: 'menu:detail',
                                                event: () => {
                                                    this.handleDetail(row)
                                                }
                                            },
                                            {
                                                content: '数据规则',
                                                className: '',
                                                popover: false,
                                                permission: 'menu:dataRule',
                                                event: () => {
                                                    this.handleDataRule(row)
                                                }
                                            },
                                            {
                                                content: '删除',
                                                className: '',
                                                popover: true,
                                                popText: '确定要删除吗',
                                                permission: 'menu:delete',
                                                event: (event,index) => {
                                                    this.confirmDeleteBatch(row.id,event,index)
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
                    direction: 'right',
                    showFooter : true,
                    loading : false
                },
                component: {
                    type: Modify,
                    ref: 'modify',
                    data: {}
                },
            }
        },
        computed: {
            ...mapState({
                menuType: ({dict}) => dict.menuType,
            }),
            isEdit(){
                return this.component.data.id
            }
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
                    width: '500px',
                    title: '新增',
                    showFooter: true,
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'add',
                    data: {}
                }
            },
            editMenu(row) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    width: '500px',
                    title: '修改',
                    showFooter: true,
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'update',
                    data: {
                        ...row
                    }
                }
            },
            handleDetail(row) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    width: '500px',
                    title: '详情',
                    showFooter: false,
                }
                this.component = {
                    ...this.component,
                    type: Read,
                    ref: 'read',
                    data: {
                        ...row
                    }
                }
            },
            handleDataRule(row) {
                this.drawer = {
                    ...this.drawer,
                    show: true,
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
            },
            popoverConfirm() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
            },
            submit(isClose) {
                let {ref} = this.component
                let modifyRef = this.$refs[ref]
                modifyRef.$refs.form.validate(valid => {
                    if (valid) {
                        this.drawer = {
                            ...this.dialog,
                            loading : true,
                            isClose
                        }
                        modifyRef.saveData()
                    }
                })
                this.drawer = {
                    ...this.drawer,
                    loading: false
                }
            },
            continueAdd(isClose){
                this.submit(isClose)
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_del'), this.confirmDeleteBatch, ids)
            },
            successClose() {
                let {isClose} = this.drawer
                debugger;
                if(isClose){
                    this.drawer = {
                        ...this.drawer,
                        show : false
                    }
                }
                this.queryList()
            },
            async confirmDeleteBatch(ids,event,index) {
                let {success, message} = await http.delete(apiList.sys_menu_delete_batch, {ids})
                if (success) {
                    if(typeof index === 'number'){
                        sweetAlert.successWithTimer(message)
                        event(index)
                    }else{
                        sweetAlert.success(message)
                    }
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