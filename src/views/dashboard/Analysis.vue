<template>
    <div class="analyze">
        <el-row>
            <quota-explain :info="topCard"></quota-explain>
        </el-row>
        <el-row class="m-3 mt-0">
            <chart-card>
                <div slot="card-head" class="relative">
                    <el-tabs v-model="tabs.name">
                        <el-tab-pane label="销售额" name="cellNum">
                            <cell-num ref = "cellNum"></cell-num>
                        </el-tab-pane>
                        <el-tab-pane label="访问量" name="visitNum">
                            <visit-num ref = "visitNum"></visit-num>
                        </el-tab-pane>
                    </el-tabs>
                    <div class="flex float-left absolute top-1 right-0">
                        <div>
                            <el-button-group>
                                <el-button type="text">今日</el-button>
                                <el-button type="text" class="ml-3">本周</el-button>
                                <el-button type="text" class="ml-3">本月</el-button>
                                <el-button type="text" class="ml-3">本年</el-button>
                            </el-button-group>
                        </div>
                        <div class="mx-3">
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
        </el-row>
        <el-row class="m-3">
            <chart-card>
                <div slot="card-head">最近一周访问次数统计</div>
                <div slot="card-content">
                    <el-row class="mt-4">
                        <el-col :span="8" class="pr-3">
                            <div class="card-panel">
                                <div class="card-panel-icon-wrapper icon-location">
                                    <i class="el-icon-location-outline card-panel-icon"></i>
                                </div>
                                <div class="card-panel-description">
                                    <div class="card-panel-text">
                                        今日访IP问数
                                    </div>
                                    <count-to :start-val="0" :end-val="info.ipVisit.num"
                                              :duration="info.ipVisit.duration" class="card-panel-num"/>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8" class="pr-3">
                            <div class="card-panel">
                                <div class="card-panel-icon-wrapper icon-people">
                                    <i class="el-icon-user-solid card-panel-icon"></i>
                                </div>
                                <div class="card-panel-description">
                                    <div class="card-panel-text">
                                        今日访问次数
                                    </div>
                                    <count-to :start-val="0" :end-val="info.timesVisit.num"
                                              :duration="info.timesVisit.duration" class="card-panel-num"/>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="card-panel">
                                <div class="card-panel-icon-wrapper icon-visit">
                                    <i class="el-icon-bell card-panel-icon"></i>
                                </div>
                                <div class="card-panel-description">
                                    <div class="card-panel-text">
                                        访问总次数
                                    </div>
                                    <count-to :start-val="0" :end-val="info.totalVisit.num"
                                              :duration="info.totalVisit.duration" class="card-panel-num"/>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </chart-card>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList} from '@/utils'
    import CountTo from 'vue-count-to'
    import QuotaExplain from './analysis/QuotaExplain'
    import ChartCard from './analysis/ChartCard'
    import CellNum from "./analysis/CellNum";
    import VisitNum from './analysis/VisitNum'

    export default {
        name: "Analysis",
        components: {
            CountTo,
            CellNum,
            VisitNum,
            QuotaExplain,
            ChartCard
        },
        data() {
            return {
                tabs: {
                    name: 'cellNum',
                },
                chart: {
                    range: ''
                },
                info: {
                    ipVisit: {
                        num: 0,
                        duration: 2600
                    },
                    timesVisit: {
                        num: 0,
                        duration: 3000
                    },
                    totalVisit: {
                        num: 0,
                        duration: 4000
                    }

                },
                topCard: {
                    cellNum: {
                        num: 126560,
                        duration: 3000
                    },
                    visitNum: {
                        num: 8846,
                        duration: 3000
                    },
                    payCount: {
                        num: 6560,
                        duration: 3000
                    },
                    operateEffect: {
                        num: 78,
                        duration: 3000
                    }
                },
                call: ''
            }
        },
        methods: {
            initValue() {
                let {ipVisit, timesVisit, totalVisit} = this.info
                this.info = {
                    ...this.info,
                    ipVisit: {
                        ...ipVisit,
                        num: 0
                    },
                    timesVisit: {
                        ...timesVisit,
                        num: 0
                    },
                    totalVisit: {
                        ...totalVisit,
                        num: 0
                    },
                }

            },
            initTopCardValue(){
                let {cellNum,visitNum,payCount,operateEffect} = this.topCard
                this.topCard = {
                    cellNum: {
                        ...cellNum,
                        num: 0,
                    },
                    visitNum: {
                        ...visitNum,
                        num: 0,
                    },
                    payCount: {
                        ...payCount,
                        num: 0,
                    },
                    operateEffect: {
                        ...operateEffect,
                        num: 0,
                    }
                }
            },
            getVisitNum(){
                this.$refs.visitNum.initVisitNumCharts()
            },
            getCellNum(){
                this.$refs.cellNum.initCellNumCharts()
            },
            getTopCardInfo() {
                this.initTopCardValue()
                this.$nextTick(()=>{
                    this.topCard = {
                        cellNum: {
                            num: 126560,
                            duration: 3000
                        },
                        visitNum: {
                            num: 8846,
                            duration: 3000
                        },
                        payCount: {
                            num: 6560,
                            duration: 3000
                        },
                        operateEffect: {
                            num: 78,
                            duration: 3000
                        }
                    }
                })
            },
            async getLoginInfo() {
                this.initValue()
                let {success, result} = await http.get(apiList.home_login_info)
                if (success) {
                    let {todayIp, todayVisitCount, totalVisitCount} = result
                    let {ipVisit, timesVisit, totalVisit} = this.info
                    this.info = {
                        ...this.info,
                        ipVisit: {
                            ...ipVisit,
                            num: todayIp
                        },
                        timesVisit: {
                            ...timesVisit,
                            num: todayVisitCount
                        },
                        totalVisit: {
                            ...totalVisit,
                            num: totalVisitCount
                        },
                    }
                }
            },
            cycleCall() {
                this.call = setInterval(() => {
                    this.getLoginInfo()
                    this.getTopCardInfo()
                    this.getCellNum()
                    this.getVisitNum()
                }, 8000)
            },
            stopCall() {
                clearInterval(this.call)
            },
        }
        ,
        mounted() {
            this.cycleCall()
            this.getLoginInfo()
            this.getTopCardInfo()
        }
        ,
        destroyed() {
            this.stopCall()
        }
    }
</script>

<style scoped lang="less">
    .analyze {
        .top-1 {
            top: -0.25rem;
        }
        .card-panel {
            height: 108px;
            cursor: pointer;
            font-size: 12px;
            position: relative;
            overflow: hidden;
            color: #666;
            background: #f0f2f5;
            box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
            border-color: rgba(0, 0, 0, .05);
            &:hover {
                .card-panel-icon-wrapper {
                    color: #fff;
                }
                .icon-people {
                    background: #40c9c6;
                }
                .icon-location {
                    background: #36a3f7;
                }
                .icon-visit {
                    background: #f4516c;
                }
            }
            .icon-people {
                color: #40c9c6;
            }
            .icon-location {
                color: #36a3f7;
            }
            .icon-visit {
                color: #f4516c;
            }
            .card-panel-icon-wrapper {
                float: left;
                margin: 14px 0 0 14px;
                padding: 16px;
                transition: all 0.38s ease-out;
                border-radius: 6px;
            }
            .card-panel-icon {
                float: left;
                font-size: 48px;
            }
            .card-panel-description {
                float: right;
                font-weight: bold;
                margin: 26px;
                margin-left: 0px;
                .card-panel-text {
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 16px;
                    margin-bottom: 12px;
                }
                .card-panel-num {
                    font-size: 20px;
                }
            }
        }
    }
</style>
