<template>
    <div class="modify">
        <el-row>
            <el-form ref="form" :model="form" label-width="100px" :rules="rules" status-icon>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="图表名称" prop = "name">
                            <el-input v-model="form.name" placeholder="图表名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="编码" prop = "code" :rules = "[
                    {required : true, message : '必填',trigger : 'change'},
                    data.id ? {} : {validator : uniqueCheck}
                ]">
                            <el-input v-model="form.code" placeholder="编码" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="展示模版" prop = "displayTemplate">
                            <el-select v-model="form.displayTemplate" placeholder="展示模版" clearable filterable class = "w-full">
                                <template v-for = "{itemValue,itemText} in onlineGraphDisplayTemplate">
                                    <el-option :value = "itemValue" :label = "itemText"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="X轴字段" prop = "xaxisField">
                            <el-input v-model="form.xaxisField" placeholder="X轴字段" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="Y轴字段" prop = "yaxisField">
                            <el-select v-model="form.yaxisField" placeholder="Y轴字段" multiple allow-create filterable clearable
                                       default-first-option class = "w-full">
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="数据类型" prop = "dataType">
                            <el-select v-model="form.dataType" placeholder="数据类型" clearable filterable class = "w-full" @change = "dataTypeChange">
                                <template v-for = "{itemValue,itemText} in onlineGraphDataType">
                                    <el-option :value = "itemValue" :label = "itemText"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="图表类型" prop = "graphType">
                            <el-select v-model="form.graphType" placeholder="图表类型" multiple clearable filterable class = "w-full">
                                <template v-for = "{itemValue,itemText} in onlineGraphType">
                                    <el-option :value = "itemValue" :label = "itemText"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="描述" prop = "content">
                        <el-input type = "textarea" v-model="form.content" placeholder="描述" clearable></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item :label="labelType" :rules = "{required : true, message : '必填',trigger : 'change'}">
                        <monaco-editor :editor-props = "sql"
                                       @onCodeChange = "onCodeChange"
                                       height = "200px"
                                       v-model = "form.cgrSql"
                        >
                        </monaco-editor>
                        <el-row class = "pt-3" v-if = "form.dataType === 'sql'">
                            <el-button type = "primary" @click = "parseSql" :loading = "loading">解析SQL</el-button>
                        </el-row>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="JS增强">
                        <monaco-editor :editor-props = "js"
                                       @onCodeChange = "onCodeChange"
                                       height = "200px"
                                       v-model = "form.extendJs"
                        >
                        </monaco-editor>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-row>
        <el-row>
            <el-tabs v-model = "tabs.active">
                <el-row class = "pb-3">
                    <el-button type = "primary" icon = "el-icon-plus" @click = "add">新增</el-button>
                    <el-button plain icon = "el-icon-minus" @click = "minus" v-show = "show.del">删除</el-button>
                </el-row>
                <el-tab-pane label="列表字段" name="listFields">
                    <el-row>
                        <fox-table
                                v-if="table.show"
                                v-loading="table.loading"
                                :column="table.column"
                                :data="table.data"
                                @selection-change="selection"
                        ></fox-table>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import foxTable from '@/components/fox-table'
    import MonacoEditor from '@/components/editor/MonacoEditor'
    import {isEmpty} from '30-seconds-of-code'
    import {difference} from '30-seconds-of-code'

    export default {
        name: "Modify",
        components: {
            foxTable,
            MonacoEditor
        },
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                loading : false,
                show : {
                    del : false
                },
                form: {},
                tabs : {
                    active : 'listFields'
                },
                select : {
                    dataSource : [],
                    fieldType : [
                        {value : 'Number',label : '数值类型'},
                        {value : 'String',label : '字符类型'},
                        {value : 'Date',label : '日期类型'},
                        {value : 'Time',label : '时间类型'},
                        {value : 'Long',label : '长整型'},
                    ],
                    searchMode : [
                        {value : 'single',label : '单条件查询'},
                        {value : 'group',label : '范围查询'},
                    ]
                },
                sql: {
                    code: '',
                    language: 'sql',
                    theme : 'vs-dark'
                },
                js : {
                    code: '',
                    language: 'javascript',
                    theme : 'vs-dark'
                },
                table : {
                    column: [],
                    data: [],
                    selection: [],
                    loading: false,
                    show: true
                },
                rules: {
                    name : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                    code : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                    yaxisText : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                    xaxisText : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                    dbSource : [
                        {required : true, message : '必填', trigger : 'change'}
                    ]
                }
            };
        },
        computed: {
            ...mapState({
                onlineGraphDisplayTemplate : ({dict}) => dict.onlineGraphDisplayTemplate,
                onlineGraphDataType : ({dict}) => dict.onlineGraphDataType,
                onlineGraphType : ({dict}) => dict.onlineGraphType
            }),
            labelType(){
               return this.form.dataType === 'sql' ? '查询SQL' : '数据JSON'
            }
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        let {id,code,name,displayTemplate,xaxisField,yaxisField,dataType,graphType,content,cgrSql,extendJs} = props
                        graphType = graphType ? graphType.split(',') : []
                        yaxisField = yaxisField ? yaxisField.split(',') : []
                        this.form = {
                            code,name,displayTemplate,xaxisField,yaxisField,dataType,graphType,content,cgrSql,extendJs
                        }
                        this.sql = {
                            ...this.sql,
                            code : cgrSql
                        }
                        this.js = {
                            ...this.js,
                            code : extendJs
                        }
                        this.queryGraphById(id)
                    }
                    this.setI18n()
                },
                immediate: true
            },
        },
        methods: {
            ...mapActions({
                getOnlineGraphDisplayTemplate : 'GET_ONLINE_GRAPH_DISPLAY_TEMPLATE',
                getOnlineGraphDataType : 'GET_ONLINE_GRAPH_DATA_TYPE',
                getOnlineGraphType : 'GET_ONLINE_GRAPH_TYPE',
            }),
            add(){
                let {data} = this.table
                let row = {
                    fieldName : '',
                    orderNum : data.length + 1,
                    fieldTxt : '',
                    fieldType : '',
                    isShow : 1,
                    fieldHref : '',
                    searchMode : '',
                    replaceVal : '',
                    dictCode : '',
                    isSearch : 0,
                }
                this.table.data.push(row)
            },
            minus(){
                let {data,selection} = this.table
                this.table = {
                    ...this.table,
                    data : difference(data,selection)
                }
            },
            onCodeChange(code){
                this.form = {
                    ...this.form,
                    cgrSql : code
                }
            },
            dataTypeChange(value){
                if(value === 'sql'){
                    this.sql = {
                        ...this.sql,
                        language : 'sql'
                    }
                }else{
                    this.sql = {
                        ...this.sql,
                        language : 'json'
                    }
                }
            },
            selection(selection) {
                if (selection.length) {
                    this.show = {
                        ...this.show,
                        del: true
                    }
                } else {
                    this.show = {
                        ...this.show,
                        del: false
                    }
                }
                this.table = {
                    ...this.table,
                    selection
                }
            },
            async uniqueCheck(rule, fieldVal, callback){
                let params = {
                    tableName : 'onl_graphreport_head',
                    fieldName: 'code',
                    fieldVal,
                }
                let {success,message} = await http.get(apiList.sys_dict_unique_check,params)
                if(!success){
                    callback(new Error(message));
                }else{
                    callback();
                }
            },
            async queryGraphById(id){
                let {success,result} = await http.get(apiList.online_graph_query_fields_by_id,{id})
                if(success){
                    this.table = {
                        ...this.table,
                        data : result
                    }
                }
            },
            async saveData() {
                let {data} = this.table
                let {id} = this.data
                let {yaxisField,graphType,...rest} = this.form
                let params = {
                    ...this.data,
                    ...rest,
                    yaxisField : yaxisField ? yaxisField.join(',') : '',
                    graphType : graphType ? graphType.join(',') : '',
                    onlGraphreportItemList : data
                }
                let res = {}
                if (id) {
                    res = await http.put(apiList.online_graph_edit, params)
                } else {
                    res = await http.post(apiList.online_graph_add, params)
                }
                let {success, message} = res
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                    this.$emit('modifyFail')
                }
            },
            async parseSql(){
                this.loading = true
                let {cgrSql : sql} = this.form
                let {success,message, result} = await http.get(apiList.online_report_parse_sql,{sql})
                if (success) {
                    let {fields} =  result ? result : {}
                    sweetAlert.successWithTimer('解析成功')
                    this.table = {
                        ...this.table,
                        data: fields,
                    }
                    this.loading = false
                }else{
                    sweetAlert.errorWithTimer(message)
                    this.loading = false
                }
            },
            setI18n() {
                this.table = {
                    ...this.table,
                    show: false,
                    column: [
                        {type: 'selection', fixed: true},
                        {type: 'index'},
                        {
                            label: '字段名',
                            prop: 'fieldName',
                            render : (h,scope)=>{
                                return (
                                    <el-input
                                        vModel = {scope.row.fieldName}
                                        clearable = {true}
                                        size = 'small'
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '字段文本',
                            prop: 'fieldTxt',
                            render : (h,scope)=>{
                                return (
                                    <el-input
                                        vModel = {scope.row.fieldTxt}
                                        clearable = {true}
                                        size = 'small'
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '排序',
                            prop: 'orderNum',
                            width : 160,
                            render : (h,scope)=>{
                                return (
                                    <el-input-number
                                        vModel = {scope.row.orderNum}
                                        min = {1}
                                        size = 'small'
                                    ></el-input-number>
                                )
                            }
                        },
                        {
                            label: '字段类型', prop: 'fieldType',
                            render : (h,scope)=>{
                                return (
                                    <el-select
                                        vModel = {scope.row.fieldType}
                                        clearable = {true}
                                        filterable = {true}
                                        size = 'small'
                                    >
                                        {
                                            this.select.fieldType.map(({value,label})=>{
                                                return (
                                                    <el-option value = {value} label = {label}></el-option>
                                                )
                                            })
                                        }
                                    </el-select>
                                )
                            }
                        },
                        {
                            label: '是否显示', prop: 'isShow',
                            render : (h,scope)=>{
                                return (
                                    <el-checkbox
                                        vModel = {scope.row.isShow}
                                        trueLabel = {'Y'}
                                        falseLabel = {'N'}
                                    ></el-checkbox>
                                )
                            }
                        },
                        {
                            label: '计算总计', prop: 'isTotal',
                            render : (h,scope)=>{
                                return (
                                    <el-checkbox
                                        vModel = {scope.row.isTotal}
                                        trueLabel = {'Y'}
                                        falseLabel = {'N'}
                                    ></el-checkbox>
                                )
                            }
                        },
                        {
                            label: '是否查询', prop: 'isSearch',
                            render : (h,scope)=>{
                                return (
                                    <el-checkbox
                                        vModel = {scope.row.isSearch}
                                        trueLabel = {"Y"}
                                        falseLabel = {"N"}
                                    ></el-checkbox>
                                )
                            }
                        },
                        {
                            label: '查询模式', prop: 'searchMode',
                            render : (h,scope)=>{
                                return (
                                    <el-select
                                        vModel = {scope.row.searchMode}
                                        clearable = {true}
                                        filterable = {true}
                                        size = 'small'
                                    >
                                        {
                                            this.select.searchMode.map(({value,label})=>{
                                                return (
                                                    <el-option value = {value} label = {label}></el-option>
                                                )
                                            })
                                        }
                                    </el-select>
                                )
                            }
                        },
                        {
                            label: '字典code', prop: 'dictCode',
                            render : (h,scope)=>{
                                return (
                                    <el-input
                                        vModel = {scope.row.dictCode}
                                        clearable = {true}
                                        size = 'small'
                                    ></el-input>
                                )
                            }
                        },
                    ]
                }
                this.$nextTick(() => {
                    this.table = {
                        ...this.table,
                        show: true
                    }
                })
            }
        },
        created(){
            this.setI18n()
        },
        mounted(){
            this.getOnlineGraphDisplayTemplate()
            this.getOnlineGraphDataType()
            this.getOnlineGraphType()
        },
    }
</script>

<style scoped>

</style>