<template>
    <div class = "m-3 p-3 bg-white">
        <el-row>
            <el-form ref="form" label-width="90px">
                <form-query @search="search" @reset="reset">
                    <template v-for = "(item,index) in formList">
                        <template slot = "show" v-if = "index < 2">
                            <el-col  :xs = "24" :sm = "24" :md="12" :lg = "8" :xl = "8">
                                <el-form-item :label="item.label" :prop="item.field">
                                    <template v-if="item.view === 'text'">
                                        <el-input v-model="item.field" :placeholder="item.label" clearable></el-input>
                                    </template>
                                    <template v-if="item.view === 'date'">
                                        <el-date-picker  v-model="item.field" :placeholder="item.label" value-format="yyyy-MM-dd" class = "w-full"></el-date-picker>
                                    </template>
                                </el-form-item>
                            </el-col>
                        </template>
                        <template slot = "hide" v-else>
                            <el-col  :xs = "24" :sm = "24" :md="12" :lg = "8" :xl = "8">
                                <el-form-item :label="item.label" :prop="item.field">
                                    <template v-if="item.view === 'text'">
                                        <el-input v-model="item.field" :placeholder="item.label" clearable></el-input>
                                    </template>
                                    <template v-if="item.view === 'date'">
                                        <el-date-picker  v-model="item.field" :placeholder="item.label" value-format="yyyy-MM-dd" class = "w-full"></el-date-picker>
                                    </template>
                                </el-form-item>
                            </el-col>
                        </template>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row class = "mb-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add">
                {{$t('common_add')}}
            </el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
            <el-button plain icon="el-icon-search" @click="handleHighSearch">高级查询</el-button>
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
            </fox-table>
        </el-row>
        <high-search ref = "highSearch" :high-search = "highSearch"></high-search>
    </div>
</template>

<script>
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'
    import FormQuery from '@/components/form/query'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'
    import HighSearch from "@/components/highSearch";
    import dayjs from 'dayjs'

    let oper = [
        {
            label : '操作',
            prop : 'oper',
            render: (h, {row, $index}) => {
                let btnInfo = [
                    {
                        content: '修改',
                        className: 'fa fa-fw fa-pencil',
                        permission: 'autoOnlineForm:edit',
                        event: () => {
                            this.editMenu(row)
                        }
                    },
                    {
                        type: 'dropDown',
                        className: 'fa fa-fw fa-ellipsis-h',
                        dropDownItems: [
                            {
                                content: '详情',
                                className: '',
                                popover: false,
                                permission : 'menu:detail',
                                event: () => {
                                    this.handleDetail(row)
                                }
                            },
                            {
                                content: '提交流程',
                                className: '',
                                popover: false,
                                permission : 'menu:dataRule',
                                event: () => {
                                    this.handleDataRule(row)
                                }
                            },
                            {
                                content: '删除',
                                className: '',
                                popover: true,
                                popText: '确定要删除吗',
                                permission : 'menu:delete',
                                event: () => {
                                    this.handleDel(row)
                                }
                            }
                        ],
                    },
                ]
                return (
                    <OperBtn btnInfo={btnInfo}></OperBtn>
                )
            }
        }
    ]

    export default {
        name: "OnlCgformAutoList",
        components : {
            FormQuery,
            foxTable,
            HighSearch
        },
        data(){
            return {
                formList : [],
                table: {
                    column: [],
                    data: [],
                    selection: [],
                    loading: false,
                    show: true,
                },
                page: {
                    pageNum : 1,
                    pageSize: 10,
                    total: 0
                },
                highSearch : {
                    type : []
                },
            }
        },
        watch: {
            '$i18n.locale'() {
                this.getDatas()
                this.getColumns()
            }
        },
        methods : {
            search() {
                this.page = {
                    ...this.page,
                    pageNum: 1
                }
                this.getDatas()
            },
            reset() {
                this.$refs.form.resetFields()
            },
            add(){

            },
            fileImport(){

            },
            fileExport(){

            },
            handleHighSearch(){
                let {dialog:{name},getQueryConditions} = this.$refs.highSearch
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
                getQueryConditions()
            },
            getAvatarView({row},prop) {
                let {config: {baseUrl: {staticDomainURL}}} = constant
                return `${staticDomainURL}/${row[prop]}`
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
                this.getDatas()
            },
            sizeChange(pageSize) {
                this.page = {
                    ...this.page,
                    pageSize
                }
                this.getDatas()
            },
            async getFormQuery(){
                let {code} = this.$route.params
                let {success,result} = await http.get(`${apiList.online_form_auto_online_form_get_query_info}/${code}`)
                if(success){
                    this.formList = result
                }
            },
            async getColumns() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {code} = this.$route.params
                let {success, result} = await http.get(`${apiList.online_form_auto_online_form_get_columns}/${code}`)
                if (success) {
                    let column = [];
                    let {columns,dictOptions} = result
                    columns.forEach(item=>{
                        let {title:label,dataIndex:prop,align,sorter,customRender,scopedSlots = {}} = item
                        let columnItem = {
                            align,
                            label,
                            prop,
                        };
                        if(sorter){
                            columnItem = {
                                ...columnItem,
                                sortable : true
                            }
                        }
                        if(customRender){
                            columnItem = {
                                ...columnItem,
                                render : (h,{row})=>{
                                    return <span>{dictOptions[prop].find(item=>item.value === row[prop])}</span>
                                }
                            }
                        }
                        if(scopedSlots.customRender === 'dateSlot'){
                            columnItem = {
                                ...columnItem,
                                render : (h,{row})=>{
                                    console.log('row',row)
                                    return <span>{dayjs(row[prop]).format('YYYY-MM-DD')}</span>
                                }
                            }
                        }
                        if(scopedSlots.customRender === 'imgSlot'){
                            columnItem = {
                                ...columnItem,
                                render: (h, scope) => {
                                    let imgPath = this.getAvatarView(scope,prop)
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
                            }
                        }
                        column.push(columnItem)
                    })
                    console.log(column)
                    this.table = {
                        ...this.table,
                        column : [
                            ...oper,
                            ...column
                        ]
                    }
                    this.highSearch = {
                        ...this.highSearch,
                        type : column
                    }
                    return result
                }
                this.table = {
                    ...this.table,
                    loading : false
                }
            },
            async getDatas(){
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {pageNum:pageNo,pageSize} = this.page
                let {code} = this.$route.params

                let params = {
                    pageNo,
                    pageSize,
                    column : 'createTime'
                }
                let {success, result} = await http.get(`${apiList. online_form_auto_online_form_get_datas}/${code}`,params)
                if (success) {
                    let {records,total} = result ? result : {}
                    this.table = {
                        ...this.table,
                        data : records
                    }
                    this.page = {
                        ...this.page,
                        total
                    }
                }
                this.table = {
                    ...this.table,
                    loading : false
                }
            },

        },
        created(){

        },
        mounted(){
            this.getColumns()
            this.getDatas()
            this.getFormQuery()
        }
    }
</script>

<style scoped>

</style>