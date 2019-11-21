<template>
    <div class = "dict-category p-3 my-3 bg-white">
        <el-row class = "my-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add" v-has="'user:add'">
                {{$t('common_add')}}
            </el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    {{$t('common_batch_operate')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>{{$t('common_delete')}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row>
            <collapse :collapse-props="collapse">
                <div slot="collapse-title">
                    <span>字典分类信息</span>
                </div>
                <div slot="collapse-content">
                    <fox-table
                            v-if="table.show"
                            v-loading="table.loading"
                            :column="table.column"
                            :data="table.data"
                            row-key="id"
                            lazy
                            :load="load"
                            :tree-props="{hasChildren: 'hasChild'}"
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
                    >
                        <template slot="avatar" slot-scope="{scope}">
                            <el-image size="26" :src="getAvatarView(scope)"
                                      :preview-src-list="[getAvatarView(scope)]"
                            >
                                <div slot="error" class="cursor-pointer">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </template>
                    </fox-table>
                </div>
            </collapse>
        </el-row>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component :is = "component.is" :ref = "component.ref" :data = "component.data" @modifySuccess = "modifySuccess"></component>
        </drag-dialog>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import Collapse from '@/components/collapse/Collapse'
    import DragDialog from '@/components/dragDialog'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'
    import Modify from './sysCategoryList/Modify'

    export default {
        name: "SysCategoryList",
        components : {
            Collapse,
            DragDialog,
            foxTable,
            OperBtn,
            Modify
        },
        data(){
            return {
                collapse : {
                    name : 'dictCategoryInfo'
                },
                form : {

                },
                show : {
                    batch : false
                },
                table: {
                    show: true,
                    column: [],
                    data: [],
                    loading: false,
                    selection: []
                },
                page: {
                    background: true,
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                dialog: {
                    width: '24',
                    height: '500',
                    name: 'add',
                    title: this.$t('common_add')
                },
                component : {
                    is : Modify,
                    ref : 'modify',
                    data : {}
                },
            }
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods : {
            add(){
                this.dialog = {
                    ...this.dialog,
                    name: 'add',
                    title: this.$t('common_add'),
                    showFooter: true
                }
                this.component = {
                    ...this.component,
                    ref : 'add',
                    data : {}
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            edit(row){
                this.dialog = {
                    ...this.dialog,
                    name: 'add',
                    title: this.$t('common_edit'),
                    showFooter: true
                }
                this.component = {
                    ...this.component,
                    ref : 'edit',
                    data : row
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            async handleDel(row){
                let {success,message} = await http.delete(apiList.sys_dict_category_delete,{id:row.id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_del'), this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.sys_dict_category_deleteBatch, {ids})
                if (success) {
                    sweetAlert.success(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            confirm(){
                let modifyRef = this.$refs[this.component.ref]
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
            modifySuccess({pid}){
                let {name} = this.dialog
                this.$modal.hide(name)
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
            async load(tree, treeNode, resolve) {
                let {id} = tree
                let params = {
                    pid : id
                }
                let {success, result} = await http.get(apiList.sys_dict_category_query_child, params)
                if(success){
                    resolve(result)
                }
            },
            async queryList() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {pageSize, pageNum: pageNo} = this.page
                let params = {
                    ...this.form,
                    pageSize,
                    pageNo,
                }
                let {success, result: {total, records: data}} = await http.get(apiList.sys_dict_category_query_list, params)
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
            setI18n() {
                this.table = {
                    ...this.table,
                    show: false,
                    column: [
                        {type: 'selection', fixed: true},
                        {type: 'index', fixed: true},
                        {
                            label : this.$t('sys_dict_category_type_name'),
                            prop : 'name',
                            headerAlign: 'center',
                            align: 'left',
                        },
                        {
                            label : this.$t('sys_dict_category_type_code'),
                            prop : 'code'
                        },
                        {
                            label: this.$t('common_operate'),
                            width: 80,
                            prop: 'oper',
                            render: (h, {row, $index}) => {
                                let btnInfo = [
                                    {
                                        content: this.$t('common_edit'),
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'dictCategory:edit',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        content: this.$t('common_delete'),
                                        className: 'iconfont icon-wy-delete2',
                                        popover: true,
                                        popText: this.$t('common_confirm_del'),
                                        permission: 'dictCategory:delete',
                                        event: () => {
                                            this.handleDel(row)
                                        }
                                    }
                                ]
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>
                                )
                            }
                        },
                    ]
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