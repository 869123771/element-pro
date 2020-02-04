<template>
    <div class = "sign p-3 m-3 bg-white">
        <el-row>
            <el-form ref="form" :model="form" label-width="80px">
                <el-col :md="6" :sm="8">
                    <el-form-item label="打卡日期" prop="signTime">
                        <el-date-picker
                                class="w-full"
                                v-model="form.signTime"
                                type="daterange"
                                :start-placeholder="$t('common_time_start')"
                                :end-placeholder="$t('common_time_end')"
                                value-format="yyyy-MM-dd"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <el-form-item label="打卡类型" prop="signType">
                        <el-select v-model = "form.signType" clearable filterable class = "w-full" placeholder="打卡类型">
                            <template v-for = "{itemValue,itemText} in signType">
                                <el-option :value = "itemValue" :label = "itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <el-form-item label="打卡状态" prop="signStatus">
                        <el-select v-model = "form.signStatus" clearable filterable class = "w-full" placeholder="打卡类型">
                            <template v-for = "{itemValue,itemText} in signStatus">
                                <el-option :value = "itemValue" :label = "itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8">
                    <div class="pl-3">
                        <el-button type="primary" icon="el-icon-search" @click="search">{{$t('common_query')}}
                        </el-button>
                        <el-button plain icon="el-icon-refresh-left" @click="reset">{{$t('common_reset')}}</el-button>
                    </div>
                </el-col>
            </el-form>
        </el-row>
        <el-row class = "mb-3">
            <el-button type="primary" icon="el-icon-plus" @click="signImmediate">立即打卡</el-button>
            <el-button plain icon="iconfont icon-wy-download" @click="fileExport">{{$t('common_export')}}</el-button>
            <el-button plain icon="iconfont icon-wy-upload" @click="signStatistic">打卡统计</el-button>
        </el-row>
        <el-row>
            <collapse :collapse-props = "collapse">
                <div slot = "collapse-title">
                    <span>打卡信息</span>
                </div>
                <div slot = "collapse-content">
                    <fox-table
                            v-if="table.show"
                            highlight-current-row
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
                    </fox-table>
                </div>
            </collapse>
        </el-row>
        <drag-dialog :drag-dialog="dialog" @confirm="">
            <component :is = "component.is" :data="component.data" :ref="component.ref" @modifySuccess=""></component>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {downloadFile} from '@/utils/modules/tools'
    import DragDialog from '@/components/dragDialog'
    import Collapse from '@/components/collapse/Collapse'
    import foxTable from '@/components/fox-table'
    import OperBtn from '@/components/table/OperBtn'
    import SignImmediate from './oaSignInfoList/SignImmediate'

    import dayjs from 'dayjs'

    export default {
        name: "OaSignInfoList",
        components : {
            Collapse,
            foxTable,
            DragDialog
        },
        data(){
            return {
                form : {
                    signTime : '',
                    signType : '',
                    signStatus : '',
                },
                collapse : {
                    name : 'signInfo'
                },
                table: {
                    show: true,
                    data: [],
                    column: [],
                    loading: false,
                    selection: []
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                dialog: {
                    width: 25,
                    height: 320,
                    name: 'addRole',
                    showFooter: true,
                },
                component : {
                    data : {

                    },
                    ref : '',
                    is : ''
                }
            }
        },
        computed : {
            ...mapState({
                signType : ({dict}) => dict.signType,
                signStatus : ({dict}) => dict.signStatus,
            })
        },
        methods : {
            ...mapActions({
                getSignType : 'GET_SIGN_TYPE',
                getSignStatus : 'GET_SIGN_STATUS',
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
            async signImmediate(){
                let {success,result} = await http.get(apiList.sign_sign_immediate)
                if(success) {
                    this.dialog = {
                        ...this.dialog,
                        title : '打卡',
                        width: 300,
                        height: 400,
                        name: 'signImmediate',
                        showFooter: false,
                    }
                    this.component = {
                        ...this.component,
                        data : {
                            ...result
                        },
                        ref : 'signImmediate',
                        is : SignImmediate
                    }
                    let {name} = this.dialog
                    this.$nextTick(() => {
                        this.$modal.show(name)
                    })
                }
            },
            signStatistic(){

            },
            edit(){

            },
            read(){

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
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.sys_role_export, params)
                downloadFile(data, filename)

            },
            async queryList() {
                let {signTime: [signTime_begin, signTime_end], ...res} = this.form
                let {pageNum: pageNo, pageSize} = this.page
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...res,
                    signTime_begin,
                    signTime_end
                }
                let {success, result} = await http.get(apiList.sign_query_list, params)
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
                            type: 'selection',
                            fixed: true
                        },
                        {
                            label: '操作',
                            prop: 'oper',
                            width: 80,
                            render: (h, {row}) => {
                                let btnInfo = [
                                    {
                                        content: this.$t('common_edit'),
                                        className: 'fa fa-fw fa-pencil',
                                        permission: '',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        content: this.$t('common_read'),
                                        className: 'fa fa-fw fa-eye',
                                        permission: '',
                                        event: () => {
                                            this.read(row)
                                        }
                                    },
                                ]
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>
                                )
                            }
                        },
                        {
                            label: '日期',
                            prop: 'signTime',
                            render : (h,{row:{signTime}})=>{
                                return (
                                    <span>{dayjs(signTime).format('YYYY-MM-DD')}</span>
                                )
                            }
                        },
                        {
                            label: '时间',
                            prop: 'signTime',
                            render : (h,{row:{signTime}})=>{
                                return (
                                    <span>{dayjs(signTime).format('HH:mm:ss')}</span>
                                )
                            }
                        },

                        {
                            label: '类型',
                            prop: 'signType',
                            render : (h,{row:{signType}})=>{
                                let signTypeItem = this.signType.find(item=>item.itemValue === String(signType))
                                return (
                                    <span>{signTypeItem ? signTypeItem.itemText : ''}</span>
                                )
                            }
                        },
                        {
                            label: '状态',
                            prop: 'signStatus',
                            render : (h,{row:{signStatus}})=>{
                                let signStatusItem = this.signStatus.find(item=>item.itemValue === String(signStatus))
                                const signStatusText = signStatusItem ? signStatusItem.itemText : ''
                                let type = 'danger'
                                switch(signStatus){
                                    case  '0' : type = 'success'; break
                                    case '1' : type = 'success' ; break
                                    case '2' : type = 'danger' ; break
                                }
                                return (
                                    <el-tag  type = {type} size = "small">{signStatusText}</el-tag>
                                )
                            }
                        },
                    ],
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
            this.getSignType()
            this.getSignStatus()
            this.setI18n()
        },
        mounted() {
            this.queryList()
        }
    }
</script>

<style scoped>

</style>