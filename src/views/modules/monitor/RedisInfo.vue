<template>
    <div class = "redis p-3 m-3 bg-white">
        <el-row>
            <el-col :span = "12">
                <v-chart :options="options.redisMemory" auto-resize ref = "redisMemory"></v-chart>
            </el-col>
            <el-col :span = "12">
                <v-chart :options="options.redisKeyNum" auto-resize ref = "redisKeyNum"></v-chart>
            </el-col>
        </el-row>
        <el-row>
            <collapse :collapse-props = "collapse">
                <div slot = "collapse-title">
                    <span>Redis 详细信息</span>
                </div>
                <div slot = "collapse-content">
                    <fox-table
                            v-if="table.show"
                            v-loading="table.loading"
                            :column="table.column"
                            :data="table.data"
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
                </div>
            </collapse>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import chartResize from '@/utils/modules/mixins/chartResize'
    import foxTable from '@/components/fox-table/'
    import Collapse from '@/components/collapse/Collapse'
    import dayjs from 'dayjs'
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/title'

    let redisMemory = {
        xData : [],
        yData : []
    }

    let redisKeyNum = {
        xData : [],
        yData : []
    }

    export default {
        name: "RedisInfo",
        components: {
            'v-chart': ECharts,
            Collapse,
            foxTable
        },
        mixins : [chartResize],
        data(){
            return {
                collapse : {
                    name : 'redisDetail'
                },
                options : {
                    redisMemory : {},
                    redisKeyNum : {},
                },
                table: {
                    data: [],
                    column : [],
                    loading: false,
                },
            }
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods : {
            async initRedisMemory(){
                let {data:{create_time:createTime,used_memory:usedMemory}} = await http.ajax('get',apiList.monitor_redis_monitor_memory_query)
                let {xData,yData} = redisMemory
                xData.push(dayjs(createTime).format('hh:mm:ss'))
                yData.push(usedMemory/1000)
                xData = xData.length >=5 ? xData.slice(-5) : xData
                yData = yData.length >=5 ? yData.slice(-5) : yData
                redisMemory = {
                    xData,
                    yData
                }
                this.options = {
                    ...this.options,
                    redisMemory : {
                        title : {
                            show : true,
                            text : 'Radis 内存实时占用情况（KB）',
                            left : '10px',
                            top : '10px',
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type : 'none',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        grid: {
                            /*left: '50',
                            right: '50',*/
                        },
                        xAxis: [
                            {
                                type: 'category',
                                //boundaryGap: false,
                                axisTick: {
                                    show: false
                                },
                                splitLine: {            //网格线
                                    show: false
                                },
                                axisLine : {
                                    lineStyle : {
                                        color : 'rgba(204,204,204,1)',
                                    },
                                },
                                axisLabel : {
                                    color : 'black'
                                },
                                data: xData,
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                axisLine: {       //y轴
                                    show: false
                                },
                                axisTick: {       //y轴刻度线
                                    show: false
                                },
                                splitLine: {     //网格线
                                    "show": true,
                                    lineStyle : {
                                        type : 'dashed'
                                    }
                                },
                                axisLabel: {
                                    formatter: (value) => {
                                        return value;
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                type: 'line',
                                symbol : 'none',
                                smooth : true,
                                lineStyle : {
                                    color : 'rgba(24,144,255,1)',
                                    width : 10
                                },
                                areaStyle : {
                                    color : 'rgba(116,188,255,1)'
                                },
                                itemStyle: {
                                    borderWidth : 0
                                },
                                data: yData
                            }
                        ]
                    }
                }
            },
            async initRedisKeyNum(){
                let {data:{create_time:createTime,dbSize}} = await http.ajax('get',apiList.monitor_redis_monitor_key_mun_query)
                let {xData,yData} = redisKeyNum
                xData.push(dayjs(createTime).format('hh:mm:ss'))
                yData.push(dbSize)
                xData = xData.length >=5 ? xData.slice(-5) : xData
                yData = yData.length >=5 ? yData.slice(-5) : yData
                redisKeyNum = {
                    xData,
                    yData
                }
                this.options = {
                    ...this.options,
                    redisKeyNum : {
                        title : {
                            show : true,
                            text : 'Radis Key 实时数量（个）',
                            left : '10px',
                            top : '10px',
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type : 'none',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        grid: {
                            /*left: '50',
                            right: '50',*/
                        },
                        xAxis: [
                            {
                                type: 'category',
                                //boundaryGap: false,
                                axisTick: {
                                    show: false
                                },
                                splitLine: {            //网格线
                                    show: false
                                },
                                axisLine : {
                                    lineStyle : {
                                        color : 'rgba(204,204,204,1)',
                                    },
                                },
                                axisLabel : {
                                    color : 'black'
                                },
                                data: xData,
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                axisLine: {       //y轴
                                    show: false
                                },
                                axisTick: {       //y轴刻度线
                                    show: false
                                },
                                splitLine: {     //网格线
                                    "show": true,
                                    lineStyle : {
                                        type : 'dashed'
                                    }
                                },
                                axisLabel: {
                                    formatter: (value) => {
                                        return value;
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                type: 'line',
                                symbol : 'none',
                                smooth : true,
                                lineStyle : {
                                    color : 'rgba(220,20,60,1)',
                                    width : 10
                                },
                                areaStyle : {
                                    color : 'rgba(255,165,183,1)'
                                },
                                itemStyle: {
                                    borderWidth : 0
                                },
                                data: yData
                            }
                        ]
                    }
                }
            },
            interVal(){
                this.times = setInterval(()=>{
                    this.initRedisMemory()
                    this.initRedisKeyNum()
                },3000)
            },
            async queryList() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {success,result} = await http.get(apiList.monitor_redis_monitor_detail_query)
                if (success) {
                    this.table = {
                        ...this.table,
                        data: result,
                        loading : false
                    }
                }
            },
            setI18n(){
                this.table = {
                    ...this.table,
                    show : false,
                    column: [
                        {
                            label: 'Key',
                            prop: 'key',
                        },
                        {
                            label: 'Description',
                            prop: 'description',
                        },
                        {
                            label: 'Value',
                            prop: 'value',
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
            listenResize(){
                if(this.$refs.redisMemory) this.$refs.redisMemory.resize()
                if(this.$refs.redisKeyNum) this.$refs.redisKeyNum.resize()
            },
        },
        created(){
            this.setI18n()
        },
        mounted(){
            this.initRedisMemory()
            this.initRedisKeyNum()
            this.interVal()
            this.queryList()
        },
        destroyed(){
            clearInterval(this.times)
        }
    }
</script>

<style scoped lang = "less">
    .redis{
        .echarts {
            width: 100%;
            height: 400px;
        }
    }
</style>