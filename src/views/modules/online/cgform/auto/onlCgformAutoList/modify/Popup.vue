<template>
    <div>
        <el-row @keydown.enter.native = "queryList">
            <el-form ref="form" label-width="90px">
                <form-query @search="search" @reset="reset">
                    <template v-for = "(item,index) in data.formList">
                        <template slot = "show" v-if = "index < 2">
                            <el-col  :xs = "24" :sm = "24" :md="12" :lg = "8" :xl = "8">
                                <form-item-query :item = "item" :form = "form" :dict-options = "data.dictOptions"></form-item-query>
                            </el-col>
                        </template>
                        <template slot = "hide" v-else>
                            <el-col  :xs = "24" :sm = "24" :md="12" :lg = "8" :xl = "8">
                                <form-item-query :item = "item" :form = "form" :dict-options = "data.dictOptions"></form-item-query>
                            </el-col>
                        </template>
                    </template>
                </form-query>
            </el-form>
        </el-row>
        <el-row>
            <fox-table
                    ref = "table"
                    row-key = "id"
                    v-if="table.show"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="table.data"
                    pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-count="10"
                    :current-page.sync="page.pageNum"
                    :total="page.total"
                    :page-size="page.pageSize"
                    @size-change="sizeChange"
                    @p-current-change="currentChange"
                    @selection-change="selection"
            >
            </fox-table>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'
    import FormQuery from '@/components/form/query'
    import foxTable from '@/components/fox-table'
    import FormItemQuery from "../FormItemQuery";
    export default {
        name: "Popup",
        props : {
            data : {
                type : Object
            }
        },
        components : {
            FormQuery,
            foxTable,
            FormItemQuery
        },
        data(){

            return {
                form : {},
                table: {
                    column:[],
                    data: [],
                    selection: [],
                    loading: false,
                    show: true
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total : 0
                }
            }
        },
        watch : {
            data : {
                handler(props){
                    if(props){
                        let {columns,total,records,dictOptions} = props
                        this.table = {
                            ...this.table,
                            column:this.handleColumns(columns),
                            data: records,
                            selection: [],
                            loading: false,
                            show: true
                        }
                        this.page = {
                            ...this.page,
                            total : total || 0
                        }
                    }
                },
                immediate : true
            }
        },
        methods : {
            search() {
                this.page = {
                    ...this.page,
                    pageNum : 1
                }
                this.$emit('showPopup',{
                    form : this.form,
                    page : this.page
                })
            },
            reset() {
                this.$refs.form.resetFields()
            },
            selection(selection) {
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
            currentChange(pageNum) {
                this.page = {
                    ...this.page,
                    pageNum
                }
                this.$emit('showPopup',{
                    form : this.form,
                    page : this.page
                })
            },
            sizeChange(pageSize) {
                this.page = {
                    ...this.page,
                    pageSize
                }
                this.$emit('showPopup',{
                    form : this.form,
                    page : this.page
                })
            },
            handleColumns(columns){
                let {dictOptions} = this.data
                return columns.map(({align,dataIndex,title,sorter,customRender})=>{
                    let column = {
                        prop : dataIndex,
                        label : title,
                        align,
                        sort : sorter,
                    }
                    if(customRender){
                        column.render = (h,{row:{sex}})=>{
                            return(
                                <span>
                                    {dictOptions[customRender].find(item=>item.value == sex)}
                                </span>
                            )
                        }
                    }
                    return column
                })
            },
            queryList(){

            },

        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>