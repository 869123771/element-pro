<template>
    <div class="user">
        <el-row>
            <el-form ref="form" :model="form" label-width="80px">
                <el-row>
                    <el-col :md="6" :sm="8">
                        <el-form-item label="账号:" prop="username">
                            <el-input v-model="form.username" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="8">
                        <el-form-item label="性别:" prop="sex">
                            <el-select v-model="form.sex" clearable filterable class="w-full">
                                <template v-for="item in sex">
                                    <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <div v-show="show.collapse">
                        <el-col :md="6" :sm="8">
                            <el-form-item label="邮箱:" prop="email">
                                <el-input v-model="form.email" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="8">
                            <el-form-item label="手机号码:" prop="phone">
                                <el-input v-model="form.phone" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="8">
                            <el-form-item label="状态:" prop="status">
                                <el-select v-model="form.status" clearable filterable class="w-full">
                                    <template v-for="item in userStatus">
                                        <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </div>
                    <el-col :md="6" :sm="8">
                        <el-form-item label-width="38px">
                            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                            <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                            <span class="cursor-pointer inline-block text-blue-500 pl-2" @click="arrowClick">
                            <span v-if="!show.collapse">
                                <span>展开</span>
                                <i class="el-icon-arrow-down pl-1"></i>
                            </span>
                            <span v-else>
                                <span>收起</span>
                                <i class="el-icon-arrow-up pl-1"></i>
                            </span>
                        </span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-row>
        <el-row class="my-3">
            <el-button plain icon="iconfont icon-upload">导入</el-button>
            <el-button plain icon="iconfont icon-download">导出</el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><i class="el-icon-delete"></i>删除</el-dropdown-item>
                    <el-dropdown-item><i class="el-icon-lock"></i>冻结</el-dropdown-item>
                    <el-dropdown-item><i class="el-icon-unlock"></i>解冻</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row>
            <lb-table
                    border
                    stripe
                    fit
                    align="center"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="table.data"
                    pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[5, 10, 20, 30]"
                    :pager-count="5"
                    :current-page.sync="page.currentPage"
                    :total="page.total"
                    :page-size="page.pageSize"
                    @size-change="handleSizeChange"
                    @p-current-change="handleCurrentChange"
                    @selection-change="checked"
            ></lb-table>
        </el-row>
        <avue-drawer show-close :title="drawer.title" :width="drawer.width" v-model="drawer.show"
                     :close-on-click-modal="false">
            <avue-detail :option="detail.option" v-model="detail.model"></avue-detail>
            <avue-form :option="aForm.option" v-model="aForm.model"></avue-form>
        </avue-drawer>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant} from '@/utils'
    import lbTable from '@/components/lb-table/lb-table'

    export default {
        name: "UserList",
        components: {
            lbTable
        },
        data() {
            return {
                form: {
                    username: '',
                    sex: '',
                    email: '',
                    phone: '',
                    status: ''
                },
                show: {
                    collapse: false,
                    batch: false,
                },
                drawer: {
                    show: false,
                    title: '详情',
                    width: 400,
                },
                detail : {
                    option: {
                        column: [
                            {
                                label: '用户账号',
                                prop: 'username',
                                type: 'text',
                                span: 24
                            },
                            {
                                label: '用户名字',
                                prop: 'realname',
                                span: 24
                            },
                            {
                                label: '角色分配',
                                prop: 'roleName',
                                span: 24
                            },
                            {
                                label: '生日',
                                prop: 'birthday',
                                span: 24
                            },
                            {
                                label: '性别',
                                prop: 'sex_dictText',
                                span: 24
                            },
                            {
                                label: '邮箱',
                                prop: 'email',
                                span: 24
                            },
                            {
                                label: '手机号码',
                                prop: 'phone',
                                span: 24
                            },
                            {
                                label: '工作流引擎',
                                prop: 'activitiSync',
                                span: 24
                            }
                        ]
                    },
                    model: {}
                },
                aForm : {
                   option : {
                       mock:true,
                       submitBtn :false,
                       emptyBtn : false,
                       menuBtn : false,
                       column : [
                           {
                               label: '头像',
                               prop: 'avatar',
                               type : 'input',
                               span: 24
                           },
                           {
                               label: '部门分配',
                               prop: 'dept',
                               type : 'input',
                               span: 24
                           },
                           /*{
                               label: '工作流引擎',
                               prop: 'activitiSync',
                               type : 'radio',
                               dicData : this.activitiSync
                               span: 24,
                               props:{
                                   value : 'itemValue',
                                   label : 'itemLabel'
                               },
                           },*/
                       ]
                   },
                    model : {

                    }
                },
                table: {
                    column: [
                        {type: 'selection', fixed: true},
                        {
                            label: '操作',
                            prop: 'oper',
                            width: '100',
                            render: (h, props) => {
                                let {row} = props
                                let dropdownItem = [
                                    {label: '详情', icon: '', action: 'handleDetail'},
                                    {label: '密码', icon: '', action: 'handlePwd'},
                                    {label: '删除', icon: '', action: 'handleDetail'},
                                    {label: '冻结', icon: '', action: 'handleDetail'},
                                    {label: '代理人', icon: '', action: 'handleDetail'},
                                ]
                                return (
                                    <el-dropdown placement="bottom" className="dropdown">
                                      <span class="text-blue-500">
                                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                                      </span>
                                        <el-dropdown-menu slot="dropdown">
                                            {
                                                dropdownItem.map(({label, icon, action}) => {
                                                    return (
                                                        <el-dropdown-item nativeOnClick={() => this[action](row)}>
                                                            {label}
                                                        </el-dropdown-item>
                                                    )
                                                })
                                            }
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                )
                            },
                        },
                        {label: '用户账号', prop: 'username',},
                        {label: '真实姓名', prop: 'realname'},
                        {
                            label: '头像',
                            width: '70',
                            prop: 'avatar',
                            render: (h, scope) => {
                                return (
                                    <div>
                                        <span class="p-1 bg-gray-400 rounded-sm cursor-pointer">
                                            <i class="iconfont icon-user"></i>
                                        </span>
                                    </div>
                                )
                            }
                        },
                        {
                            label: '性别',
                            prop: 'sex_dictText',
                            width: '70'
                        },
                        {label: '生日', prop: 'birthday'},
                        {label: '手机号码', prop: 'phone', showOverflowTooltip: true},
                        {label: '邮箱', prop: 'email'},
                        {label: '状态', prop: 'status_dictText', width: '70'},
                    ],
                    data: [],
                    selection: [],
                    loading: false
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        computed: {
            ...mapState({
                sex: ({dict}) => dict.sex,
                userStatus: ({dict}) => dict.userStatus,
                roles: ({system}) => system.roles,
                depts: ({system}) => system.depts,
                activitiSync : ({dict}) => dict.activitiSync
            })
        },
        methods: {
            ...mapActions({
                getSex: 'GET_SEX',
                getUserStatus: 'GET_USER_STATUS',
                getAllRoles: 'GET_ALL_ROLES',
                getAllDepts: 'GET_ALL_DEPTS',
                getActivitiSync : 'GET_ACTIVIYI_SYNC',
            }),
            arrowClick() {
                let {collapse} = this.show
                this.show = {
                    ...this.show,
                    collapse: !collapse
                }
            },
            handleDetail(row) {
                this.drawer = {
                    ...this.drawer,
                    show: true
                }
                this.getUserRole(row)
                //this.getUserDept(row)

            },
            async getUserRole(row) {
                let {id: userid,activitiSync} = row
                let {success, result} = await http.get(apiList.sys_role_query_user_role, {userid})
                if (success) {
                    let roleName = this.roles.filter(item => result.includes(item.id)).map(item => item.roleName).join(',')
                    console.log(this.activitiSync)
                    debugger;
                    activitiSync = this.activitiSync.filter(item => item.itemValue === activitiSync).map(item => item.itemText).join(',')
                    this.detail = {
                        ...this.detail,
                        model: {
                            ...row,
                            roleName,
                            activitiSync
                        }
                    }
                }
            },
            async getUserDept(row) {
                let {id: userid} = row
                let {success, result} = await http.get(apiList.sys_dept_query_by_user, {userid})
                if (success) {
                    /*let roleName = this.depts.filter(item => result.includes(item.id)).map(item => item.roleName).join(',')
                    this.detail = {
                        ...this.detail,
                        form: {
                            ...row,
                            roleName
                        }
                    }*/
                }
            },
            handlePwd(row) {
                debugger;
            },
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
            checked(selection) {
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
            handleCurrentChange(currentPage) {
                this.page = {
                    ...this.page,
                    currentPage
                }
                this.queryList()
            },
            handleSizeChange(pageSize) {
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
                let {pageSize, currentPage: pageNo} = this.page
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
                }
            }
        },
        mounted() {
            this.queryList()
            this.getSex()
            this.getUserStatus()
            this.getAllRoles()
            this.getAllDepts()
            this.getActivitiSync()
        }
    }
</script>

<style scoped lang="less">
    .user {
        .dropdown {
            padding: 0 10px;
        }
    }
</style>
