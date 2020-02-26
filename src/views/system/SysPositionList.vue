<template>
    <div class = "message bg-white p-3 m-3">
        <el-row>
            <el-form ref="form" :model="form" label-width="90px">
                <form-query @search="search" @reset="reset" :showArrow = "false">
                    <template slot = "show">
                        <el-col  :xs = "24" :sm = "24" :md="12" :lg = "8" :xl = "8">
                            <el-form-item label="职务编码" prop="code">
                                <el-input v-model="form.code" placeholder="职务编码" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "24" :md="12" :lg = "8" :xl = "8">
                            <el-form-item label="职务名称" prop="name">
                                <el-input v-model="form.name" placeholder="职务名称" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "24" :md="12" :lg = "8" :xl = "8">
                            <el-form-item label="职级" prop="rank">
                                <el-select v-model="form.postRank" clearable filterable class="w-full" placeholder="职级">
                                    <template v-for="{itemValue,itemText} in positionRank">
                                        <el-option :value="itemValue" :label="itemText"></el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row class = "pb-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add" v-has="'user:add'" v-waves>
                {{$t('common_add')}}
            </el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
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
            <collapse :collapse-props = "collapse">
                <div slot = "collapse-title">
                    <span>职务信息</span>
                </div>
                <div slot = "collapse-content">
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
                    <span>
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-eye" @click="read(row)"></i>
                        </span>
                    </span>
                        </template>
                    </fox-table>
                </div>
            </collapse>
        </el-row>
        <drag-dialog :drag-dialog="dialog"  @confirm="confirmAdd">
            <el-form ref="modify" :model="modify" label-width="90px" status-icon :rules = "rules">
                <el-form-item label = "职务编码" prop = "code" :rules = "[
                    {required : true, message : '必填',trigger : 'change'},
                    modify.id ? {} : {validator : uniqueCheck}
                ]">
                    <el-input v-model = "modify.code" placeholder = "职务编码" clearable></el-input>
                </el-form-item>
                <el-form-item label="职务名称" prop="name">
                    <el-input v-model="modify.name" placeholder="职务名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="职级" prop="postRank">
                    <el-select v-model="modify.postRank" clearable filterable class="w-full" placeholder="职级">
                        <template v-for="{itemValue,itemText} in positionRank">
                            <el-option :value="itemValue" :label="itemText"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
        </drag-dialog>
        <file-upload ref="fileUpload" :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import FormQuery from '@/components/form/query'
    import {downloadFile} from '@/utils/modules/tools'
    import Collapse from '@/components/collapse/Collapse'
    import DragDialog from '@/components/dragDialog'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'
    import FileUpload from '@/components/fileUpload'

    export default {
        name: "SysPositionList",
        components : {
            FormQuery,
            Collapse,
            DragDialog,
            foxTable,
            FileUpload
        },
        data(){
            return {
                form: {
                    code : '',                          //职务编码
                    name : '',                          //职务名称
                    postRank : '',                          //职级
                },
                modify : {
                    code : '',                          //职务编码
                    name : '',                          //职务名称
                    postRank : '',                          //职级
                },
                fileUpload: {
                    action: apiList.sys_position_import
                },
                rules : {
                    name : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                    postRank : [
                        {required : true, message : '必填', trigger : 'change'}
                    ]
                },
                collapse : {
                    name : 'rankInfo',
                },
                show : {
                    batch : false
                },
                table: {
                    data: [],
                    column : [],
                    show : true,
                    loading: false,
                    selection: []
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                dialog: {
                    width: 450,
                    minHeight : 280,
                    height: 300,
                    showFooter : true,
                },
            }
        },
        computed : {
            ...mapState({
                positionRank : ({dict}) => dict.positionRank,
            })
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods : {
            ...mapActions({
                getPositionRank : 'GET_POSITION_RANK',
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
            async uniqueCheck(rule, fieldVal, callback){
                let params = {
                    tableName : 'sys_position',
                    fieldName: 'code',
                    fieldVal,
                }
                let {success,message} = await http.get(apiList.sys_dict_unique_check,params)
                if(!success){
                    callback(new Error(message));
                }else{
                    callback();
                }
            },
            confirmAdd() {
                let modifyRef = this.$refs.modify
                modifyRef.validate(valid => {
                    if (valid) {
                        this.dialog = {
                            ...this.dialog,
                            loading: true
                        }
                        this.saveData()
                    }
                    this.dialog = {
                        ...this.dialog,
                        loading: false
                    }
                })
            },
            add(){
                this.dialog = {
                    ...this.dialog,
                    title : '新增',
                    name: 'add',
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
                this.resetFields()
            },
            edit(row){
                this.dialog = {
                    ...this.dialog,
                    title : '编辑',
                    name: 'edit',
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
                this.modify = {
                    ...row
                }
            },
            fileImport() {
                this.$modal.show('fileUpload')
            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
            },
            async saveData(){
                let {id} = this.modify
                let params = {
                    ...this.modify,
                }
                let res
                if (id) {                     //编辑
                    res = await http.put(apiList.sys_position_edit, params)
                } else {
                    res = await http.post(apiList.sys_position_add, params)
                }
                let {success, message} = res
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.modifySuccess()
                    this.resetFields()
                } else {
                    sweetAlert.error(message)
                }
            },
            resetFields(){
                this.modify = {}
                this.$refs.modify.resetFields()
            },
            modifySuccess() {
                let {name} = this.dialog
                this.$modal.hide(name)
                this.queryList()
            },
            async fileExport() {
                let params = {
                    ...this.form
                }
                let {data, filename} = await http.getFileDownload(apiList.sys_position_export, params)
                downloadFile(data, filename)
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_do'), this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids,event,index) {
                let {success, message} = await http.delete(apiList.sys_position_delete_batch, {ids})
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
                let {success, result} = await http.get(apiList.sys_position_query_list, params)
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
                        {
                            type : 'selection'
                        },
                        {
                            label: this.$t('common_operate'),
                            width: 80,
                            prop: 'oper',
                            render: (h, {row}) => {
                                let btnInfo = [
                                    {
                                        content: this.$t('common_edit'),
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'positionMgr:edit',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        content: this.$t('common_delete'),
                                        className: 'iconfont icon-wy-delete2',
                                        popover: true,
                                        popText: this.$t('common_confirm_do'),
                                        permission: 'positionMgr:delete',
                                        event: (event,index) => {
                                            this.confirmDeleteBatch(row.id,event,index)
                                        }
                                    }
                                ]
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>
                                )
                            }
                        },
                        {
                            label: '职务编码',
                            prop: 'code',
                        },
                        {
                            label: '职务名称',
                            prop: 'name',
                        },
                        {
                            label: '职级',
                            prop: 'postRank_dictText',
                        },
                        {
                            label: '创建人',
                            prop: 'createBy',
                        },
                        {
                            label: '创建时间',
                            prop: 'createTime',
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
        created(){
            this.setI18n()
            this.getPositionRank()
        },
        mounted(){
            this.queryList()
        }
    }
</script>

<style scoped>

</style>