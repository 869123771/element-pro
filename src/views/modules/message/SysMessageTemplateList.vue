<template>
    <div class="announce bg-white p-3 m-3">
        <el-row>
            <el-form ref="form" :model="form" label-width="90px">
                <form-query @search="search" @reset="reset">
                    <template slot="show">
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                            <el-form-item label="模板CODE" prop="templateCode">
                                <el-input v-model="form.templateCode" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                            <el-form-item label="模板内容" prop="templateContent">
                                <el-input v-model="form.templateContent" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                            <el-form-item label="模板标题" prop="templateName">
                                <el-input v-model="form.templateName" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                    <template slot="hide">
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                            <el-form-item label="模版类型" prop="templateType">
                                <el-select v-model="form.templateType" clearable filterable class="w-full">
                                    <template v-for="{itemValue,itemText} in templateType">
                                        <el-option :value="itemValue" :label="itemText"></el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row>
            <el-button plain type="primary" icon="el-icon-plus" @click="add">{{$t('common_add')}}</el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    {{$t('common_batch_operate')}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>{{$t('common_delete')}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row class="my-3">
            <collapse :collapse-props="collapse">
                <div slot="collapse-title">
                    <span>模版管理</span>
                </div>
                <div slot="collapse-content">
                    <fox-table
                            ref = "table"
                            row-key = "id"
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
            <modify :data="modify.data" ref="modify" @modifySuccess="modifySuccess"></modify>
            <div slot = "footer" v-if = "drawer.showFooter">
                <div class="flex justify-end">
                    <popover-confirm @confirm="popoverConfirm" class="mx-2">
                        <div slot="popover-title">{{$t('common_sure_to_close_popover')}}</div>
                        <div slot="popover-content">
                            <el-button plain>{{$t('common_cancel')}}</el-button>
                        </div>
                    </popover-confirm>
                    <el-button type="primary" @click="submit" v-loading = "drawer.loading">{{$t('common_submit')}}</el-button>
                </div>
            </div>
        </slide-out>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component :is = "component.is" :data="component.data" :ref="component.ref" @testResult="testResult"></component>
        </drag-dialog>
        <file-upload :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {downloadFile} from '@/utils/modules/tools'
    import Collapse from '@/components/collapse/Collapse'
    import PopoverConfirm from '@/components/popoverConfirm'
    import Modify from './sysMessageTemplateList/Modify'
    import Test from './sysMessageTemplateList/Test'
    import FileUpload from '@/components/fileUpload'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'
    import FormQuery from '@/components/form/query'
    import DragDialog from '@/components/dragDialog'

    export default {
        name: "SysMessageTemplateList",
        components: {
            Collapse,
            FileUpload,
            PopoverConfirm,
            Modify,
            foxTable,
            FormQuery,
            DragDialog
        },
        data() {
            return {
                collapse : {
                    name : 'sysAnnounce',
                },
                form: {
                    templateCode: '',                                    //模版code
                    templateContent: '',                               //模版内容
                    templateName: '',                                    //模版标题
                    templateType: '',                                //模版类型
                },
                show: {
                    batch: false
                },
                dialog: {
                    width: 25,
                    height: 560,
                    name: 'test',
                    loading : false,
                    showFooter: true,
                },
                component : {
                    is : Test,
                    ref : 'test',
                    data : {}
                },
                table: {
                    data: [],
                    column: [],
                    loading: false,
                    show: false,
                    selection: []
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                drawer: {
                    show: false,
                    direction: 'right',
                    draggable: true,
                    width: 700,
                    showFooter : true,
                    loading : false,
                    data: {}
                },
                modify: {
                    data: {}
                },
                fileUpload: {
                    action: apiList.message_center_template_delete_import
                },
            }
        },
        computed: {
            ...mapState({
                templateType : ({dict}) => dict.templateType
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
                getTemplateType : 'GET_TEMPLATE_TYPE'
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
            add() {
                this.drawer = {
                    ...this.drawer,
                    show: true,
                    title: '新增',
                }
                this.modify = {
                    ...this.modify,
                    data: {}
                }
            },
            edit(row) {
                this.drawer = {
                    ...this.drawer,
                    title: '编辑',
                    show: true,
                }
                this.modify = {
                    ...this.modify,
                    data: {
                        ...row
                    }
                }
            },
            test(row){
                this.dialog = {
                    ...this.dialog,
                    title: '测试',
                    name: 'test',
                    loading : false,
                }
                this.component = {
                    ...this.component,
                    data: {...row}
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            testResult(result){
                if(result){
                    let {name} = this.dialog
                    this.queryList()
                    this.$modal.hide(name)
                }
                this.component = {
                    ...this.component,
                    loading : false
                }
            },
            confirm(){
                let {ref} = this.component
                let testRef = this.$refs[ref]
                this.dialog = {
                    ...this.dialog,
                    loading: true
                }
                testRef.testData()
            },
            submit() {
                let modifyRef = this.$refs.modify
                modifyRef.$refs.form.validate(valid => {
                    if (valid) {
                        this.dialog = {
                            ...this.dialog,
                            loading: true
                        }
                        modifyRef.saveData()
                    }
                })
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_do'), this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids,event,index) {
                let {success, message} = await http.delete(apiList.message_center_template_delete_batch, {ids})
                if (success) {
                    if(typeof index === 'number'){
                        sweetAlert.successWithTimer(message)
                        event(index)
                    }else{
                        sweetAlert.success(message)
                    }
                    this.queryList()
                } else {
                    sweetAlert.error(message)
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
            fileImport() {
                this.$modal.show('fileUpload')
            },
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.message_center_template_delete_export, params)
                downloadFile(data, filename)

            },
            modifySuccess() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
                this.queryList()
            },
            popoverConfirm() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
                this.popover = {
                    ...this.popover,
                    drawerCancel: false
                }
            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
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
                    ...this.form
                }
                let {success, result} = await http.get(apiList.message_center_template_query_list, params)
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
                }
                this.table = {
                    ...this.table,
                    loading: false
                }
            },
            setI18n() {
                this.table = {
                    ...this.table,
                    show: false,
                    column: [
                        {type : 'selection'},
                        {type : 'index'},
                        {
                            label: '操作',
                            prop: 'oper',
                            width: 80,
                            render: (h, {row}) => {
                                let btnInfo = [
                                    {
                                        content: this.$t('common_edit'),
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'messageTemplate:edit',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        type: 'dropDown',
                                        className: 'fa fa-fw fa-ellipsis-h',
                                        permission: 'role.grant',
                                        dropDownItems: [
                                            {
                                                content: '发送测试',
                                                className: '',
                                                permission: 'messageTemplate:test',
                                                popover: false,
                                                event: () => {
                                                    this.test(row)
                                                }
                                            },
                                            {
                                                content: '删除',
                                                className: '',
                                                popover: true,
                                                popText: '确定要删除吗',
                                                permission: 'messageTemplate:delete',
                                                event: (row,event,index) => {
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
                        {
                            label: '模板CODE',
                            prop: 'templateCode',
                        },
                        {
                            label: '模板标题',
                            prop: 'templateName',
                        },
                        {
                            label: '模板内容',
                            prop: 'templateContent'
                        },
                        {
                            label: '模板类型',
                            prop: 'templateType',
                            render : (h,{row:{templateType}})=>{
                                return (
                                    <span>{this.templateType.find(item=>item.itemValue === templateType).itemText}</span>
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
            this.getTemplateType()
        },
        mounted() {
            this.queryList()
        }
    }
</script>

<style scoped>

</style>