<template>
    <div>
        <el-row>
            <el-col :span="10" class="pr-2">
                <div class="mb-3">
                    <el-input v-model="tree.filterDept"
                              @input="filterText"
                              :placeholder="$t('sys_user_input_dept')"
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
            <el-col :span="14" class="pl-2">
                <div class="mb-3">
                    <el-input
                            size="medium"
                            v-model="table.userName"
                            @input="queryList"
                            clearable
                            :placeholder="$t('sys_user_input_account')"
                            suffix-icon="el-icon-search">
                    </el-input>
                </div>
                <el-row>
                    <fox-table
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
                        <template slot="avatar" slot-scope="{scope}">
                            <el-image size="26" :src="getAvatarView(scope)"
                                      :preview-src-list="[getAvatarView(scope)]"
                            >
                                <div slot="error" class="cursor-pointer">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </template>
                    </fox-table>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, sweetAlert, constant} from '@/utils'
    import foxTable from '@/components/fox-table'

    export default {
        name: "SelectUserByDept",
        components : {
            foxTable
        },
        data() {
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
                    data : [],
                    column : [],
                    userName: '',
                    loading: false,
                    selection: [],
                    show: true
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
                dept: ({system}) => system.dept,
            })
        },
        watch: {
            dept: {
                handler(props) {
                    this.tree = {
                        ...this.tree,
                        data: props,
                        defaultCheckedkeys: []
                    }
                },
                immediate: true
            },
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods: {
            ...mapActions({
                getAllDept: 'GET_ALL_DEPT',
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
            selection(selection) {
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
            setI18n() {
                let column = [
                    {type: 'selection', fixed: true},
                    {
                        label: this.$t('sys_user_account'),
                        prop: 'username',
                    },
                    {
                        label: this.$t('sys_user_name'),
                        prop: 'realname',
                    },
                    {
                        label: this.$t('sys_user_status'),
                        prop: 'status_dictText',
                        width: '70',
                    },
                ]
                this.table = {
                    ...this.table,
                    show: false,
                    column,
                }
                this.$nextTick(() => {
                    this.table = {
                        ...this.table,
                        show: true
                    }
                })
            }
        },
        created(){
            this.setI18n()
        },
    }
</script>

<style scoped lang="less">
    /deep/ .avue-crud__menu {
        display: none;
    }
</style>