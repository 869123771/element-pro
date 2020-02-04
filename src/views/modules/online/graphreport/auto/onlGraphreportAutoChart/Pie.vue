<template>
    <div class = "pie">
        <v-chart :options="options" auto-resize></v-chart>
    </div>
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/component/tooltip';

    export default {
        name: "Pie",
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
                let {data} = this.data
                this.options = {
                    ...this.options,
                    /*tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },*/
                    series: [
                        {
                            type: 'pie',
                            radius: '55%',
                            roseType: 'angle',
                            itemStyle: {
                                normal: {
                                    color: ['#C335                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        31', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589',
                                        '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB']
                                },
                            },
                            data
                        }
                    ]
                }
            }
        }
    }
</script>

<style scoped lang = "less">
    .pie{
        .echarts {
            width: 100%;
            height: 400px;
        }
    }
</style>