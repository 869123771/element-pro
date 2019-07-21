<template>
    <div class="http-trace bg-white p-3 m-3">
        <el-row>
            <avue-crud
                    ref="crud"
                    :data="table.data"
                    :option="table.option"
                    :page="page"
                    :table-loading="table.loading"
                    @on-load="queryList"
                    @size-change="sizeChange"
                    @current-change="currentChange"
            >
                <template slot="menuLeft">
                    <el-button plain icon="el-icon-refresh" @click="refresh">刷新</el-button>
                </template>
                <template slot="method" slot-scope="{row}">
                    <template v-for = "item in methodsArr">
                        <span v-if = "row.request.method === item.label">
                            <el-tag class = "w-16" effect="dark" :type = "item.type">{{item.label}}</el-tag>
                        </span>
                    </template>
                </template>
                <template slot="uri" slot-scope="{row}">
                    {{row.request.uri}}
                </template>
                <template slot="status" slot-scope="{row}">
                    <template v-for = "item in resStatusArr">
                        <span v-if = "row.response.status === item.label">
                            <el-tag effect="plain" :type = "item.type">{{item.label}}</el-tag>
                        </span>
                    </template>
                </template>
                <template slot="timeTaken" slot-scope="{row}">
                    <span v-if = "row.timeTaken > 100">
                        <el-tag effect="plain" type = "danger">{{`${row.timeTaken}ms`}}</el-tag>
                    </span>
                    <span v-else>
                         <el-tag effect="plain" type = "success">{{`${row.timeTaken}ms`}}</el-tag>
                    </span>
                </template>
            </avue-crud>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import dayjs from 'dayjs'

    export default {
        name: 'HttpTrace',
        data() {
            let {table} = constant
            return {
                table: {
                    data: [],
                    option: {
                        ...table,
                        pageSize: 10,
                        selection : false,
                        column: [
                            {
                                label: '请求时间',
                                prop: 'timestamp',
                                //slot : true
                                formatter(row,value,label,column){
                                    return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
                                },
                                width : 150,
                            },
                            {
                                label: '请求方法',
                                prop: 'method',
                                slot : true,
                                width : 120,
                            },
                            {
                                label: '请求路径',
                                prop: 'uri',
                                slot : true,
                                overHidden : true
                            },
                            {
                                label: '响应状态',
                                prop: 'status',
                                slot : true,
                                width : 100
                            },
                            {
                                label: '请求耗时',
                                prop: 'timeTaken',
                                width : 100,
                                slot : true
                            },
                        ]
                    },
                    loading: false,
                    selection: []
                },
                page: {
                    currentPage: 1,
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
                let {currentPage: pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                }
                let {status, data: {traces}} = await http.ajax('get', apiList.monitor_performance_http_query, params)
                debugger;
                if (status === constant.SUCCESS) {
                    debugger;
                    this.table = {
                        ...this.table,
                        data: traces
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
        },
        mounted() {

        }
    }
</script>
<style scoped lang="less">

</style>