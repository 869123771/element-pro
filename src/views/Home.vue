<template>
    <div class="home">
        <Row class="py-3">
            <collapse-card :cardProps="cardProps">
                <Row>
                    <Col span="6" :class="card.class" v-for="(card,index) in cardList" :key="index">
                        <Card dis-hover>
                            <span slot="title">{{card.title}}</span>
                            <div class="d-flex justify-content-between align-items-center">
                                <i class="iconfont home-card-size" :class="card.icon"></i>
                                <span class="home-card-size">{{card.num}}</span>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </collapse-card>
        </Row>
        <Row class = "mb-3">
            <collapse-card :cardProps="visitCardProps">
                <v-chart :options="options" auto-resize></v-chart>
            </collapse-card>
        </Row>
    </div>
</template>
<script>
    import CollapseCard from '@/components/CollapseCard'
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip';
    export default {
        name: "Home",
        components: {
            CollapseCard,
            'v-chart': ECharts
        },
        data() {
            return {
                cardProps: {
                    title: '业务分析',
                },
                visitCardProps: {
                    title: 'API实时访问量'
                },
                cardList: [
                    {title: '今日访问量', icon: 'icon-visit', num: '88888', class: 'pr-3'},
                    {title: 'API使用量', icon: 'icon-api-use', num: '53214', class: 'pr-3'},
                    {title: 'API总数', icon: 'icon-api-total', num: '862355', class: 'pr-3'},
                    {title: '数据源总数', icon: 'icon-db-total', num: '635421', class: ''},
                ],
                options: {
                    title: {
                        text: '堆叠区域图'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '联盟广告',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '视频广告',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            data: [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name: '直接访问',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data: [320, 332, 301, 334, 390, 330, 320]
                        },
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
                            areaStyle: {normal: {}},
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                }


            }
        }
    };
</script>
<style scoped lang="less">
    .home {
        &-card-size {
            font-size: 36px;
        }
    }
</style>
<style>
    .echarts {
        width: 100%;
        height: 400px;
    }
</style>
