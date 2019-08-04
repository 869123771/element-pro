<template>
    <avue-crud
            :data="table.data"
            :option="table.option"
            :page="page"
            :table-loading="table.loading"
            @on-load="queryList"
            @size-change="sizeChange"
            @current-change="currentChange"
            @selection-change="selectionChange"
    >
        <template slot="menuLeft">
            <el-form inline>
                <el-form-item label = "姓名">
                    <el-input v-model = "table.name" placeholder = "请输入姓名" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type = "primary" icon="el-icon-search" @click="search">查询</el-button>
                </el-form-item>
            </el-form>
        </template>
    </avue-crud>
</template>

<script>
    import {http,apiList,sweetAlert,constant} from '@/utils'

    export default {
        name: "AddUser",
        props : {
            data : {
                type : Object
            }
        },
        data() {
            let {table} = constant
            return {
                table: {
                    data: [],
                    option: {
                        ...table,
                        column: [
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
                        ]
                    },
                    name : '',
                    loading: false,
                    selection: []
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
            }
        },
        methods : {
            selectionChange(selection) {
                this.table = {
                    ...this.table,
                    selection
                }
            },
            search() {
                this.page = {
                    ...this.page,
                    currentPage: 1
                }
                this.queryList()
            },
            currentChange(currentPage) {
                this.page = {
                    ...this.page,
                    currentPage
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
                let {currentPage: pageNo, pageSize} = this.page
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
        }
    }
</script>

<style scoped>
    /deep/ .el-form-item{
        margin-bottom: 0px;
    }
</style>