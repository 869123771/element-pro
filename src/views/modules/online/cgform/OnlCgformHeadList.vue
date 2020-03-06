<template>
    <div class="m-3 p-3 bg-white">
        <el-row>
            <el-form ref="form" :model="form" label-width="80px">
                <form-query @search="search" @reset="reset" :show-arrow = "false">
                    <template slot = "show">
                        <el-col  :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "12">
                            <el-form-item label="表名" prop="tableName">
                                <el-input v-model="form.tableName" placeholder="表名" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "12">
                            <el-form-item label="表类型" prop="tableType">
                                <el-select v-model="form.tableType" placeholder="表类型" clearable filterable class="w-full">
                                    <template v-for="item in formTableType">
                                        <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row class="pb-3">
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
            <el-button plain @click="importFormFromDb">
                <span class="fa fa-fw fa-database"></span>
                <span>从数据库导入表单</span>
            </el-button>
            <el-button plain @click="codeGenerate">
                <span class="fa fa-fw fa-code"></span>
                <span>代码生成</span>
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
                    :current-page.sync="page.pageNum"
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
                            @copyView = "copyView(row)"
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
    import FormQuery from '@/components/form/query'
    import foxTable from '@/components/fox-table/'
    import PopoverConfirm from '@/components/popoverConfirm'
    import DragDialog from '@/components/dragDialog'
    import PopDropdown from './onlineForm/PopDropdown'
    import Modify from './onlineForm/Modify'
    import CustomButtom from "./onlineForm/CustomButtom";
    import JsEnergize from './onlineForm/JsEnergize'
    import JavaEnergize from './onlineForm/JavaEnergize'
    import ImportForm from './onlineForm/ImportForm'
    import SyncDb from './onlineForm/SyncDb'
    import CodeGenerate from './onlineForm/CodeGenerate'
    import AddressConfig from './onlineForm/AddressConfig'

    let tableInfo = [
        {
            dbDefaultVal: "",
            dbFieldName: "id",
            dbFieldTxt: "主键",
            dbIsKey: 1,
            dbIsNull: "0",
            dbLength: "36",
            dbPointLength: "0",
            dbType: "string",
            dictField: "",
            dictTable: "",
            dictText: "",
            fieldExtendJson: "",
            fieldHref: "",
            fieldLength: "120",
            fieldMustInput: "0",
            fieldShowType: "text",
            fieldValueRuleCode: "",
            isQuery: "0",
            isShowForm: "0",
            isShowList: "0",
            mainField: "",
            mainTable: "",
            orderNum: "1",
            order_num: 0,
            queryMode: "single",
        },
        {
            dbDefaultVal: "",
            dbFieldName: "create_by",
            dbFieldTxt: "创建人",
            dbIsKey: 0,
            dbIsNull: "1",
            dbLength: "50",
            dbPointLength: "0",
            dbType: "string",
            dictField: "",
            dictTable: "",
            dictText: "",
            fieldExtendJson: "",
            fieldHref: "",
            fieldLength: "120",
            fieldMustInput: "0",
            fieldShowType: "text",
            fieldValueRuleCode: "",
            isQuery: "0",
            isShowForm: "0",
            isShowList: "0",
            mainField: "",
            mainTable: "",
            orderNum: "2",
            order_num: 1,
            queryMode: "single",
        },
        {
            dbDefaultVal: "",
            dbFieldName: "create_time",
            dbFieldTxt: "创建日期",
            dbIsKey: 0,
            dbIsNull: "1",
            dbLength: "20",
            dbPointLength: "0",
            dbType: "Date",
            dictField: "",
            dictTable: "",
            dictText: "",
            fieldExtendJson: "",
            fieldHref: "",
            fieldLength: "120",
            fieldMustInput: "0",
            fieldShowType: "datetime",
            fieldValueRuleCode: "",
            isQuery: "0",
            isShowForm: "0",
            isShowList: "0",
            mainField: "",
            mainTable: "",
            orderNum: "3",
            order_num: 2,
            queryMode: "single",
        },
        {
            dbDefaultVal: "",
            dbFieldName: "update_by",
            dbFieldTxt: "更新人",
            dbIsKey: 0,
            dbIsNull: "1",
            dbLength: "50",
            dbPointLength: "0",
            dbType: "string",
            dictField: "",
            dictTable: "",
            dictText: "",
            fieldExtendJson: "",
            fieldHref: "",
            fieldLength: "120",
            fieldMustInput: "0",
            fieldShowType: "text",
            fieldValueRuleCode: "",
            isQuery: "0",
            isShowForm: "0",
            isShowList: "0",
            mainField: "",
            mainTable: "",
            orderNum: "4",
            order_num: 3,
            queryMode: "single",
        },
        {
            dbDefaultVal: "",
            dbFieldName: "update_time",
            dbFieldTxt: "更新日期",
            dbIsKey: 0,
            dbIsNull: "1",
            dbLength: "20",
            dbPointLength: "0",
            dbType: "Date",
            dictField: "",
            dictTable: "",
            dictText: "",
            fieldExtendJson: "",
            fieldHref: "",
            fieldLength: "120",
            fieldMustInput: "0",
            fieldShowType: "datetime",
            fieldValueRuleCode: "",
            id: "15668933933735",
            isQuery: "0",
            isShowForm: "0",
            isShowList: "0",
            mainField: "",
            mainTable: "",
            orderNum: "5",
            order_num: 4,
            queryMode: "single",
        },
        {
            dbDefaultVal: "",
            dbFieldName: "sys_org_code",
            dbFieldTxt: "所属部门",
            dbIsKey: 0,
            dbIsNull: "1",
            dbLength: "64",
            dbPointLength: "0",
            dbType: "string",
            dictField: "",
            dictTable: "",
            dictText: "",
            fieldExtendJson: "",
            fieldHref: "",
            fieldLength: "120",
            fieldMustInput: "0",
            fieldShowType: "text",
            fieldValueRuleCode: "",
            isQuery: "0",
            isShowForm: "0",
            isShowList: "0",
            mainField: "",
            mainTable: "",
            orderNum: "6",
            order_num: 5,
            queryMode: "single",
        }
    ]

    let formInfo = {
        formCategory: "bdfl_include",
        idType: "UUID",
        queryMode: "single",
        themeTemplate : 'normal',
        formTemplate: "1",
        scroll : 0,
        isCheckbox: "N",
        isPage: "Y",
        isTree: "N",
        tableName: "",
        tableTxt: "",
        tableType: 1
    }

    export default {
        name: "OnlCgformHeadList",
        components: {
            FormQuery,
            foxTable,
            PopoverConfirm,
            DragDialog,
            PopDropdown
        },
        data() {
            return {
                form: {
                    copyType: 0
                },
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
                formTableType: ({dict}) => dict.formTableType,
                formCategory : ({dict}) => dict.formCategory,
                formTemplate : ({dict}) => dict.formTemplate,
                queryMode: ({dict}) => dict.queryMode,
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
                getFormCategory : 'GET_FORM_CATEGORY',
                getFormTemplate : 'GET_FORM_TEMPLATE',
                getQueryMode : 'GET_QUERY_MODE'
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
                this.dialog = {
                    title: '新增',
                    width: 90,
                    height: 100,
                    name: 'add',
                    showFooter: true,
                }
                this.component = {
                    ...this.component,
                    is: Modify,
                    ref: 'add',
                    data: {
                        formInfo,
                        tableInfo
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
                if (selection.length !== 1) {
                    sweetAlert.errorWithTimer('请选择一条记录')
                    flag = false
                }
                return flag
            },
            customButton() {
                let {selection} = this.table
                if (this.selectOne()) {
                    this.dialog = {
                        title: '自定义按钮',
                        width: 80,
                        height: 700,
                        name: 'customButton',
                        showFooter: false,
                    }
                    this.component = {
                        ...this.component,
                        is: CustomButtom,
                        ref: 'customButton',
                        data: selection[0]
                    }
                    let {name} = this.dialog
                    this.$nextTick(() => {
                        this.$modal.show(name)
                    })
                }
            },
            jsEnergize() {
                let {selection} = this.table
                if (this.selectOne()) {
                    this.dialog = {
                        title: 'JS增強',
                        width: 70,
                        height: 700,
                        name: 'jsEnergize',
                        showFooter: true,
                    }
                    this.component = {
                        ...this.component,
                        is: JsEnergize,
                        ref: 'jsEnergize',
                        data: selection[0]
                    }
                    let {name} = this.dialog
                    this.$nextTick(() => {
                        this.$modal.show(name)
                    })
                }
            },
            javaEnergize() {
                let {selection} = this.table
                if (this.selectOne()) {
                    this.dialog = {
                        title: 'Java增強',
                        width: 25,
                        height: 600,
                        name: 'javaEnergize',
                        showFooter: true,
                    }
                    this.component = {
                        ...this.component,
                        is: JavaEnergize,
                        ref: 'javaEnergize',
                        data: selection[0]
                    }
                    let {name} = this.dialog
                    this.$nextTick(() => {
                        this.$modal.show(name)
                    })
                }
            },
            importFormFromDb() {
                this.dialog = {
                    title: '从数据库导入表单',
                    width: 25,
                    height: 600,
                    name: 'importForm',
                    confirmText : '生成表单',
                    showFooter: true,
                }
                this.component = {
                    ...this.component,
                    is: ImportForm,
                    ref: 'importForm',
                    data: {}
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            codeGenerate(){
                let {selection} = this.table
                let [row] = selection
                if (this.selectOne()) {
                    if(!row.isDbSynch || row.isDbSynch === 'N'){
                        sweetAlert.errorWithTimer('请先同步数据库')
                        return
                    }
                    if(row.tableType === 3){
                        sweetAlert.errorWithTimer('请选中该表对应的主表生成代码')
                        return
                    }
                    else{
                        this.dialog = {
                            title: `代码生成<span class = "inline-block px-2 text-lg font-medium">[${row.tableName}]</span>`,
                            width: 30,
                            height: 700,
                            name: 'codeGenerate',
                            showFooter: true,
                        }
                        this.component = {
                            ...this.component,
                            is: CodeGenerate,
                            ref: 'codeGenerate',
                            data: row
                        }
                        let {name} = this.dialog
                        this.$nextTick(() => {
                            this.$modal.show(name)
                        })
                    }
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
                        height: 100,
                        name: 'update',
                        showFooter: true,
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
            functionalTest(row) {
                this.$router.push(`/online/cgformList/${row.id}`)
            },
            async copyView({id:code}){
                let params = {
                    code
                }
                let {success,message} = await http.post(apiList.online_form_head_copy_view, params,constant.QUERY_STRING)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            addressConfig(row) {
                this.dialog = {
                    title: `配置地址<span class = "inline-block px-2 text-lg font-medium">[${row.tableName}]</span>`,
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
            confirm() {
                let {ref} = this.component
                let modifyRef = this.$refs[ref]
                if (modifyRef.$refs.form) {
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
                } else {
                    modifyRef.saveData()
                }
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
            syncDb(row) {
                this.dialog = {
                    ...this.dialog,
                    title: '同步数据库',
                    width: 400,
                    height: 150,
                    name: 'syncDb',
                    showFooter: true,
                }
                this.component = {
                    ...this.component,
                    is: SyncDb,
                    ref: 'syncDb',
                    data: {...row}
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
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
        },
        mounted() {
            this.getFormTableType()
            this.getFormCategory()
            this.getFormTemplate()
            this.getQueryMode()
            this.queryList()
        }
    }
</script>

<style scoped>

</style>