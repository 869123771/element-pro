<template>
    <div class = "report bg-white p-3 m-3">
        <el-row>
            <el-form ref="form" :model="form" label-width="90px">
                <el-col :md="6" :sm="8">
                    <el-form-item label="报表编码" prop="code">
                        <el-input v-model="form.code" placeholder="报表编码" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <el-form-item label="报表名字" prop="name">
                        <el-input v-model="form.name" placeholder = "报表名字" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8" class = "px-3">
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                </el-col>
            </el-form>
        </el-row>
        <el-row class="my-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add">
                录入
            </el-button>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>删除</el-dropdown-item>
                    <el-dropdown-item @click.native="frozen()"><i class="el-icon-lock"></i>冻结</el-dropdown-item>
                    <el-dropdown-item @click.native="frozen(1)"><i class="el-icon-unlock"></i>解冻</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row>
            <fox-table
                    ref = "table"
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
                <template slot = "oper" slot-scope = "{scope}">
                    <el-tooltip :content = "$t('common_edit')" placement="top">
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-pencil" @click = "edit"></i>
                         </span>
                    </el-tooltip>
                    <el-dropdown placement="bottom" class ="dropdown">
                      <span class="text-blue-500 text-base">
                          <i class="fa fa-fw fa-ellipsis-h"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                            <template v-for = "item in dropDownItem">
                                <template v-if = "item.popover">
                                    <popover-confirm @confirm = "confirm(item.action)">
                                        <div slot="popover-title">
                                            <span>{{item.popText}}</span>
                                        </div>
                                        <div slot="popover-content">
                                            <el-dropdown-item>{{item.label}}</el-dropdown-item>
                                        </div>
                                    </popover-confirm>
                                </template>
                                <template v-else>
                                    <el-dropdown-item @click.native = "item.action">
                                        {{item.label}}
                                    </el-dropdown-item>
                                </template>
                            </template>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </fox-table>
        </el-row>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import foxTable from '@/components/fox-table'
    import PopoverConfirm from '@/components/popoverConfirm'

    export default {
        name: "OnlCgreportHeadList",
        components : {
            DragDialog,
            foxTable,
            PopoverConfirm
        },
        data(){
            return {
                form : {},
                show : {
                    batch : false
                },
                dropDownItem : [
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
                        popText : '确定要删除吗'
                    },
                ],
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
            add(){

            },
            configAddress(){

            },
            functionTest(){

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
                let {success, result: {total, records: data}} = await http.get(apiList.online_report_head_list_query, params)
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
                        {
                            label: this.$t('common_operate'),
                            prop: 'oper',
                            width: '100',
                            fixed : true,
                            slot : true
                        },
                        {
                            label: '报表名称',
                            prop: 'name',
                        },
                        {
                            label: '编码',
                            prop: 'code',
                        },
                        {
                            label: '查询SQL',
                            prop: 'cgrSql',
                            width: '180'
                        },
                        {label: '数据源', prop: 'dbSource'},
                        {label: '创建时间', prop: 'createTime',},
                        {label: '描述', prop: 'content'},
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
            this.queryList()
        }
    }
</script>

<style scoped>

</style>