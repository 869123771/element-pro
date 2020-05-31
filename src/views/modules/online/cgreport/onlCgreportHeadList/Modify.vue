<template>
    <div class="modify">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules" status-icon>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="编码" prop = "code" :rules = "[
                    {required : true, message : '必填',trigger : 'change'},
                    data.id ? {} : {validator : uniqueCheck}
                ]">
                        <el-input v-model="form.code" placeholder="编码" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="名称" prop = "name">
                        <el-input v-model="form.name" placeholder="名称" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="数据源" prop = "dbSource">
                        <el-select v-model="form.dbSource" placeholder="数据源" clearable filterable class = "w-full">
                           <template v-for = "{value,label} in select.dataSource">
                               <el-option :value = "value + ''" :label = "label"></el-option>
                           </template>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="SQL表达式" :rules = "{required : true, message : '必填',trigger : 'change'}">
                    <div class = "flex">
                        <MonacoEditor
                                class = "editor"
                                v-model ="form.cgrSql"
                                :language="editor.language"
                                :theme="editor.theme"
                        />
                       <div class = "flex-shrink-0">
                           <el-popover
                                placement="top"
                                title="使用指南"
                                trigger="hover"
                           >
                               <p>您可以键入“”作为一个参数，这里abc是参数的名称。例如：</p>
                               <p>select * from table where id = ${abc}。</p>
                               <p>select * from table where id like concat('%',${abc},'%')。(mysql模糊查询)</p>
                               <p>select * from table where id like '%'||${abc}||'%'。(oracle模糊查询)</p>
                               <p>select * from table where id like '%'+${abc}+'%'。(sqlserver模糊查询)</p>
                               <p class = "text-red-600">注：参数只支持动态报表，popup暂不支持</p>
                               <i slot="reference" class = "el-icon-warning-outline px-1 cursor-pointer"></i>
                           </el-popover>
                           <el-button type = "primary" @click = "parseSql" :loading = "loading">解析SQL</el-button>
                       </div>
                    </div>
                </el-form-item>
            </el-row>
            <el-row>
                <el-tabs v-model = "tabs.active" @tab-click="handleTabClick">
                    <el-row class = "pb-3">
                        <el-button type = "primary" icon = "el-icon-plus" @click = "add">新增</el-button>
                        <el-button plain icon = "el-icon-minus" @click = "minus" v-show = "show.del">删除</el-button>
                    </el-row>
                    <el-tab-pane label="动态报表配置明细" name="configDetail">
                        <el-row>
                            <fox-table
                                    ref = "configDetail"
                                    v-if="table.configDetail.show"
                                    v-loading="table.configDetail.loading"
                                    :column="table.configDetail.column"
                                    :data="table.configDetail.data"
                                    @selection-change="selection"
                                    max-height = "400"
                            ></fox-table>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="报表参数" name="reportParams">
                        <fox-table
                                ref = "reportParams"
                                v-if="table.reportParams.show"
                                v-loading="table.reportParams.loading"
                                :column="table.reportParams.column"
                                :data="table.reportParams.data"
                                @selection-change="selection"
                                max-height = "400"
                        ></fox-table>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import foxTable from '@/components/fox-table'
    import MonacoEditor from 'vue-monaco'
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
                form: {
                    cgrSql : ''
                },
                tabs : {
                    active : 'configDetail'
                },
                select : {
                    dataSource : [],
                    fieldType : [
                        {value : 'Integer',label : '数值类型'},
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
                editor: {
                    code: '',
                    language: 'mysql',
                    theme : 'vs-dark'
                },
                table : {
                    configDetail : {
                        column: [],
                        data: [],
                        selection: [],
                        loading: false,
                        show: true
                    },
                    reportParams : {
                        column: [],
                        data: [],
                        selection: [],
                        loading: false,
                        show: true
                    },
                },
                rules: {
                    name : [
                        {required : true, message : '必填', trigger : 'change'}
                    ],
                    dbSource : [
                        {required : true, message : '必填', trigger : 'change'}
                    ]
                }
            };
        },
        computed: {},
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        let {id,code,name,dbSource,cgrSql} = props
                        this.form = {
                            code,
                            name,
                            dbSource : dbSource + '',
                            cgrSql
                        }
                        this.editor = {
                            ...this.editor,
                            code : cgrSql
                        }
                        this.queryItemsById(id)
                        this.queryParamsById(id)
                    }
                    this.setI18n()
                    this.queryDataSource()
                },
                immediate: true
            },
        },
        methods: {
            handleTabClick({name}){
                let {selection} = this.table[name]
                this.selection(selection)
            },
            add(){
                let {active} = this.tabs
                let row = {
                    fieldName : '',
                    orderNum : '',
                    fieldTxt : '',
                    fieldType : '',
                    isShow : 1,
                    fieldHref : '',
                    searchMode : '',
                    replaceVal : '',
                    dictCode : '',
                    isSearch : 0,
                }
                if(active === 'configDetail'){
                    this.table.configDetail.data.push(row)
                }else{
                    this.table.reportParams.data.push({
                        paramName : '',
                        paramTxt : '',
                        paramValue : '',
                        orderNum : '',
                    })
                }
            },
            minus(){
                let {active} = this.tabs
                let {data,selection} = this.table[active]
                this.table[active] = {
                    ...this.table[active],
                    data : difference(data,selection)
                }
            },
            selection(selection) {
                let {active} = this.tabs
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
                this.table[active] = {
                    ...this.table[active],
                    selection
                }
            },
            async uniqueCheck(rule, fieldVal, callback){
                let params = {
                    tableName : 'onl_cgreport_head',
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
            async queryItemsById(headId){
                let {success,result} = await http.get(apiList.online_report_items_query_by_id,{headId})
                if(success){
                    this.table.configDetail = {
                        ...this.table.configDetail,
                        data : result
                    }
                }
            },
            async queryParamsById(headId){
                let {success,result} = await http.get(apiList.online_report_params_query_by_id,{headId})
                if(success){
                    this.table.reportParams = {
                        ...this.table.reportParams,
                        data : result
                    }
                }
            },
            async saveData() {
                let {configDetail,reportParams} = this.table
                let {id} = this.data
                let params = {
                    head : {
                        ...this.data,
                        ...this.form
                    },
                    items : configDetail.data,
                    params : reportParams.data,
                    deleteParamIds : '',
                }
                let res = {}
                if (id) {
                    res = await http.put(apiList.online_report_edit, params)
                } else {
                    res = await http.post(apiList.online_report_add, params)
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
            async queryDataSource() {
                let {success, result} = await http.get(apiList.online_report_data_source_query)
                if (success) {
                    this.select = {
                        ...this.select,
                        dataSource: result
                    }
                }
            },
            async parseSql(){
                this.loading = true
                let {cgrSql : sql} = this.form
                let {success,message, result} = await http.get(apiList.online_report_parse_sql,{sql})
                if (success) {
                    let {fields} =  result ? result : {}
                    sweetAlert.successWithTimer('解析成功')
                    this.table.configDetail = {
                        ...this.table.configDetail,
                        data: fields,
                    }
                    this.loading = false
                }else{
                    sweetAlert.errorWithTimer(message)
                    this.loading = false
                }
            },
            setI18n() {
                this.table.configDetail = {
                    ...this.table.configDetail,
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
                            label: '类型', prop: 'fieldType',
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
                                        trueLabel = {1}
                                        falseLabel = {0}
                                    ></el-checkbox>
                                )
                            }
                        },
                        {
                            label: '字段href', prop: 'fieldHref',
                            render : (h,scope)=>{
                                return (
                                    <el-input
                                        vModel = {scope.row.fieldHref}
                                        clearable = {true}
                                        size = 'small'
                                    ></el-input>
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
                            label: '取值表达式', prop: 'replaceVal',
                            render : (h,scope)=>{
                                return (
                                    <el-input
                                        vModel = {scope.row.replaceVal}
                                        clearable = {true}
                                        size = 'small'
                                    ></el-input>
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
                        {
                            label: '是否查询', prop: 'isSearch',
                            render : (h,scope)=>{
                                return (
                                    <el-checkbox
                                        vModel = {scope.row.isSearch}
                                        trueLabel = {1}
                                        falseLabel = {0}
                                    ></el-checkbox>
                                )
                            }
                        },
                    ]
                }

                this.table.reportParams = {
                    ...this.table.reportParams,
                    show: false,
                    column: [
                        {type: 'selection', fixed: true},
                        {
                            label: '参数',
                            prop: 'paramName',
                            render : (h,scope)=>{
                                return (
                                    <el-input
                                        vModel = {scope.row.paramName}
                                        clearable = {true}
                                        size = 'small'
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '参数文本',
                            prop: 'paramTxt',
                            render : (h,scope)=>{
                                return (
                                    <el-input
                                        vModel = {scope.row.paramTxt}
                                        clearable = {true}
                                        size = 'small'
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '默认值',
                            prop: 'paramValue',
                            render : (h,scope)=>{
                                return (
                                    <el-input
                                        vModel = {scope.row.paramValue}
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
                                        min = {0}
                                        size = 'small'
                                    ></el-input-number>
                                )
                            }
                        },
                    ]
                }
                this.$nextTick(() => {
                    this.table.configDetail = {
                        ...this.table.configDetail,
                        show: true
                    }
                    this.table.reportParams = {
                        ...this.table.reportParams,
                        show: true
                    }
                })
            }

        },
        mounted(){

        },
    }
</script>

<style scoped>
    .editor{
        height : 300px;
        width: 100%;
    }
</style>
