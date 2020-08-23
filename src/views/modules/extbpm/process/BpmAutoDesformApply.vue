<template>
    <div class = "p-3 m-3 bg-white">
        <el-row>
            <el-button type = "primary" icon = "el-icon-setting" @click = "commonProcessSet">设置常用流程</el-button>
        </el-row>
        <el-row class = "mt-3">
            <el-card>
                <div slot = "header">
                    <span>常用流程</span>
                </div>
                <div class = "grid grid-cols-5">
                    <template v-for = "item in process.common">
                        <el-card shadow="hover">
                           <div class = "flex items-center">
                                <span class = "pr-1">
                                    <i :class = "`anticon icon-${item.desformIcon} text-3xl cursor-pointer`"></i>
                                </span>
                               <el-tooltip :content="item.desformName" placement="top">
                                   <span class = "truncate">{{item.desformName}}</span>
                               </el-tooltip>
                           </div>
                        </el-card>
                    </template>
                </div>
            </el-card>
        </el-row>
        <el-row class = "mt-3">
            <el-card>
                <div slot = "header">
                    <span>测试流程</span>
                </div>
                <div class = "grid grid-cols-5">
                    <template v-for = "item in process.list.filter(item=>item.procType === 'test')">
                        <el-card shadow="hover">
                            <div class = "flex items-center">
                                <span class = "pr-1">
                                    <i :class = "`anticon icon-${item.desformIcon} text-3xl cursor-pointer`"></i>
                                </span>
                                <el-tooltip :content="item.desformName" placement="top">
                                    <span class = "truncate">{{item.desformName}}</span>
                                </el-tooltip>
                            </div>
                        </el-card>
                    </template>
                </div>
            </el-card>
        </el-row>
        <el-row class = "mt-3">
            <el-card>
                <div slot = "header">
                    <span>OA办公</span>
                </div>
                <div class = "grid grid-cols-5">
                    <template v-for = "item in process.list.filter(item=>item.procType === 'oa')">
                        <el-card shadow="hover">
                            <div class = "flex items-center">
                                <span class = "pr-1">
                                    <i :class = "`anticon icon-${item.desformIcon} text-3xl cursor-pointer`"></i>
                                </span>
                                <el-tooltip :content="item.desformName" placement="top">
                                    <span class = "truncate">{{item.desformName}}</span>
                                </el-tooltip>
                            </div>
                        </el-card>
                    </template>
                </div>
            </el-card>
        </el-row>
        <drag-dialog :drag-dialog="dialog">
            <component :is = "component.is" :data = "component.data" :ref = "component.ref"></component>
            <div slot = "footer" class = "modal-footer flex justify-between px-4">
                <div>
                    <el-dropdown placement="top" @command="handleCommand">
                        <el-button plain>
                            树操作<i class="el-icon-arrow-up"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="selectAll">全部勾选</el-dropdown-item>
                            <el-dropdown-item command="cancelAll">取消全选</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                </div>
                <div>
                    <el-button plain @click="close">{{$t('common_cancel')}}</el-button>
                    <el-button type="primary" :loading="dialog.loading" @click="confirm">确认</el-button>
                </div>
            </div>
        </drag-dialog>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import CommonProcessList from "./bpmAutoDesformApply/CommonProcessList";

    export default {
        name: "BpmAutoDesformApply",
        components : {
            DragDialog
        },
        data(){
            return {
                process : {
                    common : [],
                    list : []
                },
                dialog: {
                    width: 1000,
                    height: 500,
                    name: 'commonProcess',
                    loading : false,
                    title: '常用流程设置'
                },
                component : {
                    is : CommonProcessList,
                    ref : 'commonProcessList',
                    data : [],
                }
            }
        },
        methods : {
            close(){
                let {name} = this.dialog
                this.$modal.hide(name)
            },
            async confirm(){
                debugger;
                let {common} = this.process
                let {ref} = this.component
                let {checked:{testProcess,oaOffice}} = this.$refs[ref]
                let params = {
                    oldDessignId : common.map(item=>item.id).join(','),
                    newDesignId : [...testProcess,...oaOffice].join(',')
                }
                let {success,message} = await http.post(apiList.oa_office_work_order_apply_common_process_checked_change,params)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.close()
                    this.commonProcessQuery()
                }
            },
            handleCommand(commond){
                let {list:data} = this.process
                let {ref} = this.component
                switch (commond) {
                    case 'selectAll' :
                        this.$refs[ref].selectAll()
                        break;
                    case 'cancelAll' :
                        this.$refs[ref].cancelAll()
                        break;
                }
            },
            commonProcessSet(){
                let {name} = this.dialog
                let {list : data} = this.process
                this.$modal.show(name)
                this.component = {
                    ...this.component,
                    data
                }
            },
            async commonProcessQuery(){
                let {success, result} = await http.get(apiList.oa_office_work_order_apply_common_process_checked_query)
                if (success) {
                    this.process = {
                        ...this.process,
                        common : result
                    }
                }
            },
            async processListQuery(){
                let {success, result} = await http.get(apiList.oa_office_work_order_apply_process_list_query)
                if (success) {
                    this.process = {
                        ...this.process,
                        list : result
                    }
                }
            }
        },
        mounted() {
            this.commonProcessQuery()
            this.processListQuery()
        }
    }
</script>

<style scoped lang = "less">
    .modal-footer{
        position: absolute;
        bottom: 0px;
        background: #fff;
        z-index: inherit;
        width: 100%;
        border-top: 1px solid #e2e8f0;
        height: 60px;
        line-height: 60px;
        min-height: 60px;
    }
</style>
