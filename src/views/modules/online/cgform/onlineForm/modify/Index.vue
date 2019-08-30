<template>
    <div>
        <el-row class = "mb-3">
            <el-button plain type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <template v-if="show.batch">
                <el-button plain icon="el-icon-minus" @click="remove">删除</el-button>
            </template>
        </el-row>
        <el-row>
            <fox-table
                    v-if="table.show"
                    v-loading="table.loading"
                    :column="table.column"
                    :data="table.data"
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

    export default {
        name: "Index",
        props: {
            data: {
                type: Object,
            },
        },
        components : {
            foxTable
        },
        data() {
            const {table} = constant
            return {
                table: {
                    data: [],
                    column : [],
                    selection : [],
                    show : true,
                    loading: false,
                },
                show : {
                    batch : false
                }
            }
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.setIndexs()
            }
        },
        methods: {
            add(){
                let {data} = this.table
                data.push({
                    indexName :'',
                    indexField : '',
                    indexType : ''
                })
            },
            remove(){
                let {data} = this.table
                let {selection} = this.table
                selection.map(item=>item.$index).forEach(index=>{
                    data.splice(index,1)
                })
                this.table = {
                    ...this.table,
                    data : [...data]
                }
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
            async setIndexs() {
                this.table = {
                    ...this.table,
                    loading: true
                }
                let {id:headId} = this.data
                let {success,result} = await http.get(apiList.online_form_index_query_by_id, {headId})
                if(success){
                    this.table = {
                        ...this.table,
                        data: result
                    }
                }
                this.table = {
                    ...this.table,
                    loading: false
                }
            },
            setI18n(){
                this.table = {
                    ...this.table,
                    show : false,
                    column : [
                        {
                            type : 'selection',
                        },
                        {
                            type : 'index'
                        },
                        {
                            label: '索引名称',
                            prop: 'indexName',
                            render : (h,scope)=>{
                                return (
                                    <el-input
                                        vModel = {scope.row.indexName}
                                        placeholder = '索引名称'
                                        clearable = {true}
                                        size = "mini"
                                    ></el-input>
                                )
                            }
                        },
                        {
                            label: '索引栏位',
                            prop: 'indexField',
                            render : (h,scope)=>{
                                let options = [
                                    {itemText:'id',itemValue : 'id'},
                                    {itemText:'create_by',itemValue : 'create_by'},
                                    {itemText:'create_time',itemValue : 'create_time'},
                                    {itemText:'update_by',itemValue : 'update_by'},
                                    {itemText:'update_time',itemValue : 'update_time'},
                                    {itemText:'sys_org_code',itemValue : 'sys_org_code'},
                                    {itemText:'sis_name',itemValue : 'sis_name'},
                                    {itemText:'sis_code',itemValue : 'sis_code'},
                                ]
                                return (
                                    <el-select
                                        vModel = {scope.row.indexField}
                                        placeholder = '索引栏位'
                                        clearable = {true}
                                        filterable = {true}
                                        size = {'mini'}
                                        class = "w-full"
                                    >
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
                            label: '索引类型',
                            prop: 'indexType',
                            render : (h,scope)=>{
                                let options = [
                                    {itemText:'Normal',itemValue : 'normal'},
                                    {itemText:'Unique',itemValue : 'unique'},
                                ]
                                return (
                                    <el-select
                                        vModel = {scope.row.indexType}
                                        placeholder = '索引类型'
                                        clearable = {true}
                                        filterable = {true}
                                        size = {'mini'}
                                        class = "w-full"
                                    >
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
                    ]
                }
                this.$nextTick(()=>{
                    this.table = {
                        ...this.table,
                        show : true,
                    }
                })
            },
        },
        created(){
            this.setI18n()
        },
        mounted() {
            this.setIndexs()
        }
    }
</script>

<style scoped>

</style>