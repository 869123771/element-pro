<template>
    <div>
        <el-row class = "mb-3 flex">
            <el-button plain type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <template v-if="show.batch">
                <popover-confirm @confirm="del" class="mx-2">
                    <div slot="popover-title">确定要删除吗</div>
                    <div slot="popover-content">
                        <el-button plain icon="el-icon-minus">删除</el-button>
                    </div>
                </popover-confirm>
                <el-button plain @click="clear">
                    <span class="iconfont icon-wy-delete2"></span>
                    <span>清空选择</span>
                </el-button>
            </template>
        </el-row>
        <el-row>
            <fox-table
                    ref = "table"
                    v-if="table.show"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="data"
                    max-height = "500"
                    @selection-change="selectionChange"
            >
            </fox-table>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, sweetAlert, constant} from '@/utils'
    import foxTable from '@/components/fox-table/'
    import PopoverConfirm from '@/components/popoverConfirm'
    import {difference} from '30-seconds-of-code'

    export default {
        name: "DbProps",
        props: {
            data: {
                type: Array,
            },
        },
        components : {
            foxTable,
            PopoverConfirm
        },
        data() {
            return {
                table: {
                    column: [],
                    selection: [],
                    loading: false,
                    show: true
                },
                show: {
                    batch: false
                }
            }
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
            }
        },
        methods: {
            add() {
                let row = {
                    dbFieldName : '',                   //字段名称
                    dbFieldTxt : '',                    //字段备注
                    dbLength : 32,                      //字段长度
                    dbPointLength : 0,                 //小数点
                    dbDefaultVal : '',                  //默认值
                    dbType : 'string',                        //字段类型
                    dbIsKey : 0,                       //是否主键
                    dbIsNull : 1,                       //允许空值
                    orderNum : this.data.length + 1,          //排序,
                    fieldShowType : 'text',                 //控件类型
                }
                this.$emit('getData', [...this.data,row])
            },
            del() {
                let {selection} = this.table
                console.log(difference(this.data,selection))
                this.$emit('getData', difference(this.data,selection))
            },
            clear() {
                this.$refs.table.$refs.elTable.clearSelection()
            },
            selectionChange(selection) {
                if (selection.length) {
                    this.show = {
                        ...this.show,
                        batch: true
                    }
                } else {
                    this.show = {
                        ...this.show,
                        batch: false
                    }
                }
                this.table = {
                    ...this.table,
                    selection
                }
            },
            setI18n(){
                this.table = {
                    ...this.table,
                    show : false,
                    column : [
                        {
                            type : 'selection',
                            selectable : (row,index)=>{
                                let flag = true
                                let {dbIsKey} = row
                                if(dbIsKey){
                                    flag = false
                                }
                                return flag
                            }
                        },
                        {
                            type : 'index'
                        },
                        {
                            label: '字段名称',
                            prop: 'dbFieldName',
                            render : (h,scope)=>{
                                let {row:{dbFieldName,dbIsKey}} = scope
                                const change = (value)=>{
                                    scope.row.dbFieldName = value
                                }
                                return (
                                    <el-input
                                        value = {dbFieldName}
                                        placeholder = '字段名称'
                                        clearable = {true}
                                        size = "mini"
                                        disabled = {dbIsKey ? true : false}
                                        vOn:input = {change}
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '字段备注',
                            prop: 'dbFieldTxt',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.dbFieldTxt}
                                        placeholder = '字段备注'
                                        clearable = {true}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '字段长度',
                            prop: 'dbLength',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input-number
                                        vModel = {scope.row.dbLength}
                                        placeholder = '字段长度'
                                        min = {0}
                                        controls = {false}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                        class = "w-full"
                                    ></el-input-number>
                                )
                            }
                        },
                        {
                            label: '小数点',
                            prop: 'dbPointLength',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input-number
                                        vModel = {scope.row.dbPointLength}
                                        placeholder = '小数点'
                                        min = {0}
                                        controls = {false}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                        class = "w-full"
                                    ></el-input-number>
                                )
                            }
                        },
                        {
                            label: '默认值',
                            prop: 'dbDefaultVal',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input
                                        vModel = {scope.row.dbDefaultVal}
                                        placeholder = '默认值'
                                        clearable = {true}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '字段类型',
                            prop: 'dbType',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                let options = [
                                    {itemText: 'String', itemValue: 'string'},
                                    {itemText: 'Integer', itemValue: 'Integer'},
                                    {itemText: 'Double', itemValue: 'double'},
                                    {itemText: 'Date', itemValue: 'Date'},
                                    {itemText: 'BigDecimal', itemValue: 'BigDecimal'},
                                    {itemText: 'Text', itemValue: 'Text'},
                                    {itemText: 'Blob', itemValue: 'Blob'},
                                ]

                                return (
                                    <el-select
                                        vModel = {scope.row.dbType}
                                        placeholder = '字段类型'
                                        clearable = {true}
                                        filterable = {true}
                                        size = {'mini'}
                                        class = "w-full"
                                        disabled = {dbIsKey ? true : false}>
                                        {
                                            options.map(({itemValue,itemText})=>{
                                                return (
                                                    <el-option value = {itemValue} label = {itemText}></el-option>
                                                )
                                            })
                                        }
                                    </el-select>
                                )
                            }
                        },
                        {
                            label: '主键',
                            prop: 'dbIsKey',
                            width : 70,
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-checkbox vModel = {scope.row.dbIsKey} true-label = {1} false-lable = {0} disabled = {dbIsKey ? true : false}></el-checkbox>
                                )
                            }
                        },
                        {
                            label: '允许空值',
                            prop: 'dbIsNull',
                            render : (h,scope)=>{
                                scope.row.dbIsNull = Number(scope.row.dbIsNull)
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-switch vModel = {scope.row.dbIsNull} active-value = {1} inactive-value = {0} disabled = {dbIsKey ? true : false}></el-switch>
                                )
                            }
                        },
                        {
                            label: '排序',
                            prop: 'orderNum',
                            render : (h,scope)=>{
                                let {row:{dbIsKey}} = scope
                                return (
                                    <el-input-number
                                        vModel = {scope.row.orderNum}
                                        placeholder = '排序'
                                        min = {0}
                                        controls = {false}
                                        disabled = {dbIsKey ? true : false}
                                        size = "mini"
                                        class = "w-full"
                                    ></el-input-number>
                                )
                            }
                        },
                    ]
                }
                this.$nextTick(()=>{
                    this.table = {
                        ...this.table,
                        show : true
                    }
                })
            }
        },
        created(){
            this.setI18n()
        },
    }
</script>

<style scoped>

</style>