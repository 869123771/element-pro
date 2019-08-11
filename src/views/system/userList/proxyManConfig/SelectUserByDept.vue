<template>
    <div>
        <el-row>
            <el-col :span="12" class="pr-2">
                <div class="mb-3">
                    <el-input v-model="tree.filterDept"
                              @input="filterText"
                              placeholder="请输入部门名称"
                              clearable
                              suffix-icon="el-icon-search"></el-input>
                </div>
                <el-scrollbar>
                    <el-tree
                            ref="tree"
                            default-expand-all
                            node-key="id"
                            highlight-current
                            :expand-on-click-node="false"
                            :data="tree.data"
                            :props="tree.defaultProps"
                            :filter-node-method="filterNode"
                            @node-click="nodeClick"
                            class="max-h-screen"
                    >

                    </el-tree>
                </el-scrollbar>
            </el-col>
            <el-col :span="12" class="pl-2">
                <div class="mb-3">
                    <el-input
                            size="medium"
                            v-model="table.userName"
                            @input="queryList"
                            clearable
                            placeholder="请输入用户账号"
                            suffix-icon="el-icon-search">
                    </el-input>
                </div>
                <el-row>
                    <el-table
                            border
                            stripe
                            :data="table.data"
                            v-loading="table.loading"
                            @selection-change="selectionChange"
                    >
                        <el-table-column align="center" type="selection" width="60"></el-table-column>
                        <el-table-column align="center" type="index" width="60"></el-table-column>
                        <el-table-column align="center" :show-overflow-tooltip="true" label="用户账号"
                                         prop="username"></el-table-column>
                        <el-table-column align="center" :show-overflow-tooltip="true" label="用户名称"
                                         prop="realname"></el-table-column>
                        <el-table-column align="center" :show-overflow-tooltip="true" label="状态"
                                         prop="status_dictText"></el-table-column>
                    </el-table>
                </el-row>
                <el-row v-show = "table.data.length" class = "my-3 text-right">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page.sync="page.pageNum"
                            :page-size="page.pageSize"
                            :total="page.total"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                    >
                    </el-pagination>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, sweetAlert, constant} from '@/utils'

    export default {
        name: "SelectUserByDept",
        data() {
            let {table} = constant
            return {
                tree: {
                    filterDept: '',
                    data: [],
                    clickedData: {},
                    defaultProps: {
                        children: 'children',
                        label: 'departName'
                    },
                },
                table: {
                    data: [],
                    userName: '',
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
        computed: {
            ...mapState({
                depts: ({system}) => system.depts,
            })
        },
        watch: {
            depts: {
                handler(props) {
                    this.tree = {
                        ...this.tree,
                        data: props,
                        defaultCheckedkeys: []
                    }
                },
                immediate: true
            }
        },
        methods: {
            ...mapActions({
                getAllDepts: 'GET_ALL_DEPTS',
            }),
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.departName.indexOf(value) !== -1;
            },
            nodeClick(data, node, tree) {
                this.tree = {
                    ...this.tree,
                    clickedData: data
                }
                this.queryList()
            },
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
            async queryList() {
                let {pageNum: pageNo, pageSize} = this.page
                let {clickedData: {id}} = this.tree
                let {userName} = this.table
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    depId: id,
                    username: userName
                }
                let {success, result} = await http.get(apiList.sys_user_query_user_by_dept, params)
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

<style scoped lang="less">
    /deep/ .avue-crud__menu {
        display: none;
    }
</style>