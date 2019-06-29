<template>
    <div class="role">
        <el-row>
            <avue-form :option="form.option" v-model="form.model" ref="form">
                <template slot-scope="scope" slot="searchBtn">
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
                    @size-change="sizeChange"
                    @current-change="currentChange"
            >
                <template slot="menuLeft">
                    <el-button plain type="primary" icon="el-icon-plus" @click="addRole">新增</el-button>
                    <el-button plain icon="iconfont icon-upload" @click="fileImport">导入</el-button>
                    <el-button plain icon="iconfont icon-download" @click="fileExport">导出</el-button>
                </template>
                <template slot="oper" slot-scope="scope">
                    <span>
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-pencil" @click="edit(scope)"></i>
                        </span>
                        <el-dropdown placement="bottom" className="dropdown">
                            <span class="text-blue-500 text-base">
                              <i class="fa fa-fw fa-ellipsis-h"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="item in dropDownItem">
                                    <template v-if="item.popover">
                                        <el-popover placement="top" width="160"
                                                    v-model="item.visible"
                                        >
                                            <p class="pb-3">{{item.popText}}</p>
                                            <div class="text-right">
                                                <el-button size="mini" type="text" @click="item.visible = false">取消
                                                </el-button>
                                                <el-button type="primary" size="mini" @click="item.action">确定
                                                </el-button>
                                            </div>
                                            <el-dropdown-item slot="reference">{{item.label}}</el-dropdown-item>
                                        </el-popover>
                                    </template>
                                    <template v-else>
                                         <el-dropdown-item
                                                 @click="item.action">{{item.label}}</el-dropdown-item>
                                    </template>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </span>
                </template>
            </avue-crud>
        </el-row>
        <drag-dialog :drag-dialog="dialog" @confirm="confirmAdd">
            <modify ref="modify"></modify>
        </drag-dialog>
        <file-upload :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {downloadFile} from '@/utils/modules/tools'
    import DragDialog from '@/components/dragDialog'
    import FileUpload from '@/components/fileUpload'
    import Modify from './roleList/Modify'

    const uploadAction = () => {
        let {config: {baseUrl: {proxyURL}}} = constant
        return `${proxyURL + apiList.sys_role_import}`
    }

    export default {
        name: "RoleList",
        components: {
            DragDialog,
            FileUpload,
            Modify
        },
        data() {
            let {table} = constant
            return {
                form: {
                    option: {
                        menuBtn: false,
                        column: [
                            {
                                label: '名称',
                                prop: 'roleName',
                                span: 6,
                            },
                            {
                                label: "开始时间",
                                prop: 'createTime',
                                type: 'datetimerange',
                                span: 12,
                                startPlaceholder: '请输入开始时间',
                                endPlaceholder: '请输入结束时间',
                                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                            },
                            {
                                labelWidth: '0',
                                prop: 'searchBtn',
                                formslot: true,
                                span: 6,
                            }
                        ]
                    },
                    modal: {}
                },
                dropDownItem: [
                    {
                        label: '授权',
                        icon: '',
                        action: 'handleAuth',
                        popover: false,
                        visible: '',
                        popText: ''
                    },
                    {
                        label: '删除',
                        icon: '',
                        action: 'handleDel',
                        popover: true,
                        visible: false,
                        popText: '确定删除吗'
                    },
                ],
                table: {
                    data: [],
                    option: {
                        ...table,
                        column: [
                            {
                                label: '操作',
                                prop: 'oper',
                                slot: true,
                                width: 80
                            },
                            {
                                label: '角色名称',
                                prop: 'roleName'
                            },
                            {
                                label: '角色编码',
                                prop: 'roleCode'
                            },
                            {
                                label: '备注',
                                prop: 'description'
                            },
                            {
                                label: '创建时间',
                                prop: 'createTime'
                            },
                            {
                                label: '更新时间',
                                prop: 'updateTime'
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
                dialog: {
                    width: '24',
                    height: '46',
                    name: 'addRole',
                    showFooter: true,
                },
                fileUpload: {
                    action: uploadAction()
                },
            }
        },
        methods: {
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
            addRole() {
                this.$modal.show('addRole')
            },
            confirmAdd() {
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
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
            },
            fileImport() {
                this.$modal.show('fileUpload')
            },
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.sys_role_export, params)
                downloadFile(data, filename)

            },
            uploadSuccess() {

            },
            edit(scope){
                debugger;
            },
            handleDel(scope){
                debugger;
            },
            handleAuth(row){
                debugger;
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
                let {model: {createTime: [createTime_begin, createTime_end], ...res}} = this.form
                let {currentPage: pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...res,
                    createTime_begin,
                    createTime_end
                }
                let {success, result} = await http.get(apiList.sys_role_query_list, params)
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
        }
    }
</script>

<style scoped>

</style>