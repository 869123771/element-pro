<template>
    <div class="data-rule">
        <el-row>
            <el-form ref = "form" :model = "form" :status-icon="true" label-width="80px">
                <el-row>
                    <el-col :span = "12">
                        <el-form-item :label = "$t('sys_dict_item_name')" prop = "itemText">
                            <el-input v-model = "form.itemText" :placeholder = "$t('sys_dict_item_name')" clearable ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span = "12">
                        <el-form-item :label = "$t('sys_dict_status')" prop = "status">
                            <el-select
                                    v-model = "form.status"
                                    :placeholder = "$t('sys_dict_status')"
                                    clearable
                                    filterable
                                    class = "w-full"
                            >
                                <template v-for = "item in dictItemStatus">
                                    <el-option :value = "item.itemValue" :label = "item.itemText"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class = "text-center mb-4">
                    <el-button type="primary" icon="el-icon-search" @click="search">{{$t('common_query')}}</el-button>
                    <el-button plain icon="el-icon-refresh-left" @click="reset">{{$t('common_reset')}}</el-button>
                </el-row>
            </el-form>
        </el-row>
        <el-row class = "mb-4">
            <el-button plain type="primary" icon="el-icon-plus" @click="addRule">{{$t('common_add')}}</el-button>
        </el-row>
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
                :current-page.sync="page.currentPage"
                :total="page.total"
                :page-size="page.pageSize"
                @size-change="sizeChange"
                @p-current-change="currentChange"
        >
        </fox-table>
        <drag-dialog :drag-dialog="dialog" @confirm="confirmAdd">
           <modify :data="modify.data" ref="modify" @modifySuccess="modifySuccess"></modify>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import foxTable from '@/components/fox-table'
    import OperBtn from '@/components/table/OperBtn'
    import Modify from './dictConfig/Modify'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "DictConfig",
        props : {
            data : {
                type : Object
            }
        },
        components : {
            DragDialog,
            foxTable,
            Modify
        },
        data() {
            return {
                form: {},
                table: {
                    data: [],
                    column : [],
                    loading: false,
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                dialog: {
                    width: '26',
                    height: '450',
                    showFooter: true,
                },
                modify: {
                    data: {}
                },
            }
        },
        computed : {
            ...mapState({
                dictItemStatus : ({dict}) => dict.dictItemStatus
            })
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        this.queryList()
                    }
                },
                immediate : true
            },
            '$i18n.locale'() {
                this.setI18n()
                this.queryList()
            }
        },
        methods: {
            ...mapActions({
                getDictItemStatus : 'GET_DICT_ITEM_STATUS'
            }),
            search() {
                this.page = {
                    ...this.page,
                    currentPage: 1
                }
                this.queryList()
            },
            reset() {
                this.$refs.form.resetFields()
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
            closePopover(id){
                this.$refs[id].doClose();
            },
            addRule() {
                let {id} = this.data
                this.dialog = {
                    ...this.dialog,
                    title: this.$t('common_add'),
                    name: 'addRule',
                }
                this.modify = {
                    ...this.modify,
                    data: {
                        dictId: id
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            edit(row) {
                let {id} = this.data
                this.dialog = {
                    ...this.dialog,
                    title: this.$t('common_edit'),
                    name: 'updateRule',
                }
                this.modify = {
                    ...this.modify,
                    data: {
                        dictId: id,
                        ...row
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            confirmAdd(){
                let modifyRef = this.$refs.modify
                modifyRef.$refs.form.validate(valid => {
                    if (valid) {
                        this.dialog = {
                            ...this.dialog,
                            loading: true
                        }
                        modifyRef.saveData()
                    }
                    this.dialog = {
                        ...this.dialog,
                        loading: false
                    }
                })
            },
            modifySuccess(){
                let {name} = this.dialog
                this.$modal.hide(name)
                this.queryList()
            },
            async confirmDeleteBatch(id) {
                let {success, message} = await http.delete(apiList.sys_dict_item_delete, {id})
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.queryList()
                } else {
                    sweetAlert.error(message)
                }
            },
            async queryList() {
                let {currentPage: pageNo, pageSize} = this.page
                let {id} = this.data
                this.table = {
                    ...this.table,
                    loading: true
                }
                let params = {
                    pageNo,
                    pageSize,
                    ...this.form,
                    dictId : id
                }
                let {success, result} = await http.get(apiList.sys_common_dict_item, params)
                if (success) {
                    let {total,records} = result
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
                            label: this.$t('common_operate'),
                            prop: 'oper',
                            width: '80',
                            render: (h, {row}) => {
                                let btnInfo = [
                                    {
                                        content: this.$t('common_edit'),
                                        className: 'fa fa-fw fa-pencil',
                                        permission: 'menu:table:update',
                                        event: () => {
                                            this.edit(row)
                                        }
                                    },
                                    {
                                        content: this.$t('common_delete'),
                                        className: 'iconfont icon-wy-delete2',
                                        popover: true,
                                        popText: this.$t('common_confirm_del'),
                                        event: () => {
                                            this.confirmDeleteBatch(row.id)
                                        }
                                    },
                                ]
                                return (
                                    <OperBtn btnInfo={btnInfo}></OperBtn>
                            )
                            },
                        },
                        {
                            label: this.$t('sys_dict_item_name'),
                            prop: 'itemText',
                        },
                        {
                            label: this.$t('sys_dict_item_value'),
                            prop: 'itemValue',
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
        mounted(){
            this.getDictItemStatus()
            this.queryList()
        }
    }
</script>

<style scoped>

</style>