<template>
    <div class = "analyze">
        <quota-explain></quota-explain>
        <chart-card class = "my-3">
            <div slot = "card-head" class = "relative">
                <el-tabs v-model="tabs.name">
                    <el-tab-pane label="销售额" name="cellNum">
                        <cell-num></cell-num>
                    </el-tab-pane>
                    <el-tab-pane label="访问量" name="visitNum">

                    </el-tab-pane>
                </el-tabs>
                <div class = "flex float-left absolute top-1 right-0">
                    <div>
                        <el-button-group>
                            <el-button type = "text">今日</el-button>
                            <el-button type = "text" class = "ml-3">本周</el-button>
                            <el-button type = "text" class = "ml-3">本月</el-button>
                            <el-button type = "text" class = "ml-3">本年</el-button>
                        </el-button-group>
                    </div>
                    <div class = "mx-3">
                        <el-date-picker
                                v-model="chart.range"
                                type="daterange"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
            </div>
        </chart-card>
    </div>
</template>

<script>
    import QuotaExplain from './analysis/QuotaExplain'
    import ChartCard from './analysis/ChartCard'
    import CellNum from "./analysis/CellNum";

    export default {
        name: "Analysis",
        components : {
            CellNum,
            QuotaExplain,
            ChartCard
        },
        data(){
            return {
                tabs : {
                    name : 'cellNum',
                },
                chart : {
                    range : ''
                }
            }
        }
    }
</script>

<style scoped lang = "less">
    .analyze{
        .top-1{
            top : -0.25rem;
        }
    }
</style>
