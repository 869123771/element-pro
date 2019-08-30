<template>
    <div>
        <el-row class = "mb-3">
            <el-autocomplete
                    v-model="table.tableName"
                    :fetch-suggestions = "querySearchAsync"
                    placeholder="请输入表名查询"
                    @select="handleSelect"
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
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
            }
        },
        methods : {
            querySearchAsync(queryString, cb) {
                /*var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());*/

            },
            handleSelect(item) {
                console.log(item);
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
                this.table = {
                    ...this.table,
                    loading: true
                }

                let {pageSize, pageNum: pageNo} = this.page
                let params = {
                    pageSize,
                    pageNo
                }
                let {success, result} = await http.get(apiList.online_form_head_form_import_from_db_query, params)
                if (success) {
                    this.table = {
                        ...this.table,
                        data : result
                    }
                    return result
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
                            prop: 'tableName',
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