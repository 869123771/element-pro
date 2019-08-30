<template>
    <div>
        <el-row>
            <el-form inline>
                <el-form-item label = "姓名">
                    <el-input v-model = "table.name" placeholder = "请输入姓名" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type = "primary" icon="el-icon-search" @click="search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row class = "my-3">
            <fox-table
                    v-if = "table.show"
                    align="center"
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
            ></fox-table>
        </el-row>
    </div>
</template>

<script>
    import {http,apiList,sweetAlert,constant} from '@/utils'
    import foxTable from '@/components/fox-table/'

    export default {
        name: "AddUser",
        props : {
            data : {
                type : Object
            }
        },
        components : {
            foxTable
        },
        data() {
            return {
                table: {
                    data: [],
                    column: [],
                    name : '',
                    show : true,
                    loading: false,
                    selection: []
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
            }
        },
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods : {
            selection(selection) {
                this.table = {
                    ...this.table,
                    selection
                }
            },
            search() {
                this.page = {
                    ...this.page,
                    pageNum : 1
                }
                this.queryList()
            },
            currentChange(pageNum) {
                this.page = {
                    ...this.page,
                    pageNum
                }
                this.queryList()
            },
            sizeChange(pageSize) {
                this.page = {
                    ...this.page,
                    pageSize
                }
                this.queryList()
            },
            async saveData(depId){
                let {selection} = this.table
                let params = {
                    depId,
                    userIdList : selection.map(item=>item.id)
                }
                let {success,message} = await http.post(apiList.sys_user_edit_dept_with_user,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('handleSuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryList() {
                let {pageNum: pageNo, pageSize} = this.page
                let {name} = this.table
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    realname : name
                }
                let {success, result} = await http.get(apiList.sys_user_query_list, params)
                if (success) {
                    let {total, records} = result
                    this.table = {
                        ...this.table,
                        data: records
                    }
                    this.page = {
                        ...this.page,
                        total
                    }
                    this.table = {
                        ...this.table,
                        loading: false
                    }
                }
            },
            setI18n(){
                this.table = {
                    ...this.table,
                    show : false,
                    column : [
                        {
                            type : 'selection'
                        },
                        {
                            label: '用户账号',
                            prop: 'username'
                        },
                        {
                            label: '用户名称',
                            prop: 'realname'
                        },
                        {
                            label: '状态',
                            prop: 'status_dictText'
                        },
                    ],
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
        mounted(){
            this.queryList()
        }
    }
</script>

<style scoped>
    /deep/ .el-form-item{
        margin-bottom: 0px;
    }
</style>