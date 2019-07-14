<template>
    <div class = "index">
        <el-row :gutter="24">
            <el-col :sm="24" :md="6" :xl="12">
                <chart-card>
                    <div slot="card-head">
                        <div class="flex justify-between">
                            <div>销售总额</div>
                            <div>
                                <el-tooltip content="指标说明" placement="top">
                                    <i class="el-icon-warning-outline cursor-pointer"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div slot="card-content">
                        <div class="text-3xl">￥126,560</div>
                        <div class = "chart-container">
                            <span>周同比</span><span class="pl-2 pr-1">12%</span>
                            <span class="el-icon-caret-top text-red-400"></span>
                            <span class="pl-3">日同比</span><span class="pl-2 pr-1">11%</span>
                            <span class="el-icon-caret-bottom text-green-400"></span>
                        </div>
                    </div>
                    <div slot="card-footer">
                        <div class="pt-3 border-t border-solid border-gray-300">
                            <span>日均销售额￥ 234.56</span>
                        </div>
                    </div>
                </chart-card>
            </el-col>
            <el-col :sm="24" :md="6" :xl="12">
                <chart-card>
                    <div slot="card-head">
                        <div class="flex justify-between">
                            <div>访问量</div>
                            <div>
                                <el-tooltip content="指标说明" placement="top">
                                    <i class="el-icon-warning-outline cursor-pointer"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div slot="card-content">
                        <div class="text-3xl">8846</div>
                        <div class = "chart-container">
                            <v-chart :options="options.visit" auto-resize></v-chart>
                        </div>
                    </div>
                    <div slot="card-footer">
                        <div class="pt-3 border-t border-solid border-gray-300">
                            <span>日访问量 1,234</span>
                        </div>
                    </div>
                </chart-card>
            </el-col>
            <el-col :sm="24" :md="6" :xl="12">
                <chart-card>
                    <div slot="card-head">
                        <div class="flex justify-between">
                            <div>支付笔数</div>
                            <div>
                                <el-tooltip content="指标说明" placement="top">
                                    <i class="el-icon-warning-outline cursor-pointer"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div slot="card-content">
                        <div class="text-3xl">6560</div>
                        <div class = "chart-container">
                            <v-chart :options="options.visit" auto-resize></v-chart>
                        </div>
                    </div>
                    <div slot="card-footer">
                        <div class="pt-3 border-t border-solid border-gray-300">
                            <span>转化率 60%</span>
                        </div>
                    </div>
                </chart-card>
            </el-col>
            <el-col :sm="24" :md="6" :xl="12">
                <chart-card>
                    <div slot="card-head">
                        <div class="flex justify-between">
                            <div>运营活动效果</div>
                            <div>
                                <el-tooltip content="指标说明" placement="top">
                                    <i class="el-icon-warning-outline cursor-pointer"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div slot="card-content">
                        <div class="text-3xl">78%</div>
                        <div class = "chart-container">
                            <v-chart :options="options.visit" auto-resize></v-chart>
                        </div>
                    </div>
                    <div slot="card-footer">
                        <div class="pt-3 border-t border-solid border-gray-300">
                            同周比 12% 日环比 80%
                        </div>
                    </div>
                </chart-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import ChartCard from './ChartCard'
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip';

    export default {
        name: "QuotaExplain",
        components: {
            ChartCard,
            'v-chart': ECharts
        },
        data() {
            return {
                options: {
                    visit: {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        grid: {
                            left: '0',
                            right: '0',
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                splitLine: {            //网格线
                                    show: false
                                },
                                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
                                    "show": false
                                },
                                axisLabel: {
                                    formatter: () => {
                                        return "";
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                name: '搜索引擎',
                                type: 'line',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: '#1890ff'    //改变区域颜色
                                    },
                                },
                                itemStyle: {
                                    normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                        color: '#1890ff'
                                    },
                                },
                                symbol: 'none',             //取消折点圆圈
                                smooth: true,
                                data: [820, 932, 901, 934, 1290, 1330, 1320]
                            }
                        ]
                    }
                }
            }
        }
    }
</script>

<style scoped lang = "less">
    .index{
        .echarts {
            width: 100%;
            height: 60px;
        }
        .chart-container{
            height : 60px;
            line-height: 60px;
        }
        /deep/ .el-card__body{
            padding : 10px !important;
        }
    }
</style>