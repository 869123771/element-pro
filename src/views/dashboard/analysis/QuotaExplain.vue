<template>
    <div class="index">
        <grid-layout :layout="layout"
                     :col-num="12"
                     :row-height="30"
                     :auto-size="true"
                     :is-draggable="draggable"
                     :is-resizable="resizable"
                     :vertical-compact="true"
                     :margin="[12, 12]"
                     :use-css-transforms="true"
                     :responsive = "true"
        >
            <grid-item
                    v-for="(item,index) in layout"
                    :key = "index"
                    :static="item.static"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
            >
                <template v-if="index === 0">
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
                            <div class="text-3xl"><span>￥</span>
                            <count-to :start-val="0" :end-val="info.cellNum.num"
                                      :duration="info.cellNum.duration" class="card-panel-num"/>
                            </div>
                            <div class="chart-container">
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
                </template>
                <template v-if="index === 1">
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
                            <div class="text-3xl">
                                <count-to :start-val="0" :end-val="info.visitNum.num"
                                          :duration="info.visitNum.duration" class="card-panel-num"/>
                            </div>
                            <div class="chart-container">
                                <v-chart :options="options.visit" auto-resize></v-chart>
                            </div>
                        </div>
                        <div slot="card-footer">
                            <div class="pt-3 border-t border-solid border-gray-300">
                                <span>日访问量 1,234</span>
                            </div>
                        </div>
                    </chart-card>
                </template>
                <template v-if="index === 2">
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
                            <div class="text-3xl">
                                <count-to :start-val="0" :end-val="info.payCount.num"
                                          :duration="info.payCount.duration" class="card-panel-num"/>
                            </div>
                            <div class="chart-container">
                                <v-chart :options="options.payNum" auto-resize></v-chart>
                            </div>
                        </div>
                        <div slot="card-footer">
                            <div class="pt-3 border-t border-solid border-gray-300">
                                <span>转化率 60%</span>
                            </div>
                        </div>
                    </chart-card>
                </template>
                <template v-if="index === 3">
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
                            <div class="text-3xl">
                                <count-to :start-val="0" :end-val="info.operateEffect.num"
                                          :duration="info.operateEffect.duration" class="card-panel-num"/>
                                <span>%</span>
                            </div>
                            <div class="progress-container">
                                <el-progress :show-text="false" :stroke-width="26" :percentage="78"></el-progress>
                            </div>
                        </div>
                        <div slot="card-footer">
                            <div class="pt-3 border-t border-solid border-gray-300">
                                同周比 12% 日环比 80%
                            </div>
                        </div>
                    </chart-card>
                </template>
            </grid-item>
        </grid-layout>
    </div>
</template>

<script>
    import ChartCard from './ChartCard'
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip';

    import dayjs from 'dayjs'
    import VueGridLayout from 'vue-grid-layout';
    import CountTo from 'vue-count-to'


    const xData = [], yData = []
    const beginDay = new Date().getTime()

    for (let i = 0; i < 10; i++) {
        xData.push(
            dayjs(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD')
        )
        yData.push(
            Math.round(Math.random() * 10)
        )
    }

    export default {
        name: "QuotaExplain",
        props : {
          info : {
              type : Object
          }
        },
        components: {
            ChartCard,
            'v-chart': ECharts,
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem,
            CountTo
        },
        data() {
            let layout = [
                {"x": 0, "y": 0, "w": 3, "h": 5, "i": "0", static: false},
                {"x": 3, "y": 0, "w": 3, "h": 5, "i": "1", static: false},
                {"x": 6, "y": 0, "w": 3, "h": 5, "i": "2", static: false},
                {"x": 9, "y": 0, "w": 3, "h": 5, "i": "3", static: false},

            ];

            return {
                options: {
                    visit: {},
                    payNum: {},
                },
                layout: layout,
                draggable: true,
                resizable: true,
            }
        },
        methods: {
            itemTitle(item) {
                let result = item.i;
                if (item.static) {
                    result += " - Static";
                }
                return result;
            },
            initVisitChart() {
                this.options = {
                    ...this.options,
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
                                data: yData
                            }
                        ]
                    }
                }
            },
            initPayNumChart() {
                this.options = {
                    ...this.options,
                    payNum: {
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
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: (params) => {
                                            let colorList = ['#C33531', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB'];
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
        mounted() {
            this.initVisitChart()
            this.initPayNumChart()
        }
    }
</script>

<style scoped lang="less">
    .index {
        .echarts {
            width: 100%;
            height: 60px;
        }
        .chart-container {
            height: 60px;
            line-height: 60px;
        }
        .progress-container {
            height: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .vue-grid-item {
            &:nth-child(1)  {

            }
            &:nth-child(2) {

            }
            &:nth-child(3) {

            }
            &:nth-child(4) {

            }
            background: #fff;
        }
        /deep/ .el-card__body {
            padding: 10px !important;
        }
        /deep/ .el-progress-bar__outer {
            border-radius: 0px;
        }
        /deep/ .el-progress-bar__inner {
            border-radius: 0px;
        }
    }
</style>