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
                let {currentPage: pageNo, pageSize} = this.page
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
        }
    }
</script>

<style scoped>

</style>