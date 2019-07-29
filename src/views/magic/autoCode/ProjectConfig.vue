<template>
    <div class="config m-3">
        <collapse :collapse-props="collapse.projectList">
            <div slot="collapse-title">
                <span class="el-icon-tickets pr-1"></span>
                <span>项目列表</span>
            </div>
            <div slot="collapse-content">
                <el-row class="card-box">
                    <el-col :span="24" class = "mb-3">
                        <el-button plain type="primary" icon="el-icon-plus" @click="addPlate">新增</el-button>
                    </el-col>
                    <template v-for="(item,index) in collapse.datas">
                        <el-col :span="6" :class = "index ? 'pl-3' : ''">
                            <el-card>
                                <div slot="header">
                                    <span>{{`#${item.id} ${item.name}`}}</span>
                                </div>
                                <div>
                                    <div>
                                        <el-radio v-model="collapse.defaultPlate" :label="item.projectKey"
                                                  @change="plateChange">
                                            <el-tag effect="dark" type="primary" size="small"
                                                    v-if="collapse.defaultPlate === item.projectKey">默认项目
                                            </el-tag>
                                            <el-tag effect="dark" type="info" size="small" v-else>非默认项目</el-tag>
                                        </el-radio>
                                    </div>
                                    <div class="card-box-desc">{{item.remark}}</div>
                                </div>
                                <div class="text-blue-500 text-base flex justify-between items-center pt-3">
                                    <el-tooltip content="复制项目和配置" placement="top">
                                        <span class="fa fa-fw fa-copy cursor-pointer" @click="copy(item)"></span>
                                    </el-tooltip>
                                    <el-tooltip content="编辑" placement="top">
                                        <span class="fa fa-fw fa-pencil cursor-pointer" @click="edit(item)"></span>
                                    </el-tooltip>
                                    <popover-confirm @confirm="handleDel(item)">
                                        <div slot="popover-content">
                                            <span class="iconfont icon-wy-delete2 cursor-pointer"></span>
                                        </div>
                                    </popover-confirm>
                                </div>
                            </el-card>
                        </el-col>
                    </template>
                </el-row>
                <el-row class="p-3 pt-0 float-right">
                    <el-pagination
                            background
                            layout="total,prev, pager, next"
                            :page-size="collapse.pages.pageSize"
                            :page-count="collapse.pages.pageNum"
                            :total="collapse.pages.total"
                            @current-change="currentChange"
                    >
                    </el-pagination>
                </el-row>
            </div>
        </collapse>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component
                    :is="component.is"
                    :ref="component.ref"
                    :data="component.data"
                    @closeDialog="closeDialog"
            >
            </component>
        </drag-dialog>
    </div>
</template>

<script>
    import {http, apiList, sweetAlert} from '@/utils'
    import Collapse from '@/components/collapse'
    import DragDialog from '@/components/dragDialog'
    import PopoverConfirm from '@/components/popoverConfirm'
    import Copy from './projectConfig/Copy'
    import Modify from './projectConfig/Modify'

    export default {
        name: "ProjectConfig",
        components: {
            Collapse,
            DragDialog,
            PopoverConfirm,
            Copy
        },
        data() {
            return {
                collapse: {
                    projectList: {
                        title: '项目列表',
                        name: 'projectList',
                    },
                    datas: [],
                    defaultPlate: '',
                    pages: {
                        pageNum: 1,
                        pageSize: 4,
                        total: 0
                    }
                },
                defaultPlateInfo: {},
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
        methods: {
            confirm(name) {
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
                this.getProjectList()
            },
            copy(data) {
                let {defaultPlate} = this.collapse
                this.dialog = {
                    ...this.dialog,
                    title: '复制项目和配置',
                    name: 'copy'
                }
                this.component = {
                    ...this.component,
                    is: Copy,
                    ref: 'copy',
                    data: {
                        ...data,
                        isDefault: defaultPlate === data.projectKey
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            addPlate() {

            },
            edit(data) {
                this.dialog = {
                    ...this.dialog,
                    title: '修改项目',
                    name: 'edit'
                }
                this.component = {
                    ...this.component,
                    is: Modify,
                    ref: 'modify',
                    data: {
                        ...data,
                    }
                }
                let {name} = this.dialog
                this.$nextTick(() => {
                    this.$modal.show(name)
                })
            },
            async handleDel({id}) {
                let params = {
                    primaryKey: id,
                    token: 'wangyang'
                }
                let {data: {success}} = await http.ajax('post', apiList.project_config_delete_project, params)
                if (success) {
                    sweetAlert.successWithTimer('删除成功')
                }
            },
            currentChange(pageNum) {
                let {pages} = this.collapse
                this.collapse = {
                    ...this.collapse,
                    pages: {
                        ...pages,
                        pageNum
                    }
                }
                this.getProjectList()
            },
            async plateChange(key) {
                let {ownerCode, ownerType, extKey} = this.defaultPlateInfo
                let params = {
                    ownerType,
                    ownerCode,
                    extKey,
                    extValue: key,
                    token: 'wangyang'
                }
                let {data: {success, value}} = await http.ajax('post', apiList.project_config_set_default_project_plate, params)
                if (success) {
                    this.defaultPlateInfo = {
                        ...this.defaultPlateInfo,
                        ...value
                    }
                    this.collapse = {
                        ...this.collapse,
                        defaultPlate: value.extValue
                    }
                    debugger;
                    sweetAlert.successWithTimer('设置默认项目成功')
                }
            },
            async getProjectList() {
                let {pages, pages: {pageNum: page, pageSize}} = this.collapse
                let params = {
                    type: 1,
                    status: 1,
                    page,
                    pageSize,
                    token: 'wangyang'
                }
                let {data: {success, value, pageQuery: {totalCount: total}}} = await http.ajax('post', apiList.project_config_project_list_query_list, params)
                debugger;
                if (success) {
                    debugger;
                    this.collapse = {
                        ...this.collapse,
                        datas: value,
                        pages: {
                            ...pages,
                            total
                        }
                    }
                }
            },
            async getDefaultPlateKey() {
                let params = {
                    ownerType: 3,
                    ownerCode: 'admin',
                    extKey: 'defaultProjectKey',
                    token: 'wangyang'
                }
                let {data: {success, value}} = await http.ajax('post', apiList.project_config_query_default_plate, params)
                if (success) {
                    this.defaultPlateInfo = {
                        ...value
                    }
                    this.collapse = {
                        ...this.collapse,
                        defaultPlate: value.extValue
                    }
                }
            },
        },
        mounted() {
            this.getProjectList()
            this.getDefaultPlateKey()
        }
    }
</script>

<style scoped lang="less">
    .config {
        .card-box {
            padding: 1rem;
            &-desc {
                height: 40px;
                line-height: 40px;
            }
        }
    }
</style>