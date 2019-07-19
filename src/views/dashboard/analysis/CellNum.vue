<template>
    <div class = "cell-num">
        <v-chart :options="options.cellNum" auto-resize></v-chart>
    </div>
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip';

    export default {
        name: "CellNum",
        components: {
            'v-chart': ECharts
        },
        data(){
            return {
                options : {
                    cellNum : {

                    }
                }
            }
        },
        methods : {
            initCellNumCharts(xData = [],yData = []){
                this.options = {
                    ...this.options,
                    cellNum : {
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
            this.initCellNumCharts()
        }
    }
</script>

<style scoped lang = "less">
    .cell-num{
        .echarts {
            width: 100%;
            height: 300px;
        }
    }
</style>