<template>
    <div class = "p-3 m-3 bg-white">
        <el-row>
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
                                </template>
                            </template>
                        </template>
                    </template>
                    <template v-else-if = "chartProps.head.displayTemplate === 'single'">

                    </template>
                    <template v-else-if = "chartProps.head.displayTemplate === 'tab'">

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
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {remove} from '30-seconds-of-code'
    import List from './onlGraphreportAutoChart/List'
    import Bar from './onlGraphreportAutoChart/Bar'
    import Pie from './onlGraphreportAutoChart/Pie'

    export default {
        name: "OnlGraphreportAutoChart",
        components : {
            List,
            Bar,
            Pie
        },
        data(){
            return {
                chartProps : {

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
                }
            }
        },
        computed : {
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
                  }else{
                      let parseData = JSON.parse(cgrSql)
                      this.table = {
                          ...this.table,
                          data : parseData
                      }
                      this.initBar({parseData,xaxisField,yaxisField})
                      this.initPie({parseData,xaxisField,yaxisField})
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