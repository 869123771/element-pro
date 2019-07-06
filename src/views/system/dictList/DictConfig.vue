<template>
    <div class="data-rule">
        <avue-form v-model="form.model" :option="form.option" ref="form">
            <template slot-scope="scope" slot="operBtn">
                <div class="text-center">
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                </div>
            </template>
        </avue-form>
        <avue-crud
                :data="table.data"
                :option="table.option"
                :page="page"
                :table-loading="table.loading"
                @on-load="queryList"
                @size-change="sizeChange"
                @current-change="currentChange"
        >
            <template slot="menuLeft">
                <el-button plain type="primary" icon="el-icon-plus" @click="addRule">新增</el-button>
            </template>
            <template slot="oper" slot-scope="{row}">
                    <span>
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-pencil" @click="edit(row)"></i>
                        </span>
                        <span class="text-blue-500 text-base cursor-pointer px-1">
                             <el-popover placement="top"
                                         width="160"
                                         :ref="row.id"
                             >
                                 <p class="pb-3">确定要删除吗</p>
                                 <div class="text-right">
                                    <el-button size="mini" type="text" @click="closePopover(row.id)">取消
                                    </el-button>
                                    <el-button type="primary" size="mini"
                                               @click="confirmDeleteBatch(row.id)">确定
                                    </el-button>
                                </div>
                                 <i slot="reference" class="iconfont icon-wy-delete2"></i>
                             </el-popover>
                        </span>
                    </span>
            </template>
        </avue-crud>
        <drag-dialog :drag-dialog="dialog" @confirm="confirmAdd">
           <modify :data="modify.data" ref="modify" @modifySuccess="modifySuccess"></modify>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import Modify from './dictConfig/Modify'

    export default {
        name: "DictConfig",
        props : {
            data : {
                type : Object
            }
        },
        components : {
            DragDialog,
            Modify
        },
        data() {
            let {table} = constant
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth: 70,
                        column: [
                            {
                                label: '名称',
                                prop: 'itemText',
                                span: 12
                            },
                            {
                                label: '状态',
                                type : 'select',
                                prop: 'status',
                                props : {
                                    label : 'itemText',
                                    value : 'itemValue'
                                },
                                span: 12
                            },
                            {
                                prop: 'operBtn',
                                formslot: true,
                                span: 24
                            }
                        ]
                    },
                    model: {}
                },
                table: {
                    data: [],
                    option: {
                        ...table,
                        index: false,
                        selection: false,
                        column: [
                            {
                                label: '操作',
                                prop: 'oper',
                                slot: true,
                                width: 80
                            },
                            {
                                label: '名称',
                                prop: 'itemText',
                                overHidden: true
                            },
                            {
                                label: '数据值',
                                prop: 'itemValue',
                                overHidden: true
                            },
                        ]
                    },
                    loading: false,
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                dialog: {
                    width: '24',
                    height: '52',
                    showFooter: true,
                },
                modify: {
                    data: {}
                },
            }
        },
        computed : {
            ...mapState({
                dictItemStatus : ({dict}) => dict.dictItemStatus
            })
        },
        watch : {
            dictItemStatus(data){
                this.$refs.form.updateDic('status', data)
            }
        },
        methods: {
            ...mapActions({
                getDictItemStatus : 'GET_DICT_ITEM_STATUS'
            }),
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
            closePopover(id){
                this.$refs[id].doClose();
            },
            addRule() {
                let {id} = this.data
                this.dialog = {
                    ...this.dialog,
                    title: '新增',
                    name: 'addRule',
                }
                this.modify = {
                    ...this.modify,
                    data: {
                        dictId: id
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            edit(row) {
                let {id} = this.data
                this.dialog = {
                    ...this.dialog,
                    title: '修改',
                    name: 'updateRule',
                }
                this.modify = {
                    ...this.modify,
                    data: {
                        dictId: id,
                        ...row
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            confirmAdd(){
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
            modifySuccess(){
                let {name} = this.dialog
                this.$modal.hide(name)
                this.queryList()
            },
            async confirmDeleteBatch(id) {
                let {success, message} = await http.delete(apiList.sys_dict_item_delete, {id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryList() {
                let {currentPage: pageNo, pageSize} = this.page
                let {model} = this.form
                let {id} = this.data
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...model,
                    dictId : id
                }
                let {success, result} = await http.get(apiList.sys_common_dict_item, params)
                if (success) {
                    let {total,records} = result
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
            this.getDictItemStatus()
        }
    }
</script>

<style scoped>

</style>