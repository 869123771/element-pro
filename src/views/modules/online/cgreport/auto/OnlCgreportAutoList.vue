<template>
    <div class = "p-3 m-3 bg-white">
        <el-row>
            <el-form ref="form" :model = "form" label-width = "100px">
                <form-query @search="search" @reset="reset">
                    <template v-for = "(item,index) in formList">
                        <template v-if = "index < 2">
                            <template slot="show">
                                <template v-if = "item.view === 'String'">
                                    <el-col :md="6" :sm="8">
                                        <el-form-item :label="item.label" :prop="item.field">
                                            <el-input v-model="form[item.field]" clearable :placeholder="'请输入' + item.label"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </template>
                                <template v-else-if = "item.view === 'list'">
                                    <el-col :md="6" :sm="8">
                                        <el-form-item :label="item.label" :prop="item.field">
                                            <el-select v-model="form[item.field]" clearable filterable class = "w-full" :placeholder="'请选择' + item.label">
                                                <template v-for = "{value,title} in select[item.field]">
                                                    <el-option :value = "value" :label = "title"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </template>
                            </template>
                        </template>
                        <template v-else>
                            <template slot="hide">
                                <template v-if = "item.view === 'String'">
                                    <el-col :md="6" :sm="8">
                                        <el-form-item :label="item.label" :prop="item.field">
                                            <el-input v-model="form[item.field]" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </template>
                                <template v-else-if = "item.view === 'list'">
                                    <el-col :md="6" :sm="8">
                                        <el-form-item :label="item.label" :prop="item.field">
                                            <el-select v-model="form[item.field]" clearable filterable class = "w-full" :placeholder="'请选择' + item.label">
                                                <template v-for = "{value,title} in select[item.field]">
                                                    <el-option :value = "value" :label = "title"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </template>
                            </template>
                        </template>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row class = "pb-3">
            <el-button type = "primary" icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
        </el-row>
        <el-row>
            <collapse :collapse-props = "collapse">
                <div slot = "collapse-title">
                    <span>在线报表列表</span>
                </div>
                <div slot = "collapse-content">
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
                    </fox-table>
                </div>
            </collapse>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import foxTable from '@/components/fox-table'
    import Collapse from '@/components/collapse/Collapse'
    import FormQuery from '@/components/form/query'
    import {downloadFile} from '@/utils/modules/tools'
    export default {
        name: "OnlCgreportAutoList",
        components : {
            FormQuery,
            foxTable,
            Collapse
        },
        data(){
            return {
                form : {

                },
                formList : [],
                collapse : {
                    name : 'autoLineReport'
                },
                select : {},
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
        methods : {
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
            async fileExport() {
                let {params : {code}} = this.$route
                let {data, filename} = await http.getFileDownload(apiList.online_report_api_export + code)
                downloadFile(data, filename)
            },
            async queryConditions(){
                let {params : {code}} = this.$route
                let {success, result} = await http.get(apiList.online_report_api_get_query_info + code)
                if(success){
                    result.map(({field})=>field).forEach(v=>{this.$set(this.form,v,'')})
                    this.formList = result
                }
            },
            async queryList() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {params : {code}} = this.$route
                let {pageSize, pageNum: pageNo} = this.page
                let params = {
                    ...this.form,
                    pageSize,
                    pageNo
                }
                let {success, result} = await http.get(apiList.online_report_api_get_column_and_data + code , params)
                if (success) {
                    let {dictOptions,fieldHrefSlots,data:{total,records},columns,cgreportHeadName} = result
                    columns.forEach(item=>{
                        let {title,dataIndex,sorter} = item
                        item.label = title
                        item.prop = dataIndex
                        item.sortable = sorter
                    })
                    columns.unshift({type: 'selection', fixed: true})
                    this.select = dictOptions
                    this.table = {
                        ...this.table,
                        loading: false,
                        column: columns,
                        data : records
                    }
                    this.page = {
                        ...this.page,
                        total
                    }
                }
            },
        },
        mounted(){
            this.queryConditions()
            this.queryList()
        }
    }
</script>

<style scoped>

</style>