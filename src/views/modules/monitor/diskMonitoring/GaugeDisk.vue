<template>
    <div class="gauge-disk">
        <v-chart :options="options.gauge" auto-resize></v-chart>
        <el-row class = "flex items-center">
            <el-col :span="12" class="text-right pr-1">使用率</el-col>
            <el-col :span="12" class="text-left pl-1 gauge-disk-value">{{usePercentage}}</el-col>
        </el-row>
        <el-row  class = "flex items-center">
            <el-col :span="12" class="text-right pr-1">剩余/总量</el-col>
            <el-col :span="12" class="text-left pl-1 gauge-disk-value">{{useDetail}}</el-col>
        </el-row>
    </div>
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/gauge'

    export default {
        name: "GaugeDisk",
        props: {
            datas: {
                type: Object
            }
        },
        components: {
            'v-chart': ECharts,
        },
        data() {
            return {
                options: {
                    gauge: {

                    }
                }
            }
        },
        computed: {
            useDetail() {
                let {max, rest} = this.datas
                return `${(rest / 1024 ** 3).toFixed()}G / ${(max / 1024 ** 3).toFixed()}G`
            },
            usePercentage() {
                let {value} = this.datas
                return value + '%'
            }
        },
        methods: {
            initChat() {
                debugger;
                let {value, name, max, rest} = this.datas
                //let usePercentage = `${(rest/1024**3).toFixed()} / ${(max/1024**3).toFixed()}G`
                debugger;
                this.options = {
                    ...this.options,
                    gauge: {
                        series: [
                            {
                                type: 'gauge',
                                detail: {formatter: '{value}%'},
                                radius: "90%", //仪表大小
                                center: ['50%', '60%'], // 默认全局居中
                                startAngle: 200,		// 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
                                endAngle: -20,
                                min: 0,					// 最小的数据值,默认 0 。映射到 minAngle。
                                max: 9,				// 最大的数据值,默认 100 。映射到 maxAngle。
                                splitNumber: 9,
                                axisLine: {
                                    lineStyle: {
                                        width: 18,
                                        color: [
                                            [(max - rest) / max, '#40a9ff'],
                                            [1, '#ccc']
                                        ]
                                    }
                                },
                                axisTick: { // 坐标轴小标记
                                    show: false,
                                    splitNumber: 10, // 每份split细分多少段
                                    length: 12, // 属性length控制线长
                                    lineStyle: { // 属性lineStyle控制线条样式
                                        color: 'auto'
                                    }
                                },
                                axisLabel: {    // 坐标轴文本标签，详见axis.axisLabel
                                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                        color: '#545454',
                                        fontWeight: 'bolder',
                                        fontSize: 16,
                                    },
                                    distance: 16
                                },
                                splitLine: {
                                    show: false,
                                    length: 10,
                                    lineStyle: {
                                        color: '#8c929d',
                                        width: 2
                                    }
                                },
                                pointer: {          //指针样式
                                    length: '60%',
                                    color: "#4A90E2"
                                },
                                title: {
                                    offsetCenter: [0, "50%"],
                                },
                                detail: {
                                    offsetCenter: [0, "90%"],
                                    textStyle: {            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                        color: '#545454',
                                        fontSize: 36
                                    },
                                    formatter: (value) => {
                                        //return `${value * 10}% ${usePercentage}`
                                        return ''
                                    },
                                },
                                data: [
                                    {
                                        value: value / 10,
                                        name,
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        },
        mounted() {
            this.initChat()
        }
    }
</script>

<style scoped lang="less">
    .gauge-disk {
        .echarts {
            width: 100%;
            height: 220px;
        }
        &-value{
            color: #666;
            font-size: 20px;
            font-weight: bold;
        }
    }
</style>