<template>
    <div>
        <el-row>
            <el-form :model = "form" label-width = "80px">
                <el-form-item label = "月份统计" class = "ml-5">
                    <el-date-picker type="month" v-model = "form.date" @change = "dateChange" value-format="yyyy-MM">

                    </el-date-picker>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-tabs v-model = "tabs.active">
                <el-tab-pane name = "bar" label = "柱状图">
                    <v-chart :options="options.bar" auto-resize></v-chart>
                </el-tab-pane>
                <el-tab-pane name = "pie" label = "饼图">
                    <v-chart :options="options.pie" auto-resize></v-chart>
                </el-tab-pane>
            </el-tabs>
        </el-row>
        <el-row>
            <el-divider content-position="left">详细数据</el-divider>
            <el-row class = "pb-3">
                <el-col :span = "8" class = "pr-3">
                    <el-input readonly v-model="form.expectedWorkingDays">
                        <template slot="prepend">预期工作</template>
                        <template slot="append">天</template>
                    </el-input>
                </el-col>
                <el-col :span = "8" class = "pr-3">
                    <el-input readonly v-model="form.actualWorkingDays">
                        <template slot="prepend">实际工作</template>
                        <template slot="append">天</template>
                    </el-input>
                </el-col>
                <el-col :span = "8">
                    <el-input readonly v-model="form.monthDayTotal">
                        <template slot="prepend">本月总共</template>
                        <template slot="append">天</template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row class = "pb-3">
                <el-col :span = "8" class = "pr-3">
                    <el-input readonly v-model="form.normalTotal">
                        <template slot="prepend">正常次数</template>
                        <template slot="append">次</template>
                    </el-input>
                </el-col>
                <el-col :span = "8" class = "pr-3">
                    <el-input readonly v-model="form.lateTotal">
                        <template slot="prepend">迟到次数</template>
                        <template slot="append">次</template>
                    </el-input>
                </el-col>
                <el-col :span = "8">
                    <el-input readonly v-model="form.absentTotal">
                        <template slot="prepend">旷工次数</template>
                        <template slot="append">次</template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row class = "pb-3">
                <el-col :span = "8" class = "pr-3">
                    <el-input readonly v-model="form.leaveEarlyTotal">
                        <template slot="prepend">早退次数</template>
                        <template slot="append">次</template>
                    </el-input>
                </el-col>
                <el-col :span = "8" class = "pr-3">
                    <el-input readonly v-model="form.outTotal">
                        <template slot="prepend">请假天数</template>
                        <template slot="append">天</template>
                    </el-input>
                </el-col>
                <el-col :span = "8">
                    <el-input readonly v-model="form.leaveTotal">
                        <template slot="prepend">外勤次数</template>
                        <template slot="append">次</template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row class = "pb-3">
                <el-col :span = "8" class = "pr-3">
                    <el-input readonly v-model="form.businessTravelTotal">
                        <template slot="prepend">出差天数</template>
                        <template slot="append">天</template>
                    </el-input>
                </el-col>
                <el-col :span = "8" class = "pr-3">
                    <el-input readonly v-model="form.patchTotal">
                        <template slot="prepend">补卡次数</template>
                        <template slot="append">次</template>
                    </el-input>
                </el-col>
                <el-col :span = "8">
                    <el-input readonly v-model="form.missingTotal">
                        <template slot="prepend">缺卡次数</template>
                        <template slot="append">次</template>
                    </el-input>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/legend'
    import dayjs from 'dayjs'

    export default {
        name: "SignStatistic",
        components: {
            'v-chart': ECharts,
        },
        data(){
            return {
                form : {
                    date : '',
                    expectedWorkingDays : '',                //预期工作
                    actualWorkingDays : '',                  //实际工作
                    monthDayTotal : '',                     //本月总共
                    normalTotal : '',                       //正常次数
                    lateTotal : '',                          //迟到次数
                    absentTotal : '',                        //旷工次数
                    leaveEarlyTotal : '',                   //早退次数
                    outTotal : '',                          //请假天数
                    leaveTotal : '',                        //外勤次数
                    businessTravelTotal : '',               //出差天数
                    patchTotal : '',                        //补卡次数
                    missingTotal : ''                       //缺卡次数
                },
                tabs : {
                    active : 'bar'
                },
                options : {
                    bar : {

                    },
                    pie : {

                    }
                }
            }
        },
        methods : {
            ...mapMutations({
                dialogLoading : 'DIALOG_LOADING',
            }),
            dateChange(date){
                this.queryStatisticByMonth()
            },
            initBarChart(xData,yData) {
                this.options.bar = {
                    ...this.options.bar,
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
                        top : 10,
                        left: 40,
                        right: 40,
                        bottom : 30
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
            },
            initPieChart(data) {
                this.options.pie = {
                    ...this.options.pie,
                    tooltip : {
                        trigger: 'item',
                    },
                    legend: {
                        bottom : 0,
                        data: data.map(item=>item.name),
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '55%',
                            roseType: 'angle',
                            data
                        }
                    ],
                    color: ['#C335                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        31', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589',
                        '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB']
                }
            },
            async queryStatisticByMonth(){
                this.dialogLoading(true)
                let {date} = this.form
                let [year,month] = date.split('-')
                let params = {
                    year,month
                }
                let {success,meesage,result} = await http.get(apiList.sign_sign_statistic_by_month,params)
                if(success){
                    this.dialogLoading(false)
                    let {
                        expectedWorkingDays,                //预期工作
                        actualWorkingDays,                  //实际工作
                        monthDayTotal,                     //本月总共
                        normalTotal,                       //正常次数
                        lateTotal,                          //迟到次数
                        absentTotal,                        //旷工次数
                        leaveEarlyTotal,                   //早退次数
                        outTotal,                          //请假天数
                        leaveTotal,                        //外勤次数
                        businessTravelTotal,               //出差天数
                        patchTotal,                        //补卡次数
                        missingTotal                       //缺卡次数
                    } = result
                    this.form = {
                        ...this.form,
                        expectedWorkingDays,                //预期工作
                        actualWorkingDays,                  //实际工作
                        monthDayTotal,                     //本月总共
                        normalTotal,                       //正常次数
                        lateTotal,                          //迟到次数
                        absentTotal,                        //旷工次数
                        leaveEarlyTotal,                   //早退次数
                        outTotal,                          //请假天数
                        leaveTotal,                        //外勤次数
                        businessTravelTotal,               //出差天数
                        patchTotal,                        //补卡次数
                        missingTotal
                    }
                    let barData = [
                        [
                            '正常打卡','迟到','旷工','早退','补卡','外勤','出差','请假','缺卡'
                        ],
                        [
                            normalTotal,lateTotal,absentTotal,leaveEarlyTotal,outTotal,leaveTotal, businessTravelTotal, patchTotal, missingTotal
                        ]
                    ]
                    let pieChart = new Array(9).fill().map((_v,i)=>{
                        let [xData,yData] = barData
                        return {
                            name : xData[i],
                            value : yData[i]
                        }
                    })
                    this.initBarChart(...barData)
                    this.initPieChart(pieChart)
                }else{
                    this.dialogLoading(false)
                    sweetAlert.errorWithTimer(meesage)
                }
            }
        },
        mounted() {
            this.form = {
                ...this.form,
                date : dayjs().format('YYYY-MM')
            }
            this.queryStatisticByMonth()
        }
    }
</script>

<style scoped lang = "less">
    /deep/ .echarts{
        width : 100%;
        height : 350px;
        div{
            width : 100%;
        }
    }
</style>