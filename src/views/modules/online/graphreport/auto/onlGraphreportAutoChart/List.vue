<template>
    <fox-table
            v-if="table.show"
            v-loading="table.loading"
            :column="table.column"
            :data="table.data"
            show-summary
            pagination
            background
            layout="prev, pager, next"
            :page-sizes="[5, 10, 20, 30]"
            :page-count="10"
            :current-page.sync="page.pageNum"
            :total="page.total"
            :page-size="page.pageSize"
            @size-change="sizeChange"
            @p-current-change="currentChange"
    >
    </fox-table>
</template>

<script>
    import foxTable from '@/components/fox-table'
    export default {
        name: "List",
        components : {
            foxTable
        },
        props : {
            data : {
                type : Object
            }
        },
        data(){
            return {
                table: {
                    column: [],
                    data: [],
                    selection: [],
                    handleMenus : [],
                    loading: false,
                    show: true
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        watch : {
            data : {
                handler(props){
                    if(props){
                        let {column,data} = props
                        this.table = {
                            ...this.table,
                            data,
                            column
                        }
                    }
                },
                immediate : true
            }
        },
        methods : {
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
        },
    }
</script>

<style scoped>

</style>