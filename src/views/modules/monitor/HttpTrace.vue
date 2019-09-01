<template>
    <div class="http-trace bg-white p-3 m-3">
        <el-row class = "mb-3">
            <el-button plain icon="el-icon-refresh" @click="refresh">刷新</el-button>
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
            >
                <template slot="timeTaken" slot-scope="{scope:{row}}">
                    <span v-if = "row.timeTaken > 100">
                        <el-tag effect="plain" type = "danger">{{`${row.timeTaken}ms`}}</el-tag>
                    </span>
                    <span v-else>
                         <el-tag effect="plain" type = "success">{{`${row.timeTaken}ms`}}</el-tag>
                    </span>
                </template>
            </fox-table>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import foxTable from '@/components/fox-table/'
    import dayjs from 'dayjs'
    import {chunk} from '30-seconds-of-code'

    export default {
        name: 'HttpTrace',
        components : {
            foxTable
        },
        data() {
            return {
                table: {
                    data: [],
                    column : [],
                    loading: false,
                    selection: []
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                methodsArr : [
                    { type: '', label: 'GET' },
                    { type: 'success', label: 'POST' },
                    { type: 'danger', label: 'DELETE' },
                    { type: 'info', label: 'PUT' }
                ],
                resStatusArr : [
                    { type: 'warning', label: 500 },
                    { type: 'success', label: 200 },
                    { type: 'danger', label: 404 },
                ],
            }
        },
        methods: {
            refresh() {
                this.queryList()
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
                let {pageNum: pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                }
                let {status, data: {traces}} = await http.ajax('get', apiList.monitor_performance_http_query, params)
                if (status === constant.SUCCESS) {
                    let chunkResult = chunk(traces,pageSize)
                    this.table = {
                        ...this.table,
                        data: chunkResult[pageNo-1]
                    }
                    this.page = {
                        ...this.page,
                        total: traces.length
                    }
                    this.table = {
                        ...this.table,
                        loading: false
                    }
                }
            },
            setI18n(){
                this.table = {
                    ...this.table,
                    show : false,
                    column: [
                        {
                            label: '请求时间',
                            prop: 'timestamp',
                            width : 150,
                            render : (h,{row:{timestamp}})=>{
                                return <span>{dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>
                            }
                        },
                        {
                            label: '请求方法',
                            prop: 'method',
                            width : 120,
                            render : (h,{row:{request:{method}}})=>{
                                return (
                                    <span>
                                        {
                                            this.methodsArr.map(({label,type})=>{
                                                if(label === method){
                                                    return (
                                                        <el-tag class = "w-16" effect="dark" type = {type}>{label}</el-tag>
                                                    )
                                                }
                                            })
                                        }
                                    </span>
                                )
                            }
                        },
                        {
                            label: '请求路径',
                            prop: 'uri',
                            render : (h,{row:{request:{uri}}})=>{
                                return <span>{uri}</span>
                            }
                        },
                        {
                            label: '响应状态',
                            prop: 'status',
                            width : 100,
                            render : (h,{row:{response:{status}}})=>{
                                return (
                                    <span>
                                        {
                                            this.resStatusArr.map(({label,type})=>{
                                                if(label === status){
                                                    return (
                                                        <el-tag class = "w-16" effect="dark" type = {type}>{label}</el-tag>
                                                    )
                                                }
                                            })
                                        }
                                    </span>
                                )
                            }
                        },
                        {
                            label: '请求耗时',
                            prop: 'timeTaken',
                            width : 100,
                            slot : true
                        },
                    ]
                }
                this.$nextTick(()=>{
                    this.table = {
                        ...this.table,
                        show : true
                    }
                })
            },
        },
        created(){
            this.setI18n()
        },
        mounted() {
            this.queryList()
        }
    }
</script>
<style scoped lang="less">

</style>