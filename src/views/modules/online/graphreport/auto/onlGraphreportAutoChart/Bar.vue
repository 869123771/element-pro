<template>
    <div class = "bar">
        <v-chart :options="options" autoresize></v-chart>
    </div>
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip';

    export default {
        name: "Bar",
        components: {
            'v-chart': ECharts,
        },
        props : {
            data : {
                type : Object
            }
        },
        data() {
            return {
                options: {},
            }
        },
        watch : {
            data : {
                handler(props){
                    if(props){
                        this.initChar()
                    }
                },
                immediate : true
            }
        },
        methods: {
            initChar() {
                let {xData,yData} = this.data
                this.options = {
                    ...this.options,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
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
                            type: 'category',
                            //boundaryGap: false,
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
                            type: 'bar',
                            barWidth: 50,
                            barGap: '50%',
                            itemStyle: {
                                normal: {
                                    color: (params) => {
                                        let colorList = ['#C335                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        31', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB'];
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
    }
</script>

<style scoped lang = "less">
    .bar{
        .echarts {
            width: 100%;
            height: 400px;
        }
    }
</style>