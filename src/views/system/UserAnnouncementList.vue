<template>
    <div class = "message bg-white p-3 m-3">
        <el-row>
            <el-form ref="form" :model="form" label-width="90px">
                <el-col :md="6" :sm="8">
                    <el-form-item label="标题" prop="titile">
                        <el-input v-model="form.titile" placeholder="标题" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <el-form-item label="发布人:" prop="sender">
                        <el-input v-model="form.sender" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8" class = "px-3">
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    <el-button plain icon="el-icon-refresh-left" @click="reset">重置</el-button>
                </el-col>
            </el-form>
        </el-row>
        <el-row class = "my-3">
            <el-button plain type="primary" icon="fa fa-fw fa-eye" @click="noteReadAll">全部标记已读</el-button>
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
            >
                <template slot="oper" slot-scope="{scope:{row}}">
                    <span>
                         <span class="text-blue-500 text-base cursor-pointer">
                            <i class="fa fa-fw fa-eye" @click="read(row)"></i>
                        </span>
                    </span>
                </template>
            </fox-table>
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
    import foxTable from '@/components/fox-table/'
    import OperBtn from '@/components/table/OperBtn'

    export default {
        name: "UserAnnouncementList",
        components : {
            DragDialog,
            foxTable,
            OperBtn
        },
        data(){
            return {
                form: {
                    titile : '',                        //标题
                    sender : '',                        //发布人
                },
                table: {
                    data: [],
                    column : [],
                    show : true,
                    loading: false,
                    selection: []
                },
                page: {
                    pageNum: 1,
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
        watch: {
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods : {
            ...mapActions({
                getMsgCategory : 'GET_MSG_CATEGORY',
                getPriority : 'GET_PRIORITY',
            }),
            search() {
                this.page = {
                    ...this.page,
                    pageNum: 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetFields()
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
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...this.form,
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
            setI18n() {
                this.table = {
                    ...this.table,
                    show: false,
                    column: [
                        {
                            label: '操作',
                            prop: 'oper',
                            width: 80,
                            render : (h,{row})=>{
                                let {readFlag} = row
                                let btnInfo = []
                                if(Number(readFlag)){
                                    btnInfo = [
                                        ...btnInfo,
                                        {
                                            content: '已读',
                                            className: 'fa fa-fw fa-eye',
                                            permission: 'myMessage:hasDone',
                                            event: () => {
                                                this.read(row)
                                            }
                                        },
                                    ]
                                }else{
                                    btnInfo = [
                                        ...btnInfo,
                                        {
                                            content: '未读',
                                            className: 'fa fa-fw fa-eye-slash',
                                            permission: 'myMessage:notDone',
                                            event: () => {
                                                this.read(row)
                                            }
                                        },
                                    ]
                                }
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>
                                )
                            }
                        },
                        {
                            label: '标题',
                            prop: 'titile',
                            width : 150,
                        },
                        {
                            label: '消息类型',
                            prop: 'msgCategory',
                            render : (h,{row:{msgCategory}})=>{
                                return (
                                    <span>{msgCategory && this.msgCategory.length ? this.msgCategory.find(item=>item.itemValue === msgCategory).itemText : ''}</span>
                                )
                            }
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
                            render : (h,{row:{priority}})=>{
                                return (
                                    <span>{priority && this.priority.length ? this.priority.filter(item=>item.itemValue === priority).map(item=>item.itemText).join('') : ''}</span>
                                )
                            }
                        },
                        {
                            label: '阅读状态',
                            prop: 'readFlag',
                            render : (h,{row:{readFlag}})=>{
                                return (
                                    <span>{
                                        Number(readFlag) ? '已读' : '未读'
                                    }</span>
                                )
                            }
                        },
                    ]
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
            this.getMsgCategory()
            this.getPriority()
        },
        mounted(){
            this.queryList()
        }
    }
</script>

<style scoped>

</style>