<template>
    <div class = "p-3 m-3 bg-white">
        <el-row @keydown.enter.native = "queryList">
            <el-form ref="form" :model="form" label-width="90px">
                <form-query @search="search" @reset="reset" :show-arrow = "false">
                    <template slot = "show">
                        <el-col :xs = "24" :sm = "24" :md="12" :lg = "12" :xl = "12">
                            <el-form-item label="图表名称" prop="name">
                                <el-input v-model="form.name" placeholder="图表名称" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "24" :md="12" :lg = "12" :xl = "12">
                            <el-form-item label="编码" prop="code">
                                <el-input v-model="form.code" placeholder="编码" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row class="my-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add"> {{$t('common_add')}}</el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
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
            <collapse :collapse-props="collapse">
                <div slot="collapse-title">
                    <span>图表配置</span>
                </div>
                <div slot="collapse-content">
                    <fox-table
                            ref="table"
                            v-if="table.show"
                            v-loading="table.loading"
                            :column="table.column"
                            :data="table.data"
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
                        <template slot="oper" slot-scope="{scope:{row,$index}}">
                            <el-tooltip :content="$t('common_edit')" placement="top">
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-pencil" @click="edit(row)"></i>
                         </span>
                            </el-tooltip>
                            <el-dropdown placement="bottom" class="dropdown">
                      <span class="text-blue-500 text-base">
                          <i class="fa fa-fw fa-ellipsis-h"></i>
                      </span>
                                <el-dropdown-menu slot="dropdown">
                                    <template v-for="item in dropDownItem">
                                        <template v-if="item.popover">
                                            <popover-confirm @confirm="item.action(row,$index)">
                                                <div slot="popover-title">
                                                    <span>{{item.popText}}</span>
                                                </div>
                                                <div slot="popover-content">
                                                    <el-dropdown-item>{{item.label}}</el-dropdown-item>
                                                </div>
                                            </popover-confirm>
                                        </template>
                                        <template v-else>
                                            <el-dropdown-item @click.native="item.action(row)">
                                                {{item.label}}
                                            </el-dropdown-item>
                                        </template>
                                    </template>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </fox-table>
                </div>
            </collapse>
        </el-row>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component :is = "component.is" :ref = "component.ref" :data = "component.data" @modifySuccess = "modifySuccess" @modifyFail = "modifyFail"></component>
        </drag-dialog>
        <file-upload ref="fileUpload" :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'
    import FormQuery from '@/components/form/query'
    import FileUpload from '@/components/fileUpload'
    import {downloadFile} from '@/utils/modules/tools'
    import Collapse from '@/components/collapse/Collapse'
    import DragDialog from '@/components/dragDialog'
    import foxTable from '@/components/fox-table'
    import PopoverConfirm from '@/components/popoverConfirm'
    import Modify from "./onlGraphreportHeadList/Modify";
    import AddressConfig from "./onlGraphreportHeadList/AddressConfig";
    export default {
        name: "OnlGraphreportHeadList",
        components: {
            FormQuery,
            Collapse,
            DragDialog,
            foxTable,
            FileUpload,
            PopoverConfirm
        },
        data() {
            return {
                collapse : {
                    name : 'graphReport'
                },
                form: {},
                show: {
                    batch: false
                },
                dialog: {
                    width: 82,
                    height: 700,
                    name: 'add',
                    title: this.$t('common_add')
                },
                component : {
                    is : Modify,
                    ref : 'modify',
                    data : {}
                },
                dropDownItem: [
                    {
                        label: '配置地址',
                        icon: '',
                        action: this.configAddress,
                        popover: false,
                    },
                    {
                        label: '功能测试',
                        icon: '',
                        action: this.functionTest,
                        popover: false,
                    },
                    {
                        label: '删除',
                        icon: '',
                        action: this.handleDel,
                        popover: true,
                        popText: '确定要删除吗'
                    },
                ],
                fileUpload: {
                    action: apiList.online_graph_import
                },
                table: {
                    column: [],
                    data: [],
                    selection: [],
                    loading: false,
                    show: true
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        methods : {
            ...mapActions({
                getOnlineGraphType : 'GET_ONLINE_GRAPH_TYPE',
            }),
            search() {
                this.page = {
                    ...this.page,
                    pageNum: 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetFields()
            },
            fileImport() {
                this.$modal.show('fileUpload')
            },
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.online_graph_export, params)
                downloadFile(data, filename)
            },
            add() {
                this.dialog = {
                    ...this.dialog,
                    name: 'add',
                    width: 82,
                    height: 100,
                    title: this.$t('common_add'),
                    showFooter: true
                }
                this.component = {
                    ...this.component,
                    is : Modify,
                    ref : 'add',
                    data : {}
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            edit(row) {
                this.dialog = {
                    ...this.dialog,
                    name: 'edit',
                    width: 82,
                    height: 100,
                    title: this.$t('common_edit'),
                    showFooter: true
                }
                this.component = {
                    ...this.component,
                    is : Modify,
                    ref : 'edit',
                    data : row
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            configAddress(row) {
                this.dialog = {
                    title: `报表访问链接`,
                    width: 25,
                    height: 200,
                    minHeight : 200,
                    name: 'addressConf',
                    confirmText : '复制',
                    showFooter: true,
                }
                this.component = {
                    ...this.component,
                    is: AddressConfig,
                    ref: 'addressConfig',
                    data: {...row}
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
            },
            functionTest({id}) {
                this.$router.push('/online/graphreport/chart/' + id)
            },
            handleDel({id},index) {
                this.confirmDeleteBatch(id,index)
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_do'), this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids,index,event) {
                let {success, message} = await http.delete(apiList.online_graph_delete, {ids})
                if (success) {
                    if(typeof index === 'number'){
                        sweetAlert.successWithTimer(message)
                        if(event) event(index)
                    }else{
                        sweetAlert.success(message)
                    }
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            confirm(){
                let modifyRef = this.$refs[this.component.ref]
                if(modifyRef.$refs.form){
                    modifyRef.$refs.form.validate(valid => {
                        if (valid) {
                            this.dialog = {
                                ...this.dialog,
                                loading: true
                            }
                            modifyRef.saveData()
                        }
                    })
                }else{
                    modifyRef.saveData()
                }
            },
            modifySuccess(){
                this.closeLoading()
                this.closeModal()
                this.queryList()
            },
            modifyFail(){
                this.closeLoading()
            },
            closeModal(){
                let {name} = this.dialog
                this.$modal.hide(name)
            },
            closeLoading(){
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
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {pageSize, pageNum: pageNo} = this.page
                let params = {
                    ...this.form,
                    pageSize,
                    pageNo
                }
                let {success, result: {total, records: data}} = await http.get(apiList.online_graph_query_list, params)
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
                            label: this.$t('common_operate'),
                            prop: 'oper',
                            width: '100',
                            fixed: true,
                            slot: true
                        },
                        {
                            label: '字段名',
                            prop: 'name',
                        },
                        {
                            label: '编码',
                            prop: 'code',
                        },
                        {
                            label: '数据',
                            prop: 'cgrSql',
                        },
                        {label: 'Y轴文字段', prop: 'yaxisText'},
                        {label: 'X轴文字段', prop: 'xaxisField',},
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
        created(){
            this.setI18n()
        },
        mounted(){
            this.queryList()
            this.getOnlineGraphType()
        },
    }
</script>

<style scoped>

</style>