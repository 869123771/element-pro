<template>
    <div>
        <avue-crud
                ref="crud"
                :data="table.data"
                :option="table.option"
                :table-loading="table.loading"
                @selection-change="selectionChange"
        >
            <template slot="menuLeft">
                <el-button plain type="primary" icon="el-icon-plus" @click="add">新增</el-button>
                <template v-if="show.batch">
                    <el-button plain icon="el-icon-minus" @click="remove">删除</el-button>
                </template>
            </template>
        </avue-crud>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, sweetAlert, constant} from '@/utils'

    export default {
        name: "Index",
        props: {
            data: {
                type: Object,
            },
        },
        data() {
            const {table} = constant
            return {
                table: {
                    data: [],
                    option: {
                        ...table,
                        page: false,
                        props: {
                            label: 'itemText',
                            value: 'itemValue'
                        },
                        column: [
                            {
                                label: '索引名称',
                                prop: 'indexName',
                                cell : true,
                                clearable : true
                            },
                            {
                                label: '索引栏位',
                                prop: 'indexField',
                                cell : true,
                                type : 'select',
                                clearable : true,
                                dicData : [
                                    {itemText:'id',itemValue : 'id'},
                                    {itemText:'create_by',itemValue : 'create_by'},
                                    {itemText:'create_time',itemValue : 'create_time'},
                                    {itemText:'update_by',itemValue : 'update_by'},
                                    {itemText:'update_time',itemValue : 'update_time'},
                                    {itemText:'sys_org_code',itemValue : 'sys_org_code'},
                                    {itemText:'sis_name',itemValue : 'sis_name'},
                                    {itemText:'sis_code',itemValue : 'sis_code'},
                                ]
                            },
                            {
                                label: '索引类型',
                                prop: 'indexType',
                                cell: true,
                                type : 'select',
                                clearable : true,
                                dicData : [
                                    {itemText:'Normal',itemValue : 'normal'},
                                    {itemText:'Unique',itemValue : 'unique'},
                                ]
                            },
                        ]
                    },
                    loading: false,
                },
                show : {
                    batch : false
                }
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
                data.forEach((item, index) => {
                    this.$refs.crud.rowCell(item, index)
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
                debugger;
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
                    this.$nextTick(() => {
                        result.forEach((item, index) => {
                            this.$refs.crud.rowCell(item, index)
                        })
                    })
                    this.table = {
                        ...this.table,
                        loading: false
                    }
                }
            }
        },
        mounted() {
            this.setIndexs()
        }
    }
</script>

<style scoped>

</style>