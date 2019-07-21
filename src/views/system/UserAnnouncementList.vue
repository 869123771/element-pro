<template>
    <div class = "message bg-white p-3 m-3">
        <el-row>
            <avue-form :option="form.option" v-model="form.model" ref="form">
                <template slot-scope="scope" slot="searchBtn">
                    <div>
                        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                        <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                    </div>
                </template>
            </avue-form>
        </el-row>
        <el-row>
            <avue-crud
                    ref = "crud"
                    :data="table.data"
                    :option="table.option"
                    :page="page"
                    :table-loading="table.loading"
                    @on-load="queryList"
                    @size-change="sizeChange"
                    @current-change="currentChange"
            >
                <template slot="menuLeft">
                    <el-button plain type="primary" icon="fa fa-fw fa-eye" @click="noteReadAll">全部标记已读</el-button>
                </template>
                <template slot="oper" slot-scope="{row}">
                    <span>
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-eye" @click="read(row)"></i>
                        </span>
                    </span>
                </template>
                <template slot="msgCategory" slot-scope="{row}">
                    {{msgCategory.length ? msgCategory.find(item=>item.itemValue == row.msgCategory).itemText : ''}}
                </template>
                <template slot="priority" slot-scope="{row}">
                    {{priority.length ? priority.find(item=>item.itemValue == row.priority).itemText : ''}}
                </template>
                <template slot="readFlag" slot-scope="{row}">
                    <span class = "text-green-500" v-if = "Number(row.readFlag)">已读</span>
                    <span class = "text-pink-500" v-else>未读</span>
                </template>
            </avue-crud>
        </el-row>
        <drag-dialog :drag-dialog="dialog">
            <div class = "message-head text-gray-500 text-sm pb-3 border-b border-solid border-gray-200">
                <span class = "px-2">发布人:</span>
                <span>{{message.sender}}</span>
                <span class = "px-2">发布时间:</span>
                <span>{{message.sendTime}}</span>
            </div>
            <div class = "message-content py-3">
                <div v-html = "message.msgContent"></div>
            </div>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'

    export default {
        name: "UserAnnouncementList",
        components : {
            DragDialog
        },
        data(){
            let {table} = constant
            return {
                form: {
                    option: {
                        menuBtn: false,
                        column: [
                            {
                                label: '标题',
                                prop: 'titile',
                                span: 6,
                            },
                            {
                                label: "发布人",
                                prop: 'sender',
                                span: 6,
                            },
                            {
                                labelWidth: '0',
                                prop: 'searchBtn',
                                formslot: true,
                                span: 6,
                            }
                        ]
                    },
                    modal: {}
                },
                table: {
                    data: [],
                    option: {
                        ...table,
                        selection : false,
                        column: [
                            {
                                label: '操作',
                                prop: 'oper',
                                slot: true,
                                width: 80
                            },
                            {
                                label: '标题',
                                prop: 'titile',
                                width : 150,
                                overHidden: true
                            },
                            {
                                label: '消息类型',
                                prop: 'msgCategory',
                                slot : true
                            },
                            {
                                label: '发布人',
                                prop: 'sender'
                            },
                            {
                                label: '发布时间',
                                prop: 'sendTime',
                                sortable: true,
                            },
                            {
                                label: '优先级',
                                prop: 'priority',
                                slot : true
                            },
                            {
                                label: '阅读状态',
                                prop: 'readFlag',
                                slot : true
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
                dialog: {
                    width: '60',
                    height: '60',
                },
                message : {}
            }
        },
        computed : {
            ...mapState({
                msgCategory : ({dict}) => dict.msgCategory,
                priority : ({dict}) => dict.priority,
            })
        },
        methods : {
            ...mapActions({
                getMsgCategory : 'GET_MSG_CATEGORY',
                getPriority : 'GET_PRIORITY',
            }),
            search() {
                this.page = {
                    ...this.page,
                    currentPage: 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetForm()
            },
            async noteReadAll(){
                let {success,message} = await http.put(apiList.sys_my_message_note_read_all)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            async noteReadOne(anntId){
                await http.put(apiList.sys_my_message_note_read_one,{anntId})
            },
            read(row){
                let {titile} = row
                this.dialog = {
                    ...this.dialog,
                    title : titile,
                    name: 'myMsg',
                }
                this.message = {
                    ...row
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
                this.noteReadOne(row.id)
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
            async queryList() {
                let {model} = this.form
                let {currentPage: pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...model,
                }
                let {success, result} = await http.get(apiList.sys_my_message_query_list, params)
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
            this.getMsgCategory()
            this.getPriority()
        }
    }
</script>

<style scoped>

</style>