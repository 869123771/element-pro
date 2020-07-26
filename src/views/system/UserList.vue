<template>
    <div class="user bg-white p-3 m-3">
        <el-row @keydown.enter.native = "queryList">
            <el-form ref="form" :model="form" label-width="80px">
                <form-query @search="search" @reset="reset">
                    <template slot="show">
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "6">
                            <el-form-item :label="$t('sys_user_account')" prop="username">
                                <el-input v-model="form.username" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "6">
                            <el-form-item prop="workNo">
                                <div slot = "label" class = "truncate">
                                    <el-tooltip :content = "$t('sys_user_work_no')" placement="top">
                                        <span>{{$t('sys_user_work_no')}}</span>
                                    </el-tooltip>
                                </div>
                                <el-input v-model="form.workNo" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "6">
                            <el-form-item :label="$t('sys_user_sex')" prop="sex">
                                <el-select v-model="form.sex" clearable filterable class="w-full">
                                    <template v-for="{itemValue,itemText} in sex">
                                        <el-option :value="itemValue" :label="itemText"></el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>
                    <template slot="hide">
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "6">
                            <el-form-item :label="$t('sys_user_email')" prop="email">
                                <el-input v-model="form.email" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "6">
                            <el-form-item :label="$t('sys_user_phone')" prop="phone">
                                <el-input v-model="form.phone" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "6">
                            <el-form-item :label="$t('sys_user_status')" prop="status">
                                <el-select v-model="form.status" clearable filterable class="w-full">
                                    <template v-for="{itemValue,itemText} in userStatus">
                                        <el-option :value="itemValue" :label="itemText"></el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row class="my-3" type = "flex" justify="space-between" v-show = "!data">
            <div>
                <el-button plain type="primary" icon="el-icon-plus" @click="addUser" v-has="'user:add'" v-waves>
                    {{$t('sys_user_add')}}
                </el-button>
                <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
                <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
                <el-button plain icon="el-icon-search" @click="handleHighSearch">高级查询</el-button>
                <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                    <el-button plain>
                        {{$t('common_batch_operate')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="deleteBatch" v-has = "'user:delete'"><i class="el-icon-delete"></i>{{$t('common_delete')}}</el-dropdown-item>
                        <el-dropdown-item @click.native="frozen()" v-has = "'user:frozen'"><i class="el-icon-lock"></i>{{$t('sys_user_frozen')}}</el-dropdown-item>
                        <el-dropdown-item @click.native="frozen(1)"><i class="el-icon-unlock"></i>{{$t('sys_user_unfrozen')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <oper-menu @search = "queryList" @showColumn = "showColumn" :handle-menus = "table.handleMenus"></oper-menu>
        </el-row>
        <el-row>
            <collapse :collapse-props = "collapse">
                <div slot = "collapse-title">
                    <span>{{$t('sys_user_info')}}</span>
                </div>
                <div slot = "collapse-content">
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
        <slide-out :visible.sync="drawer.show"
                   :dock ="drawer.direction"
                   :title="drawer.title"
                   :size="drawer.width"
                   :close-on-mask-click = "false"
                   allow-resize
        >

            <component :ref="component.ref" :is="component.type" :data="component.data"
                       @closeFlush="closeFlush"></component>
            <div slot = "footer" v-if = "drawer.showFooter">
                <div class="flex justify-end">
                    <popover-confirm @confirm="popoverConfirm" class="mx-2">
                        <div slot="popover-title">{{$t('common_sure_to_close_popover')}}</div>
                        <div slot="popover-content">
                            <el-button plain>{{$t('common_cancel')}}</el-button>
                        </div>
                    </popover-confirm>
                    <el-button type="primary" @click="submit" :loading = "drawer.loading">{{$t('common_submit')}}</el-button>
                </div>
            </div>
        </slide-out>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <reset-pwd v-if="show.resetPwd" :reset-pwd="props.resetPwd" @change-pwd-ok="changePwdOk"></reset-pwd>
            <proxy-man-config
                    v-if="show.proxyManConfig"
                    :proxy-man="props.proxyMan"
                    ref="proxyMan"
                    @successClose="successClose"
            ></proxy-man-config>
        </drag-dialog>
        <file-upload ref="fileUpload" :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
        <high-search ref="highSearch" :high-search="highSearch" @superQuery = "superQuery"></high-search>
    </div>
</template>

<script>
    import DragDrawer from '@/components/dragDrawer'
    import DragDialog from '@/components/dragDialog'
    import FileUpload from '@/components/fileUpload'
    import FormQuery from '@/components/form/query'
    import {mapState, mapMutations,mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import list from '@/utils/modules/mixins/list'
    import HighSearch from "@/components/highSearch";
    import {downloadFile} from '@/utils/modules/tools'
    import foxTable from '@/components/fox-table'
    import Collapse from '@/components/collapse/Collapse'
    import Read from './userList/Read'
    import Modify from './userList/Modify'
    import ResetPwd from './userList/ResetPwd'
    import PopDropdown from './userList/PopDropdown'
    import PopoverConfirm from '@/components/popoverConfirm'
    import ProxyManConfig from './userList/ProxyManConfig'
    import OperMenu from "@/components/table/OperMenu";

    export default {
        name: "UserList",
        components: {
            HighSearch,
            OperMenu,
            DragDrawer,
            DragDialog,
            FileUpload,
            Collapse,
            FormQuery,
            foxTable,
            ResetPwd,
            PopDropdown,
            PopoverConfirm,
            ProxyManConfig,
        },
        props : {
            data : {
                type : Object
            }
        },
        mixins: [list],
        data() {
            return {
                form: {
                    username: '',
                    workNo : '',
                    sex: '',
                    email: '',
                    phone: '',
                    status: ''
                },
                show: {
                    batch: false,
                    resetPwd: false,
                    proxyManConfig: false,
                },
                collapse : {
                    name : 'userInfo'
                },
                highSearch: {
                    type: []
                },
                drawer: {
                    show: false,
                    direction: 'right',
                    width : '500px',
                    showFooter: true,
                    loading : false,
                },
                dialog: {
                    width: '300',
                    height: '300',
                    name: 'resetPwd',
                    loading : false,
                    title: this.$t('sys_user_reset_pwd')
                },
                fileUpload: {
                    action: apiList.sys_user_import
                },
                component: {
                    type: Read,
                    ref: 'read',
                    data: {}
                },
                props: {
                    resetPwd: {},
                    proxyMan: {}
                },
                table: {
                    column: [],
                    data: [],
                    selection: [],
                    handleMenus : [],
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
        computed: {
            ...mapState({
                sex: ({dict}) => dict.sex,
                userStatus: ({dict}) => dict.userStatus,
                identity : ({dict}) => dict.identity,
                dialogLoading : ({app}) => app.dialogLoading
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
                getSex: 'GET_SEX',
                getUserStatus: 'GET_USER_STATUS',
                getAllRoles: 'GET_ALL_ROLES',
                getAllDept: 'GET_ALL_DEPT',
                getActivitySync: 'GET_ACTIVITY_SYNC',
                getIdentity : 'GET_IDENTITY'
            }),
            closeFlush() {
                this.drawer = {
                    ...this.drawer,
                    show: false,
                    loading : false
                }
                this.queryList()
            },
            fileImport() {
                this.$modal.show('fileUpload')
            },
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.sys_user_export, params)
                downloadFile(data, filename)

            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.queryList()
            },
            getAvatarView({row: {avatar}}) {
                let {config: {baseUrl: {staticDomainURL}}} = constant
                return `${staticDomainURL}/${avatar}`
            },
            changePwdOk(row) {
                let {resetPwd: {index}} = this.props
                let {data} = this.table
                data[index] = {
                    ...row
                }
                this.table = {
                    ...this.table,
                    data
                }
                this.$modal.hide('resetPwd')
                this.show = {
                    ...this.show,
                    resetPwd: false
                }
            },
            handleHighSearch() {
                let {dialog: {name},getQueryConditions} = this.$refs.highSearch
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
                this.highSearch = {
                    ...this.highSearch,
                    type: [
                        {
                            label: this.$t('sys_user_account'),
                            prop: 'username',
                            type : 'input'
                        },
                        {
                            label: this.$t('sys_user_name'),
                            prop: 'realname',
                            type : 'input'
                        },
                        {
                            label: this.$t('sys_user_sex'),
                            prop: 'sex',
                            type : 'select',
                        },
                    ],
                    sex : this.sex
                }
                getQueryConditions()
            },
            superQuery({superQueryMatchType,superQueryParams}){
                debugger
                this.form = {
                    ...this.form,
                    superQueryMatchType,
                    superQueryParams
                }
                this.queryList()
            },
            addUser() {
                this.drawer = {
                    ...this.drawer,
                    title: this.$t('common_add'),
                    width: '500px',
                    loading : false,
                    showFooter: true,
                    show: true,
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'modify',
                    data: {}
                }
            },
            edit({row}) {
                this.drawer = {
                    ...this.drawer,
                    title: this.$t('common_edit'),
                    width: '500px',
                    loading : false,
                    showFooter: true,
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: Modify,
                    ref: 'modify',
                    data: row
                }
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_do'), this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.sys_user_deleteBatch, {ids})
                if (success) {
                    sweetAlert.success(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async frozen(scope) {
                let params = {}
                let {selection} = this.table
                if (scope) {
                    if (Number.isInteger(scope)) {
                        let ids = selection.map(item => item.id).join(',')
                        params = {
                            ...params,
                            ids,
                            status: 1                                                              //解冻
                        }
                    } else {
                        let {row: {id: ids, status}} = scope                                        //冻结单个
                        params = {
                            ...params,
                            ids,
                            status: 2
                        }
                    }

                } else {
                    let ids = selection.map(item => item.id).join(',')                                //冻结批量
                    params = {
                        ...params,
                        ids,
                        status: 2
                    }
                }
                let {success, message} = await http.put(apiList.sys_user_frozenBatch, params)
                if (success) {
                    sweetAlert.successWithTimer(message),
                        this.queryList()
                } else {
                    sweetAlert.error(message)
                }

            },
            proxyMan({row}) {
                this.dialog = {
                    ...this.dialog,
                    width: 600,
                    height: 360,
                    name: 'proxyConf',
                    title: this.$t('sys_user_proxy_man_conf'),
                    showFooter: true
                }
                this.show = {
                    ...this.show,
                    proxyManConfig: true,
                    resetPwd: false
                }
                this.props = {
                    ...this.props,
                    proxyMan: {
                        ...row
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            confirm() {
                let selectUserRef = this.$refs['proxyMan']
                selectUserRef.$refs.form.validate(valid => {
                    if (valid) {
                        this.drawer = {
                            ...this.drawer,
                            loading: true
                        }
                        selectUserRef.saveData()
                    }
                })
            },
            submit() {
                let {ref} = this.component
                let modifyRef = this.$refs[ref]
                modifyRef.$refs.modify.validate(valid => {
                    if (valid) {
                        this.drawer = {
                            ...this.drawer,
                            loading: true
                        }
                        modifyRef.commitData()
                    }
                })
            },
            successClose() {
                let {name} = this.dialog
                this.dialog = {
                    ...this.dialog,
                    loading : false
                }
                this.$modal.hide(name)
                this.queryList()
            },
            handleDetail({row}) {
                this.drawer = {
                    ...this.drawer,
                    width: '450px',
                    title: this.$t('common_read'),
                    showFooter: false,
                    show: true,
                }
                this.component = {
                    ...this.component,
                    type: Read,
                    ref: 'read',
                    data: row
                }
            },
            handlePwd({row, $index: index}) {
                this.dialog = {
                    ...this.dialog,
                    width: 300,
                    height: 316,
                    name: 'resetPwd',
                    title: this.$t('sys_user_reset_pwd'),
                    showFooter: false
                }
                this.show = {
                    ...this.show,
                    resetPwd: true,
                    proxyManConfig: false,
                }
                this.props = {
                    ...this.props,
                    resetPwd: {
                        index,
                        ...row
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })

            },
            async handleDel(scope) {
                let {row: {id}} = scope
                let {success, message} = await http.delete(apiList.sys_user_delete, {id})
                if (success) {
                    sweetAlert.successWithTimer(message),
                        this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            search() {
                this.page = {
                    ...this.page,
                    pageNum : 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetFields()
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
                let {success, result: {total, records: data}} = await http.get(apiList.sys_user_query_list, params)
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
                    this.$refs.table.rowDrop()
                }
            },
            showColumn(column){
                this.table = {
                    ...this.table,
                    column
                }
                this.table = {
                    ...this.table,
                    show: false
                }
                this.$nextTick(()=>{
                    this.table = {
                        ...this.table,
                        show: true
                    }
                })
            },
            setI18n() {
                let column = [
                    {type: 'selection', fixed: true},
                    {
                        label: this.$t('common_operate'),
                        prop: '',
                        width: '100',
                        fixed : true,
                        render: (h, scope) => {
                            return (
                                h(PopDropdown, {
                                    on: {
                                        edit: () => {
                                            this.edit(scope)
                                        },
                                        handleDetail: () => {
                                            this.handleDetail(scope)
                                        },
                                        handlePwd: () => {
                                            this.handlePwd(scope)
                                        },
                                        handleDel: () => {
                                            this.handleDel(scope)
                                        },
                                        frozen: () => {
                                            this.frozen(scope)
                                        },
                                        proxyMan: () => {
                                            this.proxyMan(scope)
                                        }
                                    }
                                })
                            )
                        },
                    },
                    {
                        label: this.$t('sys_user_account'),
                        prop: 'username',
                    },
                    {
                        label: this.$t('sys_user_work_no'),
                        prop: 'workNo',
                    },
                    {
                        label: this.$t('sys_user_work_name'),
                        prop: 'post',
                    },
                    {
                        label : this.$t('sys_user_department'),
                        prop : 'orgCode',
                    },
                    {
                        label : this.$t('sys_user_identity'),
                        prop : 'identity',
                        render : (h,{row:{identity}})=>{
                            return (
                                <span>{identity && this.identity ? this.identity.find(item=>item.itemValue === identity.toString()).itemText : ''}</span>
                            )
                        }
                    },
                    {
                        label: this.$t('sys_user_name'),
                        prop: 'realname',
                    },
                    {
                        label: this.$t('sys_user_avatar'),
                        width: '70',
                        prop: 'avatar',
                        slot: true,
                        render: (h, scope) => {
                            let imgPath = this.getAvatarView(scope)
                            return (
                                <el-image size={26} src={imgPath}
                                          preview-src-list={[imgPath]}
                                >
                                    <div slot="error" class="cursor-pointer">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                            )
                        }
                    },
                    {
                        label: this.$t('sys_user_sex'),
                        prop: 'sex_dictText',
                        width: '70'
                    },
                    {label: this.$t('sys_user_birthday'), prop: 'birthday'},
                    {label: this.$t('sys_user_phone'), prop: 'phone',},
                    {label: this.$t('sys_user_email'), prop: 'email',},
                    {
                        label: this.$t('sys_user_status'),
                        prop: 'status_dictText',
                        width: '70',
                    },
                    {
                        label : this.$t('common_create_time'),
                        prop : 'createTime',
                        width : 150,
                        sortable : true
                    },
                    {
                        label : this.$t('common_update_time'),
                        prop : 'updateTime',
                        width : 150,
                    }
                ]
                this.table = {
                    ...this.table,
                    show: false,
                    column,
                    handleMenus : column
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
            this.getSex()
            this.getUserStatus()
            this.getAllRoles()
            this.getAllDept()
            this.getActivitySync()
            this.getIdentity()
        }
    }
</script>

<style scoped lang="less">
    .user {
        .dropdown {
            padding: 0 10px;
        }
        /deep/ .cell {
            .el-image {
                height: 26px;
                width: 26px;
            }
        }
    }
</style>
