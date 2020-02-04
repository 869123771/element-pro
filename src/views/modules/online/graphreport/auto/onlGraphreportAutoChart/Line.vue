<template>
    <div class="line">
        <v-chart :options="options" auto-resize></v-chart>
    </div>
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip';

    export default {
        name: "LineChar",
        components: {
            'v-chart': ECharts,
        },
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                options: {},
            }
        },
        watch: {
            data: {
                handler(props) {
                    if (props) {
                        this.initChar()
                    }
                },
                immediate: true
            }
        },
        methods: {
            initChar() {
                let {xData, yData} = this.data
                this.options = {
                    ...this.options,
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
                        left: '80',
                        right: '50',
                    },
                    xAxis: [
                        {
                            axisTick: {
                                show: false
                            },
                            splitLine: {            //网格线
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'rgba(204,204,204,1)',
                                },
                            },
                            axisLabel: {
                                color: 'black',
                                rotate : 20
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
                            name: '搜索引擎',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            /*areaStyle: {
                                normal: {
                                    color: '#1890ff'    //改变区域颜色
                                },
                            },*/
                            itemStyle: {
                                normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: '#1890ff'
                                },
                            },
                            //symbol: 'none',             //取消折点圆圈
                            smooth: true,
                            data: yData
                        }
                    ]
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .line {
        .echarts {
            width: 100%;
            height: 400px;
        }
    }
</style>