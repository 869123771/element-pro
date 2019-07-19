<template>
    <div class = "index">

        <grid-layout :layout="layout"
                     :col-num="12"
                     :row-height="30"
                     :is-draggable="draggable"
                     :is-resizable="resizable"
                     :vertical-compact="true"
                     :use-css-transforms="true"
        >
            <grid-item v-for="item in layout"
                       :static="item.static"
                       :x="item.x"
                       :y="item.y"
                       :w="item.w"
                       :h="item.h"
                       :i="item.i"
            >
                <span class="text">{{itemTitle(item)}}</span>
            </grid-item>
        </grid-layout>


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
                            <v-chart :options="options.payNum" auto-resize></v-chart>
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
                        <div class = "progress-container">
                            <el-progress :show-text = "false" :stroke-width="26" :percentage="78"></el-progress>
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
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip';

    import dayjs from 'dayjs'
    import VueGridLayout from 'vue-grid-layout';


    const xData = [] ,yData = []
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
        components: {
            ChartCard,
            'v-chart': ECharts,
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem
        },
        data() {
            let layout = [
                {"x":0,"y":0,"w":2,"h":2,"i":"0", static: false},
                {"x":2,"y":0,"w":2,"h":4,"i":"1", static: true},
                {"x":4,"y":0,"w":2,"h":5,"i":"2", static: false},
                {"x":6,"y":0,"w":2,"h":3,"i":"3", static: false},
                {"x":8,"y":0,"w":2,"h":3,"i":"4", static: false},
                {"x":10,"y":0,"w":2,"h":3,"i":"5", static: false},
                {"x":0,"y":5,"w":2,"h":5,"i":"6", static: false},
                {"x":2,"y":5,"w":2,"h":5,"i":"7", static: false},
                {"x":4,"y":5,"w":2,"h":5,"i":"8", static: false},
                {"x":6,"y":3,"w":2,"h":4,"i":"9", static: true},
                {"x":8,"y":4,"w":2,"h":4,"i":"10", static: false},
                {"x":10,"y":4,"w":2,"h":4,"i":"11", static: false},
                {"x":0,"y":10,"w":2,"h":5,"i":"12", static: false},
                {"x":2,"y":10,"w":2,"h":5,"i":"13", static: false},
                {"x":4,"y":8,"w":2,"h":4,"i":"14", static: false},
                {"x":6,"y":8,"w":2,"h":4,"i":"15", static: false},
                {"x":8,"y":10,"w":2,"h":5,"i":"16", static: false},
                {"x":10,"y":4,"w":2,"h":2,"i":"17", static: false},
                {"x":0,"y":9,"w":2,"h":3,"i":"18", static: false},
                {"x":2,"y":6,"w":2,"h":2,"i":"19", static: false}
            ];

            return {
                options: {
                    visit: {

                    },
                    payNum : {

                    },
                },
                layout: layout,
                draggable: true,
                resizable: true,
            }
        },
        methods : {
            itemTitle(item) {
                let result = item.i;
                if (item.static) {
                    result += " - Static";
                }
                return result;
            },
            initVisitChart(){
                this.options = {
                    ...this.options,
                    visit : {
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
            initPayNumChart(){
                this.options = {
                    ...this.options,
                    payNum : {
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
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color : (params) =>{
                                            let colorList = ['#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ];
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
            this.initVisitChart()
            this.initPayNumChart()
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
        .progress-container{
            height : 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .vue-grid-item {
            background: #fff;
        }
        /deep/ .el-card__body{
            padding : 10px !important;
        }
        /deep/ .el-progress-bar__outer{
            border-radius : 0px;
        }
        /deep/ .el-progress-bar__inner{
            border-radius : 0px;
        }
    }
</style>