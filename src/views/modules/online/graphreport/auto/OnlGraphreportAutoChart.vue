<template>
    <div class = "p-3 m-3 bg-white">
        <el-row class = "mb-3">
            <el-card>
                <div slot = "header">{{chartProps.head.name}}</div>
                <el-row>
                    <template v-if = "isDouble">
                        <template v-if = "isIncludesTable && isEven">
                            <template v-for = "(item,index) in expectTableType">
                                <template v-if = "index === expectTableType.length - 1">
                                    <el-col :span = "24">
                                        <template v-if = "item === 'bar'">
                                            <bar :data = "bar"></bar>
                                        </template>
                                    </el-col>
                                    <el-col :span = "24">
                                        <template v-if = "item === 'pie'">
                                            <pie :data = "pie"></pie>
                                        </template>
                                    </el-col>
                                    <el-col :span = "24">
                                        <template v-if = "item === 'line'">
                                            <line-char :data = "line"></line-char>
                                        </template>
                                    </el-col>
                                </template>
                                <template v-else>
                                    <el-col :span = "12">
                                        <template v-if = "item === 'bar'">
                                            <bar :data = "bar"></bar>
                                        </template>
                                    </el-col>
                                    <el-col :span = "12">
                                        <template v-if = "item === 'pie'">
                                            <pie :data = "pie"></pie>
                                        </template>
                                    </el-col>
                                    <el-col :span = "12">
                                        <template v-if = "item === 'line'">
                                            <line-char :data = "line"></line-char>
                                        </template>
                                    </el-col>
                                </template>
                            </template>
                        </template>
                    </template>
                    <template v-else-if = "chartProps.head.displayTemplate === 'single'">
                        <template v-for = "(item,index) in expectTableType">
                            <el-row>
                                <el-col :span = "24">
                                    <template v-if = "item === 'bar'">
                                        <bar :data = "bar"></bar>
                                    </template>
                                </el-col>
                                <el-col :span = "24">
                                    <template v-if = "item === 'pie'">
                                        <pie :data = "pie"></pie>
                                    </template>
                                </el-col>
                                <el-col :span = "24">
                                    <template v-if = "item === 'line'">
                                        <line-char :data = "line"></line-char>
                                    </template>
                                </el-col>
                            </el-row>
                        </template>
                    </template>
                    <template v-else-if = "chartProps.head.displayTemplate === 'tab'">
                        <el-button-group>
                            <template v-for = "(item,index) in expectTableType">
                                <el-button :plain = "tabChar.active === item ? false : true" :type = "tabChar.active === item ? 'primary' : ''" @click = "showChar(item)">{{onlineGraphType.find(v=>v.itemValue === item).itemText}}</el-button>
                            </template>
                        </el-button-group>
                        <el-row>
                            <el-col :span = "24">
                                <template v-if = "tabChar.active === 'bar'">
                                    <bar :data = "bar"></bar>
                                </template>
                            </el-col>
                            <el-col :span = "24">
                                <template v-if = "tabChar.active === 'pie'">
                                    <pie :data = "pie"></pie>
                                </template>
                            </el-col>
                            <el-col :span = "24">
                                <template v-if = "tabChar.active === 'line'">
                                    <line-char :data = "line"></line-char>
                                </template>
                            </el-col>
                        </el-row>
                    </template>
                </el-row>
            </el-card>
        </el-row>
        <el-row>
            <template v-if = "isIncludesTable">
                <el-card>
                    <div slot = "header">数据明细</div>
                    <list :data = table></list>
                </el-card>
            </template>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {remove} from '30-seconds-of-code'
    import List from './onlGraphreportAutoChart/List'
    import Bar from './onlGraphreportAutoChart/Bar'
    import Pie from './onlGraphreportAutoChart/Pie'
    import LineChar from './onlGraphreportAutoChart/Line'

    export default {
        name: "OnlGraphreportAutoChart",
        components : {
            List,
            Bar,
            Pie,
            LineChar
        },
        data(){
            return {
                chartProps : {

                },
                tabChar : {
                    active : 'pie',
                },
                table : {
                    column : [],
                    data : []
                },
                bar : {
                    xData : [],
                    yData : []
                },
                pie : {
                    data : []
                },
                line : {
                    xData : [],
                    yData : []
                },
            }
        },
        computed : {
            ...mapState({
                onlineGraphType : ({dict}) => dict.onlineGraphType
            }),
            isDouble(){
                let flag = false
                let {head:{displayTemplate}} = this.chartProps
                if(displayTemplate === 'double'){
                    flag = true
                }
                return flag
            },
            isIncludesTable(){
                let flag = false
                let {head:{graphType}} = this.chartProps
                if(graphType.includes('table')){
                    flag = true
                }
                return flag
            },
            expectTableType(){
                let {head:{graphType}} = this.chartProps
                let graphTypeList = graphType.split(',')
                if(this.isIncludesTable){
                    remove(graphTypeList,v=>v==='table')
                }
                return graphTypeList
            },
            isEven(){
                let flag = false
                let {head:{graphType}} = this.chartProps
                let graphTypeList = graphType ? graphType.split(',') : []
                if(graphTypeList.length % 2 === 0){
                    flag = true
                }
                return flag
            },
        },
        methods : {
            initBar({parseData,xaxisField,yaxisField}){
                const xData = parseData.map(item=>item[xaxisField])
                const yData = parseData.map(item=>item[yaxisField])
                this.bar = {
                    ...this.bar,
                    xData,
                    yData
                }
            },
            initPie({parseData,xaxisField,yaxisField}){
                const data = parseData.map(item=>{
                    return {
                        name : item[xaxisField],
                        value : item[yaxisField],
                    }
                })
                debugger;
                this.pie = {
                    ...this.pie,
                    data
                }
            },
            initLine({parseData,xaxisField,yaxisField}){
                const xData = parseData.map(item=>item[xaxisField])
                const yData = parseData.map(item=>item[yaxisField])
                this.line = {
                    ...this.line,
                    xData,
                    yData
                }
            },
            showChar(active){
                this.tabChar = {
                    ...this.tabChar,
                    active
                }
            },
            async getCharData(){
                let {params : {code:id}} = this.$route
                let params = {
                    params : '',
                    id
                }
                let {success,result} = await http.get(apiList.online_graph_get_char_data,params)
                if(success){
                  let {head,head:{dataType,cgrSql,xaxisField,yaxisField},data,dictOptions,items} = result
                    this.chartProps = {
                      head,dictOptions,items
                  }
                  let {column} = this.table
                  items.forEach(({fieldName,fieldTxt})=>{
                      column.push({label : fieldTxt, prop : fieldName})
                  })
                    column.unshift({type : 'index'})
                    debugger;
                  if(dataType === 'sql'){
                      this.table = {
                          ...this.table,
                          data
                      }
                      this.initBar({parseData:data,xaxisField,yaxisField})
                      this.initPie({parseData:data,xaxisField,yaxisField})
                      this.initLine({parseData:data,xaxisField,yaxisField})
                  }else{
                      let parseData = JSON.parse(cgrSql)
                      this.table = {
                          ...this.table,
                          data : parseData
                      }
                      this.initBar({parseData,xaxisField,yaxisField})
                      this.initPie({parseData,xaxisField,yaxisField})
                      this.initLine({parseData,xaxisField,yaxisField})
                  }
                }

            },
        },
        mounted(){
            this.getCharData()
        }
    }
</script>

<style scoped>

</style>