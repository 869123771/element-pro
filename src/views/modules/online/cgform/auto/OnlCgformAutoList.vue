<template>
    <div class = "m-3 p-3 bg-white">
        <el-row class = "mb-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add">
                {{$t('common_add')}}
            </el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
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
    </div>
</template>

<script>
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'


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
            foxTable
        },
        data(){
            return {
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
            }
        },
        watch: {
            '$i18n.locale'() {
                this.getDatas()
                this.getColumns()
            }
        },
        methods : {
            add(){

            },
            fileImport(){

            },
            fileExport(){

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
            async getColumns() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {code} = this.$route.params
                let {success, result} = await http.get(`${apiList.online_form_auto_online_form_get_columns}/${code}`)
                if (success) {
                    let column = []
                    let {columns} = result
                    columns.forEach(item=>{
                        let {title:label,dataIndex:prop,align} = item
                        column.push({align,label,prop})
                    })
                    this.table = {
                        ...this.table,
                        column : [
                            ...oper,
                            ...column
                        ]
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
        }
    }
</script>

<style scoped>

</style>