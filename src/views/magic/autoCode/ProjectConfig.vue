<template>
    <div class = "config m-3">
        <collapse :collapse-props = "collapse.projectList">
            <div slot = "collapse-title">
                <span class = "el-icon-tickets pr-1"></span>
                <span>项目列表</span>
            </div>
            <div slot = "collapse-content">
                <el-row>
                    <template v-for = "item in collapse.datas">
                        <el-col :span = "6" class = "card-box">
                            <el-card>
                                <div slot="header">
                                    <span>{{`#${item.id} ${item.name}`}}</span>
                                </div>
                                <div>
                                    <div>
                                        <el-radio v-model="collapse.defaultPlate" :label="item.projectKey" @change = "plateChange">
                                            <el-tag effect="dark" type = "primary" size = "small" v-if = "collapse.defaultPlate === item.projectKey">默认项目</el-tag>
                                            <el-tag effect="dark" type = "info" size = "small" v-else>非默认项目</el-tag>
                                        </el-radio>
                                    </div>
                                    <div class = "card-box-desc">{{item.remark}}</div>
                                </div>
                                <div class = "text-blue-500 text-base flex justify-between pt-3">
                                    <el-tooltip content = "复制项目和配置" placement="top">
                                        <span class = "fa fa-fw fa-copy cursor-pointer" @click = "copy(item)"></span>
                                    </el-tooltip>
                                    <el-tooltip content = "编辑" placement="top">
                                        <span class = "fa fa-fw fa-pencil cursor-pointer"></span>
                                    </el-tooltip>
                                    <el-tooltip content = "删除" placement="top">
                                        <span class = "iconfont icon-wy-delete2 cursor-pointer"></span>
                                    </el-tooltip>
                                </div>
                            </el-card>
                        </el-col>
                    </template>
                </el-row>
                <el-row class = "p-3 pt-0 float-right">
                    <el-pagination
                            background
                            layout="total,prev, pager, next"
                            :total="collapse.pages.total">
                    </el-pagination>
                </el-row>
            </div>
        </collapse>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component
                    :is="component.is"
                    :ref="component.ref"
                    :data="component.data"
                    @closeDialog="closeDialog">
            </component>
        </drag-dialog>
    </div>
</template>

<script>
    import {http,apiList,sweetAlert} from '@/utils'
    import Collapse from '@/components/collapse'
    import DragDialog from '@/components/dragDialog'
    import Copy from './projectConfig/Copy'

    export default {
        name: "ProjectConfig",
        components : {
            Collapse,
            DragDialog,
            Copy
        },
        data(){
            return {
                collapse : {
                    projectList : {
                        title : '项目列表',
                        name : 'projectList',
                    },
                    datas : [],
                    defaultPlate : '',
                    pages : {
                        pageNum : 1,
                        pageSize : 4,
                        total : 0
                    }
                },
                defaultPlateInfo : {},
                dialog: {
                    width: '30',
                    height: '60',
                    showFooter: true,
                },
                component: {
                    is: Copy,
                    ref: 'copy',
                    data: {}
                },
            }
        },
        methods : {
            confirm(name){
                debugger;
                let {ref} = this.component
                let modifyRef = this.$refs[ref]
                modifyRef.$refs.form.validate(valid => {
                    if (valid) {
                        this.dialog = {
                            ...this.dialog,
                            loading: true
                        }
                        modifyRef.saveData()
                    }
                })
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
            },
            closeDialog() {
                let {name} = this.dialog
                this.$modal.hide(name)
                this.getAllDepts()
            },
            copy(data){
                let {defaultPlate} = this.collapse
                this.dialog = {
                    ...this.dialog,
                    title: '复制项目和配置',
                    name : 'copy'
                }
                this.component = {
                    ...this.component,
                    is : Copy,
                    ref : 'copy',
                    data: {
                        ...data,
                        isDefault : defaultPlate === data.projectKey
                    }
                }
                let {name} = this.dialog
                this.$nextTick(()=>{
                    this.$modal.show(name)
                })
            },
            async plateChange(key){
                let {ownerCode,ownerType,extKey} = this.defaultPlateInfo
                let params = {
                    ownerType,
                    ownerCode,
                    extKey,
                    extValue : key,
                }
                debugger;
                let {data : {success,value}} = await http.ajax('post',apiList.project_config_set_default_project_plate,params)
                if(success){
                    this.defaultPlateInfo = {
                        ...this.defaultPlateInfo,
                        ...value
                    }
                    this.collapse = {
                        ...this.collapse,
                        defaultPlate : value.extValue
                    }
                }
            },
            async getProjectList(){
                let params = {
                    type : 1,
                    status : 1,
                    page : 1,
                    pageSize : 10,
                    token : 'wangyang'
                }
                let {data:{success,value,pageQuery:{totalCount:total}}} = await http.ajax('post',apiList.project_config_project_list_query_list,params)
                debugger;
                if(success){
                    debugger;
                    let {pages} = this.collapse
                    this.collapse = {
                        ...this.collapse,
                        datas : value,
                        pages : {
                            ...pages,
                            total
                        }
                    }
                }
            },
            async getDefaultPlateKey(){
                let params = {
                    ownerType : 3,
                    ownerCode : 'admin',
                    extKey : 'defaultProjectKey',
                    token : 'wangyang'
                }
                let {data:{success,value}} = await http.ajax('post',apiList.project_config_query_default_plate,params)
                if(success){
                    this.defaultPlateInfo = {
                        ...value
                    }
                    this.collapse = {
                        ...this.collapse,
                        defaultPlate : value.extValue
                    }
                }
            },
        },
        mounted(){
            this.getProjectList()
            this.getDefaultPlateKey()
        }
    }
</script>

<style scoped lang = "less">
    .config{
        .card-box{
            padding : 1rem;
            &-desc{
                height : 40px;
                line-height: 40px;
            }
        }
    }
</style>