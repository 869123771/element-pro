<template>
    <div>
        <el-row class = "mb-3">
            <el-autocomplete
                    v-model="table.tableName"
                    :fetch-suggestions = "querySearchAsync"
                    placeholder="请输入表名查询"
                    @select="handleSelect"
                    clearable
                    class = "w-full"
            >
                <i slot = "suffix" class = "el-input__icon el-icon-search"></i>
            </el-autocomplete>
        </el-row>
        <el-row>
            <fox-table
                    v-if="table.show"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="table.data"
                    @selection-change="selection"
            >
            </fox-table>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'
    import foxTable from '@/components/fox-table/'

    export default {
        name: "ImportForm",
        components : {
            foxTable
        },
        data(){
            return {
                table: {
                    column: [],
                    data: [],
                    selection: [],
                    loading: false,
                    show: true,
                    tableName : ''
                },
            }
        },
        methods : {
            async querySearchAsync(queryString, cb) {
                debugger;
                let {result} = this.table
                result.forEach(item=>{
                    let {id} = item
                    item.value = id
                })
                let filterItems = result.filter(item=>item.id.toUpperCase().includes(queryString.toUpperCase()))
                this.table = {
                    ...this.table,
                    data : filterItems
                }
                cb(filterItems)
            },
            handleSelect(queryString) {
                debugger;
                let {result} = this.table
                let filterItems = result.filter(item=>item.id.toUpperCase().includes(queryString.id.toUpperCase()))
                this.table = {
                    ...this.table,
                    data : filterItems
                }
            },
            saveData(){
                let {selection} = this.table
                if(selection.length){
                    let tableNames = selection.map(item=>item.id).join(',')
                    this.generateForm(tableNames)
                }else{
                    sweetAlert.errorWithTimer('请选择一张表')
                }
            },
            async generateForm(names){
                let {success,message} = await http.post(`${apiList.online_form_head_trans_table}/${names}`)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
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
            async queryList() {
                this.table = {
                    ...this.table,
                    loading: true
                }

                let {success, result} = await http.get(apiList.online_form_head_form_import_from_db_query)
                if (success) {
                    this.table = {
                        ...this.table,
                        data : result,
                        result
                    }
                }
                this.table = {
                    ...this.table,
                    loading : false
                }
            },
            setI18n(){
                this.table = {
                    ...this.table,
                    show: false,
                    column: [
                        {type: 'selection', fixed: true},
                        {type: 'index', fixed: true},
                        {
                            label: '表名',
                            prop: 'id',
                        },

                    ]
                }
                this.$nextTick(() => {
                    this.table = {
                        ...this.table,
                        show: true
                    }
                })
            },
        },
        created(){
            this.setI18n()
        },
        mounted(){
            this.queryList()
        }
    }
</script>

<style scoped>

</style>