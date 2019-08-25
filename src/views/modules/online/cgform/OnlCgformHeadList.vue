<template>
    <div class="m-3 p-3 bg-white">
        <el-row>
            <el-form ref="form" :model="form" label-width="80px">
                <el-col :md="6" :sm="8">
                    <el-form-item label="表名" prop="tableName">
                        <el-input v-model="form.tableName" placeholder="表名" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <el-form-item label="表类型" prop="tableType">
                        <el-select v-model="form.tableType" placeholder="表类型" clearable filterable class="w-full">
                            <template v-for="item in formTableType">
                                <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8" class="px-3">
                    <el-button type="primary" icon="el-icon-search" @click="search">{{$t('common_query')}}</el-button>
                    <el-button plain icon="el-icon-refresh-left" @click="reset">{{$t('common_reset')}}</el-button>
                </el-col>
            </el-form>
        </el-row>
        <el-row class="my-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <el-button plain @click="customButton">
                <span class="fa fa-fw fa-circle-o"></span>
                <span>自定义按钮</span>
            </el-button>
            <el-button plain @click="jsEnergize">
                <span class="fa fa-fw fa-scribd"></span>
                <span>js增强</span>
            </el-button>
            <el-button plain @click="javaEnergize">
                <span class="fa fa-fw fa-coffee"></span>
                <span>java增强</span>
            </el-button>
            <el-button plain @click="customButton">
                <span class="fa fa-fw fa-database"></span>
                <span>从数据库导入表单</span>
            </el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>删除
                    </el-dropdown-item>
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
                <template slot="oper" slot-scope="{scope:{row}}">
                    <pop-dropdown
                            :pop-dropdown-props="row"
                            @edit="()=>edit(row)"
                            @functionalTest="()=>functionalTest(row)"
                            @addressConfig="()=>addressConfig(row)"
                            @handleRemove="()=>handleRemove(row)"
                            @handleDel="()=>handleDel(row)"
                            @syncDb="()=>syncDb(row)"
                    ></pop-dropdown>
                </template>
            </fox-table>
        </el-row>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component
                    :is="component.is"
                    :ref="component.ref"
                    :data="component.data"
                    @modifySuccess="modifySuccess"></component>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import foxTable from '@/components/fox-table/'
    import PopoverConfirm from '@/components/popoverConfirm'
    import DragDialog from '@/components/dragDialog'
    import PopDropdown from './onlineForm/PopDropdown'
    import Modify from './onlineForm/Modify'
    import CustomButtom from "./onlineForm/CustomButtom";

    export default {
        name: "OnlCgformHeadList",
        components: {
            foxTable,
            PopoverConfirm,
            DragDialog,
            PopDropdown
        },
        data() {
            return {
                form: {},
                table: {
                    data: [],
                    column: [],
                    show: true,
                    selection: [],
                    loading: false,
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                show: {
                    batch: false
                },
                dialog: {
                    width: '30',
                    height: '80',
                    title: '新增',
                    showFooter: true,
                },
                component: {
                    is: Modify,
                    ref: 'modify',
                    data: {}
                },
            }
        },
        computed: {
            ...mapState({
                formTableType: ({dict}) => dict.formTableType
            })
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods: {
            ...mapActions({
                getFormTableType: 'GET_FORM_TABLE_TYPE',
            }),
            search() {
                this.page = {
                    ...this.page,
                    currentPage: 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetFields()
            },
            add() {
                this.dialog = {
                    ...this.dialog,
                    title: '新增',
                    width: 90,
                    height: 90,
                    name: 'add'
                }
                this.component = {
                    ...this.component,
                    is: Modify,
                    ref: 'add',
                    data: {
                        formInfo: {},
                        tableInfo: []
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            selectOne() {
                let flag = true
                let {selection} = this.table
                if (!selection.length) {
                    sweetAlert.errorWithTimer('请选择一条记录')
                    flag = false
                }
                return flag
            },
            customButton() {
                if(this.selectOne()){
                    this.dialog = {
                        ...this.dialog,
                        title: '自定义按钮',
                        width: 90,
                        height: 90,
                        name: 'customButton'
                    }
                    this.component = {
                        ...this.component,
                        is: CustomButtom,
                        ref: 'customButton',
                        data: {

                        }
                    }
                    let {name} = this.dialog
                    this.$nextTick(() => {
                        this.$modal.show(name)
                    })
                }
            },
            jsEnergize() {
                if(this.selectOne()){

                }
            },
            javaEnergize() {
                if(this.selectOne()){

                }
            },
            async edit(row) {
                let {id} = row
                let {success, result} = await this.queryHeadInfoById(id)
                if (success) {
                    this.dialog = {
                        ...this.dialog,
                        title: '修改',
                        width: 90,
                        height: 90,
                        name: 'update'
                    }
                    this.component = {
                        ...this.component,
                        is: Modify,
                        ref: 'modify',
                        data: {
                            formInfo: {
                                ...row
                            },
                            tableInfo: result
                        }
                    }
                    let {name} = this.dialog
                    this.$nextTick(() => {
                        this.$modal.show(name)
                    })
                }
            },
            functionalTest(scope) {
            debugger;
            },
            addressConfig(scope) {

            },
            confirm() {
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
            async queryHeadInfoById(headId) {
                return await http.get(apiList.online_form_head_query_by_id, {headId})
            },
            async handleRemove({id}) {
                let {success, message} = await http.delete(apiList.online_form_head_remove, {id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async handleDel({id}) {
                let {success, message} = await http.delete(apiList.online_form_head_delete, {id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            syncDb(scope) {
            debugger;
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm('删除', '确认要删除吗', this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.online_form_head_delete_batch, {ids})
                if (success) {
                    sweetAlert.success(message)
                    this.queryList()
                    this.show = {
                        ...this.show,
                        batch: false
                    }
                } else {
                    sweetAlert.error(message)
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
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...this.form,
                }
                let {success, result: {records, total}} = await http.get(apiList.online_form_head_query_list, params)
                if (success) {
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
                        {type: 'selection'},
                        {type: 'index'},
                        {
                            label: '操作',
                            prop: 'oper',
                            slot: true,
                            width: 80
                        },
                        {
                            label: '表类型',
                            prop: 'tableType',
                            render: (h, {row: {tableType}}) => {
                                return (
                                    <span>
                                            {
                                                this.formTableType.filter(item => item.itemValue === tableType.toString()).map(item => item.itemText).join('')
                                            }
                                        </span>
                                )
                            }
                        },
                        {
                            label: '表名',
                            prop: 'tableName',
                        },
                        {
                            label: '表描述',
                            prop: 'tableTxt',
                        },
                        {
                            label: '版本',
                            prop: 'tableVersion',
                        },
                        {
                            label: '同步数据库状态',
                            prop: 'isDbSynch',
                            render: (h, {row: {isDbSynch}}) => {
                                return (
                                    <span>
                                        {
                                            isDbSynch === 'Y' ? <span class="text-green-500">已同步</span> :
                                                <span class="text-red-500">未同步</span>
                                        }
                                    </span>
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
            this.getFormTableType()
        },
        mounted() {
            this.queryList()
        }
    }
</script>

<style scoped>

</style>