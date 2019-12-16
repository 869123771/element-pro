<template>
    <div class = "message p-3 m-3 bg-white">
        <el-row>
            <el-form ref="form" :model="form" label-width="80px">
                <el-col :md="6" :sm="8">
                    <el-form-item label="消息标题" prop="esTitle">
                        <el-input v-model="form.esTitle" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <el-form-item label="发送内容" prop="esContent">
                        <el-input v-model="form.esContent" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <el-form-item label="接收人" prop="esReceiver">
                        <el-input v-model="form.esReceiver" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8" class="pl-3">
                    <el-button type="primary" icon="el-icon-search" @click="search">{{$t('common_query')}}</el-button>
                    <el-button plain icon="el-icon-refresh-left" @click="reset">{{$t('common_reset')}}</el-button>
                </el-col>
            </el-form>
        </el-row>

        <el-row>
            <el-dropdown placement="bottom" class="dropdown" v-show="show.batch">
                <el-button plain>
                    {{$t('common_batch_operate')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteBatch"><i class="el-icon-delete"></i>{{$t('common_delete')}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row class="my-3">
            <collapse :collapse-props = "collapse">
                <div slot = "collapse-title">
                    <span>消息管理</span>
                </div>
                <div slot = "collapse-content">
                    <fox-table
                            v-if="table.show"
                            v-loading="table.loading"
                            :column="table.column"
                            :data="table.data"
                            pagination
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-sizes="[5, 10, 20, 30]"
                            :page-count="5"
                            :current-page.sync="page.pageNum"
                            :total="page.total"
                            :page-size="page.pageSize"
                            @size-change="sizeChange"
                            @p-current-change="currentChange"
                            @selection-change="selection"
                    >
                    </fox-table>
                </div>
            </collapse>
        </el-row>
        <slide-out :visible.sync="drawer.show"
                   :dock ="drawer.direction"
                   :title="drawer.title"
                   :size="drawer.width"
                   :close-on-mask-click = "false"
                   allow-resize
        >

            <component :ref="component.ref" :is="component.is" :data="component.data"></component>
        </slide-out>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import Collapse from '@/components/collapse/Collapse'
    import DragDialog from '@/components/dragDialog'
    import foxTable from '@/components/fox-table'
    import OperBtn from '@/components/table/OperBtn'
    import Read from './sysMessageList/Read'

    export default {
        name: "SysMessageList",
        components: {
            Collapse,
            DragDialog,
            foxTable,
        },
        data(){
            return {
                collapse : {
                    name : 'message',
                },
                show : {
                    batch : false
                },
                form: {
                    esTitle : '',
                    esContent : '',
                    esReceiver : '',
                },
                table: {
                    show: true,
                    column: [],
                    data: [],
                    loading: false,
                    selection: []
                },
                page: {
                    pageNum : 1,
                    pageSize: 10,
                    total: 0
                },
                component: {
                    is: Read,
                    ref: 'dictConfig',
                    data: {}
                },
                drawer: {
                    show: false,
                    direction: 'right',
                    width : '500px',
                    showFooter: true,
                    loading : false,
                },
            }
        },
        methods : {
            search() {
                this.page = {
                    ...this.page,
                    pageNum : 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetFields()
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
            read(row){
                this.drawer = {
                    ...this.drawer,
                    width: '450',
                    title: this.$t('common_read'),
                    show: true,
                }
                this.component = {
                    ...this.component,
                    is: Read,
                    ref: 'read',
                    data: row
                }
            },
            deleteBatch() {
                let {selection} = this.table
                let ids = selection.map(item => item.id).join(',')
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_do'), this.confirmDeleteBatch, ids)
            },
            async confirmDeleteBatch(ids,event,index) {
                let {success, message} = await http.delete(apiList.message_center_message_delete_batch, {ids})
                if (success) {
                    if(typeof index === 'number'){
                        sweetAlert.successWithTimer(message)
                        event(index)
                    }else{
                        sweetAlert.success(message)
                    }
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryList() {
                let {pageNum : pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...this.form
                }
                let {success, result} = await http.get(apiList.message_center_message_query_list, params)
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
                        {type: 'selection', fixed: true},
                        {type : 'index'},
                        {
                            label: this.$t('common_operate'),
                            prop: 'oper',
                            width: '100',
                            render: (h, {row}) => {
                                let btnInfo = [
                                    {
                                        content: this.$t('common_edit'),
                                        className: 'fa fa-fw fa-eye',
                                        permission: 'dictList:edit',
                                        event: () => {
                                            this.read(row)
                                        }
                                    },
                                    {
                                        content: this.$t('common_delete'),
                                        className: 'iconfont icon-wy-delete2',
                                        popover: true,
                                        popText: this.$t('common_confirm_do'),
                                        permission: 'dictList:delete',
                                        event: (event,index) => {
                                            this.confirmDeleteBatch(row.id,event,index)
                                        }
                                    },
                                ]
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>

                                )
                            },
                        },
                        {
                            label: '消息标题',
                            prop: 'esTitle',
                        },
                        {
                            label: '发送内容',
                            prop: 'esContent',
                        },
                        {
                            label: '接收人',
                            prop: 'esReceiver',
                        },
                        {
                            label: '发送次数',
                            prop: 'esSendNum',
                        },
                        {
                            label: '发送状态',
                            prop: 'esSendStatus_dictText',
                        },
                        {
                            label: '发送时间',
                            prop: 'esSendTime',
                        },
                        {
                            label: '发送方式',
                            prop: 'esType_dictText',
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
        created() {
            this.setI18n()
        },
        mounted() {
            this.queryList()
        },
    }
</script>

<style scoped>

</style>