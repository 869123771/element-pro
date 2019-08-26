<template>
    <div class = "button">
        <el-row class = "mb-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add">
                {{$t('common_add')}}
            </el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row>
            <fox-table
                    v-if="table.show"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="table.data"
                    pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-count="10"
                    :current-page.sync="page.currentPage"
                    :total="page.total"
                    :page-size="page.pageSize"
                    @size-change="sizeChange"
                    @p-current-change="currentChange"
                    @selection-change="selection"
            >
            </fox-table>
        </el-row>
        <drag-drawer v-model="drawer.show"
                     :draggable="drawer.draggable"
                     :title="drawer.title"
                     :width.sync="drawer.width"
                     :direction="drawer.direction"
                     :scrollable="true"
        >

            <component :ref="component.ref" :is="component.type" :data="component.data"
                       @closeFlush="closeFlush"></component>
            <div class="dialog-footer p-2 w-full" v-show="drawer.showFooter">
                <div class="flex justify-end">
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
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'
    import DragDrawer from '@/components/dragDrawer'
    import PopoverConfirm from '@/components/popoverConfirm'
    import Modify from './customButton/Modify'

    export default {
        name: "CustomButtom",
        components : {
            foxTable,
            DragDrawer,
            PopoverConfirm
        },
        props : {
            data : {
                type : Object
            }
        },
        data(){
            return {
                show: {
                    batch: false,
                },
                table: {
                    column: [],
                    data: [],
                    selection: [],
                    loading: false,
                    show: true
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                drawer: {
                    show: false,
                    direction: 'rtl',
                    draggable: true,
                    showFooter: true,
                    data: {}
                },
                component: {
                    type: Modify,
                    ref: 'add',
                    data: {}
                },
            }
        },
        methods : {
            add(){
                this.drawer = {
                    ...this.drawer,
                    title: '新增',
                    width: '500px',
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'add',
                    data: {
                        cgformHeadId : this.data.id
                    }
                }
            },
            edit(row){
                this.drawer = {
                    ...this.drawer,
                    title: '编辑',
                    width: '500px',
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'edit',
                    data: {
                        cgformHeadId : this.data.id,
                        ...row,
                    }
                }
            },
            deleteBatch(){

            },
            closeFlush(){
                this.drawer = {
                    ...this.drawer,
                    show: false,
                }
                this.queryList()
            },
            popoverConfirm(){
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
            },
            submit(){
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
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {id} = this.data
                let {pageSize, currentPage: pageNo} = this.page
                let params = {
                    pageSize,
                    pageNo
                }
                let {success, result: {total, records: data}} = await http.get(apiList.online_form_button_custom_query + id, params)
                if (success) {
                    this.table = {
                        ...this.table,
                        loading: false,
                        data
                    }
                    this.page = {
                        ...this.page,
                        total
                    }
                }
            },
            setI18n(){
                this.table = {
                    ...this.table,
                    show: false,
                    column: [
                        {type: 'selection', fixed: true},
                        {
                            label: this.$t('common_operate'),
                            prop: 'oper',
                            width: '100',
                            fixed : true,
                            render: (h, {row, $index}) => {
                                let btnInfo = [
                                    {
                                        content : this.$t('common_edit'),
                                        className: 'fa fa -fw fa-pencil',
                                        permission: 'onlineForm:customButton:edit',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        content: this.$t('common_delete'),
                                        popover: true,
                                        popText: this.$t('common_confirm_del'),
                                        className: 'iconfont icon-wy-delete2',
                                        permission: 'onlineForm:customButton:delete',
                                        event: () => {
                                            this.confirmDelete(row.id, $index)
                                        }
                                    },
                                ]
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>
                                )
                            }
                        },
                        {
                            label: '按钮编码',
                            prop: 'buttonCode',
                        },
                        {
                            label: '按钮名称',
                            prop: 'buttonName',
                        },
                        {
                            label: '按钮样式',
                            prop: 'buttonStyle',
                        },
                        {
                            label: '按钮名称',
                            prop: 'buttonName',
                        },
                        {
                            label: '按钮类型',
                            prop: 'optType',
                        },
                        {
                            label: '排序',
                            prop: 'orderNum',
                        },
                        {
                            label: '按钮图标',
                            prop: 'buttonIcon',
                        },
                        {
                            label: '表达式',
                            prop: 'exp',
                        },
                        {
                            label: '按钮状态',
                            prop: 'buttonStatus',
                        },
                    ]
                }
                this.$nextTick(() => {
                    this.table = {
                        ...this.table,
                        show: true
                    }
                })
            },
        },
        created(){
            this.setI18n()
        },
        mounted(){
            this.queryList()
        }
    }
</script>

<style scoped>

</style>