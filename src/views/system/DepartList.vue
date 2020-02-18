<template>
    <div class="dept m-3">
        <el-row :gutter = "12">
            <el-col :xs = "24" :sm = "24" :md="12" :lg = "12" :xl = "12">
                <el-card>
                    <div>
                        <el-button plain icon="el-icon-plus" type="primary" @click="addTopDept">添加一级部门</el-button>
                        <el-button plain icon="iconfont icon-wy-upload" @click="fileImport">导入</el-button>
                        <el-button plain icon="iconfont icon-wy-download" @click="fileExport">导出</el-button>
                        <el-button plain icon="el-icon-close" v-show="show.delete" @click="deleteBatch">批量删除</el-button>
                    </div>
                    <div class="my-3">
                        <el-input size="medium" v-model="tree.filterDept" @input="filterText" clearable suffix-icon="el-icon-search"></el-input>
                    </div>
                    <el-tree
                            ref="tree"
                            show-checkbox
                            default-expand-all
                            check-strictly
                            node-key="id"
                            highlight-current
                            :expand-on-click-node = "false"
                            :data="tree.data"
                            :props="tree.defaultProps"
                            :filter-node-method="filterNode"
                            @node-click="nodeClick"
                            @check="treeCheck"
                    >
                        <span class="custom-tree-node" slot-scope="{ node, data}">
                            <span>{{ node.label }}</span>
                            <span class="custom-tree-node-control text-gray-900 text-base">
                                <el-tooltip content="新增子部门" placement="top">
                                    <i class="fa fa-fw fa-plus px-1 hover:color-blue-500" @click = "addChildDept(node,data)"></i>
                                </el-tooltip>
                                <el-tooltip content="编辑" placement="top">
                                    <i class="fa fa-fw fa-pencil hover:color-blue-500" @click = "edit(node,data)"></i>
                                </el-tooltip>
                                <popover-confirm @confirm="confirmDeleteBatch(data.id,true)">
                                    <div slot="popover-content">
                                        <i class="fa fa-fw fa-minus hover:color-blue-500"></i>
                                    </div>
                                </popover-confirm>
                            </span>
                        </span>
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :xs = "24" :sm = "24" :md="12" :lg = "12" :xl = "12">
                <el-card>
                    <el-tabs v-model="tabs.name" @tab-click="handleClick">
                        <el-tab-pane label="基本信息" name="basicInfo">
                            <basic-info :basic-info = "tabs.basicInfo"></basic-info>
                        </el-tab-pane>
                        <el-tab-pane label="用户信息" name="userInfo">
                            <user-info :user-info = "tabs.userInfo"></user-info>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
        <drag-dialog :drag-dialog="dialog" @confirm="confirmAdd">
            <component
                    :is="component.is"
                    :ref="component.ref"
                    :data="component.data"
                    @closeDialog="closeDialog"></component>
        </drag-dialog>
        <file-upload :file-upload="fileUpload" @uploadSuccess="uploadSuccess"></file-upload>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import FileUpload from '@/components/fileUpload'
    import Modify from './deptList/Modify'
    import BasicInfo from './deptList/BasicInfo'
    import UserInfo from './deptList/UserInfo'
    import {phoneCheck} from '@/utils/modules/validate'
    import {downloadFile} from '@/utils/modules/tools'

    import PopoverConfirm from '@/components/popoverConfirm'

    let customParams = {
        flag: true,
    }

    const uploadAction = () => {
        let {config: {baseUrl: {proxyURL}}} = constant
        return `${proxyURL + apiList.sys_dept_import}`
    }

    export default {
        name: "DepartList",
        components: {
            DragDialog,
            FileUpload,
            Modify,
            BasicInfo,
            UserInfo,
            PopoverConfirm
        },
        data() {
            return {
                show: {
                    delete: false
                },
                tabs : {
                    name : 'userInfo',
                    basicInfo : {},
                    userInfo : {}
                },
                tree: {
                    filterDept: '',
                    data: [],
                    defaultProps: {
                        children: 'children',
                        label: 'departName'
                    },
                },
                dialog: {
                    width: 30,
                    height: 500,
                    title: '新增',
                    showFooter: true,
                    loading : false
                },
                component: {
                    is: Modify,
                    ref: 'addDept',
                    data: {}
                },
                fileUpload: {
                    action: uploadAction()
                },
            }
        },
        computed: {
            ...mapState({
                dept: ({system}) => system.dept,
            })
        },
        watch: {
            dept: {
                handler(props) {
                    this.tree = {
                        ...this.tree,
                        data: props,
                        defaultCheckedkeys: []
                    }
                },
                immediate: true
            }
        },
        methods: {
            ...mapActions({
                getAllDept: 'GET_ALL_DEPT',
                getOrgCategory : 'GET_ORG_CATEGORY',
            }),
            handleClick({name}, event) {
                this.tabs = {
                    ...this.tabs,
                    name
                }
            },
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.departName.indexOf(value) !== -1;
            },
            fileImport() {
                this.$modal.show('fileUpload')
            },
            async fileExport() {
                let params = {}
                let {data, filename} = await http.getFileDownload(apiList.sys_dept_export, params)
                downloadFile(data, filename)

            },
            uploadSuccess() {
                this.$modal.hide('fileUpload')
                this.getAllDept()
            },
            addTopDept() {
                this.dialog = {
                    ...this.dialog,
                    title: '新增部门',
                    width: 400,
                    height: 540,
                    name : 'addTopDept',
                    loading : false,
                }
                this.component = {
                    ...this.component,
                    ref : 'addTopDept',
                    data: {}
                }
                let {name} = this.dialog
                this.$nextTick(()=>{
                    this.$modal.show(name)
                })
            },
            addChildDept(node, data) {
                this.dialog = {
                    ...this.dialog,
                    title: '新增子部门',
                    width: 400,
                    height: 600,
                    name : 'addChildDept',
                    loading : false,
                }
                this.component = {
                    ...this.component,
                    ref: 'addChildDept',
                    data : {
                        ...data,
                        flag : 0,                           //新增子部门
                        parentName : data.departName,
                    }
                }
                let {name} = this.dialog
                this.$nextTick(()=>{
                    this.$modal.show(name)
                })
            },
            edit(node, data){
                this.dialog = {
                    ...this.dialog,
                    title: '编辑部门',
                    width: 400,
                    height: 660,
                    name : 'editDept',
                    loading : false,
                }
                this.component = {
                    ...this.component,
                    ref: 'editDept',
                    data : {
                        ...data,
                        flag : 1,                                   //编辑子部门
                        parentName : this.handleDeptNameById(data.parentId),
                    },
                }
                let {name} = this.dialog
                this.$nextTick(()=>{
                    this.$modal.show(name)
                })
            },
            closeDialog() {
                let {name} = this.dialog
                this.dialog = {
                    ...this.dialog,
                    loading : false
                }
                this.$modal.hide(name)
                this.getAllDept()
            },
            confirmAdd() {
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
            },

            treeCheck(treeItem, treeData) {
                let {checkedKeys} = treeData
                if (checkedKeys.length) {
                    this.show = {
                        ...this.show,
                        delete: true
                    }
                } else {
                    this.show = {
                        ...this.show,
                        delete: false
                    }
                }
                customParams = {
                    ...customParams,
                    checkedKeys
                }
            },
            deptCodeMapName(data,parentId) {
                if(!data) return null
                for (let i = 0 ;i < data.length; i++){
                    let {children, id, departName} = data[i]
                    if (children && children.length) {
                        if (parentId === id) {
                            customParams = {
                                ...customParams,
                                departName
                            }
                            break
                        }
                    }else{
                        this.deptCodeMapName(children,parentId)
                    }
                }
                console.log('deptName',customParams.departName)
                return customParams.departName ;
            },

            handleDeptNameById(parentId){
                let departName = parentId ? this.deptCodeMapName(this.dept,parentId) : ''
                return departName
            },
            handleBaseInfo(data){
                this.tabs = {
                    ...this.tabs,
                    basicInfo : {
                        ...data,
                        parentName : this.handleDeptNameById(data.parentId)
                    }
                }
            },
            handleUserInfo(data){
                this.tabs = {
                    ...this.tabs,
                    userInfo : {
                        ...data,
                    }
                }
            },
            nodeClick(data, node, tree) {
                this.handleBaseInfo(data)
                this.handleUserInfo(data)
            },
            deleteBatch() {
                let {checkedKeys} = customParams
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_do'), this.confirmDeleteBatch, checkedKeys.join(','))
            },
            async confirmDeleteBatch(ids,flag) {
                let {success, message} = await http.delete(apiList.sys_dept_delete_batch, {ids})
                if (success) {
                    if(flag){
                        sweetAlert.successWithTimer(message)
                    }else{
                        sweetAlert.success(message)
                    }
                    this.getAllDept()
                } else {
                    sweetAlert.error(message)
                }
            },
        },
        mounted() {
            this.getAllDept()
            this.getOrgCategory()
        }
    }
</script>

<style scoped lang="less">
    .dept {
        /deep/ .el-tree {
            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 8px;
                &-control {
                    display: none;
                    position: absolute;
                    right: 0.25rem;
                }
                &:hover {
                    .custom-tree-node-control {
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }
    }
</style>