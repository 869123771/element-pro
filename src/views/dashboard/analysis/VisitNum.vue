<template>
    <div class = "visit-num">
        <el-row>
            <el-col :xs = "24" :sm = "12" :md="12" :lg = "18" :xl = "18">
                <h4 class="title">销售额趋势</h4>
                <v-chart :options="options.visitNum" auto-resize ref = "visitNum"></v-chart>
            </el-col>
            <el-col :xs = "24" :sm = "12" :md="12" :lg = "6" :xl = "6">
                <h4 class="title">门店销售排行榜</h4>
                <ul class="list">
                    <li :key="index" v-for="(item, index) in rankList">
                        <span :class="index < 3 ? 'active' : null">{{ index + 1 }}</span>
                        <span>{{ item.name }}</span>

                        <span>{{ item.total }}</span>
                    </li>
                </ul>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip';

    export default {
        name: "VisitNum",
        components: {
            'v-chart': ECharts
        },
        data(){
            const rankList = []
            for (let i = 0; i < 7; i++) {
                rankList.push({
                    name: '白鹭岛 ' + (i+1) + ' 号店',
                    total: 1234.56 - i * 100
                })
            }

            return {
                options : {
                    visitNum : {}
                },
                rankList
            }
        },
        methods : {
            initVisitNumCharts(){
                let xData = [], yData = [];
                for (let i = 0; i < 12; i += 1) {
                    xData.push(`${i + 1}月`)
                    yData.push(Math.floor(Math.random() * 1000) + 200)
                }
                this.options = {
                    ...this.options,
                    visitNum : {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type : 'shadow',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        grid: {
                            left: '50',
                            right: '50',
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
                                    "show": true
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
                                type: 'bar',
                                barWidth : 50,
                                barGap:'50%',
                                itemStyle: {
                                    normal: {
                                        color : (params) =>{
                                            let colorList = ['#C335                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        31','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ];
                                            return colorList[params.dataIndex]
                                        }
                                    },
                                },
                                data: yData
                            }
                        ]
                    }
                }
            }
        },
        mounted(){
            this.initVisitNumCharts()
        }
    }
</script>

<style scoped lang = "less">
    .visit-num{
        .echarts {
            width: 100%;
            height: 400px;
        }
        .list {
            margin: 25px 0 0;
            padding: 0;
            list-style: none;
            li {
                margin-top: 16px;
                span {
                    color: rgba(0, 0, 0, .65);
                    font-size: 14px;
                    line-height: 22px;

                    &:first-child {
                        background-color: #f5f5f5;
                        border-radius: 20px;
                        display: inline-block;
                        font-size: 12px;
                        font-weight: 600;
                        margin-right: 24px;
                        height: 20px;
                        line-height: 20px;
                        width: 20px;
                        text-align: center;
                    }
                    &.active {
                        background-color: #314659;
                        color: #fff;
                    }
                    &:last-child {
                        float: right;
                    }
                }
            }
        }
    }
</style>