<template>
    <fox-table
            border
            stripe
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
            @selection-change="selectionChange"
    >
    </fox-table>
</template>

<script>
    import {http,apiList,sweetAlert,constant} from '@/utils'
    import foxTable from '@/components/fox-table'

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
                    column: [
                        {
                          type : 'selection'
                        },
                        {
                            type : 'index'
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
                    loading: false,
                    selection: []
                },
                page: {
                    pageNum : 1,
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
            async saveData(roleId){
                let {selection} = this.table
                let params = {
                    roleId,
                    userIdList : selection.map(item=>item.id)
                }
                let {success,message} = await http.post(apiList.sys_role_add_user_role,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('handleSuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryList() {
                let {pageNum: pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
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
        },
        mounted(){
            this.queryList()
        }
    }
</script>

<style scoped>

</style>