<template>
    <div class="m-3 p-3 bg-white">
        <el-row>
            <el-form ref="form" label-width="90px">
                <form-query @search="search" @reset="reset">
                    <template v-for="(item,index) in formList">
                        <template slot="show" v-if="index < 2">
                            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                                <form-item-query :item="item" :form="form"
                                                 :dict-options="table.dictOptions"></form-item-query>
                            </el-col>
                        </template>
                        <template slot="hide" v-else>
                            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                                <form-item-query :item="item" :form="form"
                                                 :dict-options="table.dictOptions"></form-item-query>
                            </el-col>
                        </template>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row class="mb-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add">
                {{$t('common_add')}}
            </el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">{{$t('common_import')}}</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
            <template v-for = "{buttonIcon,buttonName,buttonCode} in btn.list.filter(item=>item.buttonStyle === 'button')">
                <el-button plain :icon="buttonIcon" @click="enJs(buttonCode)">{{buttonName}}</el-button>
            </template>
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
        <high-search ref="highSearch" :high-search="highSearch"></high-search>
        <drag-dialog :drag-dialog="dialog" @confirm="">
            <component :is="component.is" :data="component.data" :ref="component.ref" @modifySuccess=""></component>
        </drag-dialog>
    </div>
</template>

<script>
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'
    import FormQuery from '@/components/form/query'
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'
    import HighSearch from "@/components/highSearch";
    import FormItemQuery from "./onlCgformAutoList/FormItemQuery";
    import DragDialog from '@/components/dragDialog'
    import Modify from './onlCgformAutoList/Modify'
    import dayjs from 'dayjs'

    export default {
        name: "OnlCgformAutoList",
        components: {
            FormQuery,
            FormItemQuery,
            foxTable,
            HighSearch,
            DragDialog
        },
        data() {
            let operate = [
                {
                    label: '操作',
                    prop: 'oper',
                    render: (h, {row, $index}) => {
                        let linkBtns = this.btn.list.filter(item=>item.buttonStyle === 'link')
                        let btnInfo = [
                            {
                                content: '修改',
                                className: 'fa fa-fw fa-pencil',
                                permission: 'autoOnlineForm:edit',
                                event: () => {
                                    this.edit(row)
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
                                        permission: 'menu:detail',
                                        event: () => {
                                            this.handleDetail(row)
                                        }
                                    },
                                    {
                                        content: '提交流程',
                                        className: '',
                                        popover: false,
                                        permission: 'menu:dataRule',
                                        event: () => {
                                            this.handleDataRule(row)
                                        }
                                    },
                                    {
                                        content: '删除',
                                        className: '',
                                        popover: true,
                                        popText: '确定要删除吗',
                                        permission: 'menu:delete',
                                        event: () => {
                                            this.handleDel(row)
                                        }
                                    },
                                    ...linkBtns.map(({buttonIcon,buttonName,buttonCode})=>{
                                        return (
                                            {
                                                content: buttonName,
                                                className: buttonIcon,
                                                popover: false,
                                                permission: 'menu:detail',
                                                event: () => {
                                                    this.enJs(buttonCode)
                                                }
                                            }
                                        )
                                    }),
                                ],
                            },
                        ]


                        debugger;
                        console.log('xx',btnInfo)
                        return (
                            <OperBtn btnInfo={btnInfo}></OperBtn>
                        )
                    }
                }
            ]
            return {
                form: {},
                formList: [],
                btn: {
                    list: [],
                    exeJs: ''
                },
                table: {
                    column: [
                        ...operate,
                    ],
                    data: [],
                    selection: [],
                    loading: false,
                    show: true,
                    dictOptions: {}
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                highSearch: {
                    type: []
                },
                dialog: {
                    width: 18,
                    height: 200,
                    name: 'add',
                    showFooter: true,
                },
                component: {
                    data: {},
                    ref: '',
                    is: Modify
                }
            }
        },
        watch: {
            '$i18n.locale'() {
                this.getDatas()
                this.getColumns()
            }
        },
        methods: {
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
            add() {

            },
            edit(row) {
                let {schema, column, dictOptions, head} = this.table
                this.dialog = {
                    ...this.dialog,
                    title: '编辑',
                    width: 22,
                    height: 700,
                    name: 'edit',
                    showFooter: true,
                }
                this.component = {
                    ...this.component,
                    data: {
                        row,
                        schema,
                        column,
                        dictOptions,
                        head
                    },
                    ref: 'edit',
                    is: Modify
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            enJs(code){
                let {exeJs} = this.btn
                let func = eval("("+ exeJs.replace(/↵/g,"") +")");
                debugger;
                func()[code]()
            },
            fileImport() {

            },
            fileExport() {

            },
            handleHighSearch() {
                let {dialog: {name}, getQueryConditions} = this.$refs.highSearch
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
                getQueryConditions()
            },
            getAvatarView({row}, prop) {
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
            async getFormQuery() {
                let {code} = this.$route.params
                let {success, result} = await http.get(`${apiList.online_form_auto_online_form_get_query_info}/${code}`)
                debugger
                result.forEach(({field, mode}) => {
                    if (mode === 'group') {
                        this.$set(this.form, field + '_begin', undefined)
                        this.$set(this.form, field + '_end', undefined)
                    } else if (mode === 'single') {
                        this.$set(this.form, field, undefined)
                    }
                })
                if (success) {
                    this.formList = result
                }
            },
            async getFormItem() {
                let {code} = this.$route.params
                let {success, result: {schema, head}} = await http.get(`${apiList.online_form_auto_online_get_form_item}/${code}`)
                if (success) {
                    this.table = {
                        ...this.table,
                        schema,
                        head
                    }
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
                    let {column} = this.table
                    let {columns, dictOptions, cgButtonList, enhanceJs} = result
                    columns.forEach(item => {
                        let {title: label, dataIndex: prop, align, sorter, customRender, scopedSlots = {}} = item
                        let columnItem = {
                            align,
                            label,
                            prop,
                        };
                        if (sorter) {
                            columnItem = {
                                ...columnItem,
                                sortable: true
                            }
                        }
                        if (customRender) {
                            columnItem = {
                                ...columnItem,
                                render: (h, {row}) => {
                                    let currentValueList = row[prop] ? row[prop].split(',') : []
                                    let currentValueMapList = dictOptions[customRender].filter(item => currentValueList.includes(item.value))
                                    return <span>{currentValueMapList.map(item => item.text).join(',')}</span>
                                }
                            }
                        }
                        /*if(scopedSlots && scopedSlots.customRender === 'dateSlot'){
                            columnItem = {
                                ...columnItem,
                                render : (h,{row})=>{
                                    console.log('row',row)
                                    return <span>{dayjs(row[prop]).format('YYYY-MM-DD')}</span>
                                }
                            }
                        }*/
                        if (scopedSlots && scopedSlots.customRender === 'imgSlot') {
                            columnItem = {
                                ...columnItem,
                                render: (h, scope) => {
                                    //let imgPath = this.getAvatarView(scope,prop)
                                    return (
                                        <el-image class="w-8" src={scope.row[prop]}
                                                  preview-src-list={[scope.row[prop]]}
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
                    this.table = {
                        ...this.table,
                        dictOptions
                    }
                    this.btn = {
                        ...this.btn,
                        list: cgButtonList,
                        exeJs: enhanceJs
                    }
                    this.highSearch = {
                        ...this.highSearch,
                        type: column
                    }
                    return result
                }
                this.table = {
                    ...this.table,
                    loading: false
                }
            },
            async getDatas() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {pageNum: pageNo, pageSize} = this.page
                let {form: {superQueryMatchType}} = this.$refs.highSearch
                let {code} = this.$route.params

                let params = {
                    column: 'createTime',
                    order: 'desc',
                    pageNo,
                    pageSize,
                    ...this.form,
                    superQueryMatchType
                }
                let {success, result} = await http.get(`${apiList.online_form_auto_online_form_get_datas}/${code}`, params)
                if (success) {
                    let {records, total} = result ? result : {}
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

        },
        created() {

        },
        mounted() {
            this.getColumns()
            this.getDatas()
            this.getFormQuery()
            this.getFormItem()
        }
    }
</script>

<style scoped>

</style>
