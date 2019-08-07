<template>
    <div class="m-3 p-3 bg-white">
        <el-row>
            <avue-form v-model="form.model" :option="form.option" ref="form">
                <template slot-scope="scope" slot="operBtn">
                    <div>
                        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                        <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                    </div>
                </template>
            </avue-form>
        </el-row>
        <el-row>
            <avue-crud
                    :data="table.data"
                    :option="table.option"
                    :page="page"
                    :table-loading="table.loading"
                    v-model="table.model"
                    @on-load="queryList"
                    @selection-change="selectionChange"
                    @current-change="currentChange"
            >
                <template slot="menuLeft">
                    <el-button plain type="primary" icon="el-icon-plus" @click="add">新增</el-button>
                    <el-button plain @click="customButton">
                        <span class="fa fa-fw fa-circle-o"></span>
                        <span>自定义按钮</span>
                    </el-button>
                    <el-button plain @click="customButton">
                        <span class="fa fa-fw fa-scribd"></span>
                        <span>js增强</span>
                    </el-button>
                    <el-button plain @click="customButton">
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
                </template>
                <template slot="oper" slot-scope="{row}">
                    <!-- <span class = "flex">
                          <span class="text-blue-500 text-base cursor-pointer">
                             <i class="fa fa-fw fa-pencil" @click="edit(row)"></i>
                         </span>
                         <span class="text-blue-500 text-base cursor-pointer px-1">
                              <popover-confirm @confirm="deleteOne(row.id)">
                                 <div slot="popover-content">
                                    <i slot="reference" class="iconfont icon-wy-delete2"></i>
                                 </div>
                             </popover-confirm>
                         </span>
                         <template v-if = "row.isDbSynch === 'Y'">
                             <span class="text-blue-500 text-base cursor-pointer px-1">
                             <el-tooltip content = "配置地址" placement="top">
                                 <i class = "fa fa-fw fa-location-arrow"></i>
                             </el-tooltip>
                         </span>
                          <span class="text-blue-500 text-base cursor-pointer px-1">
                             <el-tooltip content = "功能测试" placement="top">
                                 <i class = "fa fa-fw fa-bug"></i>
                             </el-tooltip>
                         </span>
                         </template>
                         <template v-else>
                             <span class="text-blue-500 text-base cursor-pointer px-1">
                             <el-tooltip content = "同步数据库" placement="top">
                                 <i class = "fa fa-fw fa-exchange"></i>
                             </el-tooltip>
                         </span>
                         </template>
                     </span>-->
                    <pop-dropdown
                            :pop-dropdown-props="row"
                            @edit="()=>edit(row)"
                            @functionalTest="()=>functionalTest(row)"
                            @addressConfig="()=>addressConfig(row)"
                            @handleRemove = "()=>handleRemove(row)"
                            @handleDel="()=>handleDel(row)"
                            @syncDb = "()=>syncDb(row)"
                    ></pop-dropdown>
                </template>
                <template slot="isDbSynch" slot-scope="{row}">
                    <div v-if="row.isDbSynch === 'Y'" class="text-green-500">已同步</div>
                    <div v-else class="text-red-500">未同步</div>
                </template>
            </avue-crud>
        </el-row>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component
                    :is="component.is"
                    :ref="component.ref"
                    :data="component.data"
                    @closeDialog="closeDialog"></component>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import PopoverConfirm from '@/components/popoverConfirm'
    import DragDialog from '@/components/dragDialog'
    import PopDropdown from './onlineForm/PopDropdown'
    import Modify from './onlineForm/Modify'

    export default {
        name: "OnlCgformHeadList",
        components: {
            PopoverConfirm,
            DragDialog,
            PopDropdown
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
                                label: '表名',
                                prop: 'tableName',
                                span: 6
                            },
                            {
                                label: '表类型',
                                prop: 'tableType',
                                type: 'select',
                                props: {
                                    label: 'itemText',
                                    value: 'itemValue'
                                },
                                span: 6
                            },
                            {
                                prop: 'operBtn',
                                labelWidth: 20,
                                formslot: true,
                                span: 6
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
                        column: [
                            {
                                label: '操作',
                                prop: 'oper',
                                slot: true,
                                width: 80
                            },
                            {
                                label: '表类型',
                                prop: 'tableType',
                                overHidden: true,
                                formatter: (row, value, label, column) => {
                                    if(this.formTableType.length){
                                        return this.formTableType.find(item => item.itemValue === value.toString()).itemText
                                    }
                                }
                            },
                            {
                                label: '表名',
                                prop: 'tableName',
                                overHidden: true
                            },
                            {
                                label: '表描述',
                                prop: 'tableTxt',
                                overHidden: true
                            },
                            {
                                label: '版本',
                                prop: 'tableVersion',
                                overHidden: true
                            },
                            {
                                label: '同步数据库状态',
                                prop: 'isDbSynch',
                                slot: true
                            },
                        ]
                    },
                    model: {},
                    loading: false,
                },
                page: {
                    currentPage: 1,
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
            formTableType(datas) {
                this.$refs.form.updateDic('tableType', datas)
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
                this.$refs.form.resetForm()
            },
            add() {

            },
            customButton() {

            },
            edit(row) {
                this.dialog = {
                    ...this.dialog,
                    title: '修改',
                    width : 90,
                    height : 90,
                    name : 'update'
                }
                this.component = {
                    ...this.component,
                    is : Modify,
                    ref : 'modify',
                    data: {
                        ...row,
                    }
                }
                let {name} = this.dialog
                this.$nextTick(()=>{
                    this.$modal.show(name)
                })
            },
            functionalTest(scope) {
                debugger;
            },
            addressConfig(scope) {

            },
            confirm(){

            },
            closeDialog(){

            },
            async handleRemove({id}){
                let {success, message} = await http.delete(apiList.online_form_head_remove, {id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async handleDel({id}){
                let {success, message} = await http.delete(apiList.online_form_head_delete, {id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            syncDb(scope){
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
                let {currentPage: pageNo, pageSize} = this.page
                let {model} = this.form
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...model,
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
        },
        created() {

        },
        mounted() {
            this.getFormTableType()
        }
    }
</script>

<style scoped>

</style>