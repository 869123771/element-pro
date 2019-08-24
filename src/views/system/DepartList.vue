<template>
    <div class="dept m-3">
        <el-row>
            <el-col :span="12" class="pr-2">
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
                                    <i class="fa fa-fw fa-plus px-1 hover:color-blue-500" @click = "addChildDetp(node,data)"></i>
                                </el-tooltip>
                                <el-tooltip content="编辑" placement="top">
                                    <i class="fa fa-fw fa-pencil hover:color-blue-500" @click = "edit(node,data)"></i>
                                </el-tooltip>
                                <popover-confirm @confirm="confirmDeleteBatch(data.id)">
                                    <div slot="popover-content">
                                        <i class="fa fa-fw fa-minus hover:color-blue-500"></i>
                                    </div>
                                </popover-confirm>
                            </span>
                        </span>
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="12" class="pl-2">
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
                depts: ({system}) => system.depts,
            })
        },
        watch: {
            depts: {
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
                getAllDepts: 'GET_ALL_DEPTS',
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
                this.getAllDepts()
            },
            addTopDept() {
                this.dialog = {
                    ...this.dialog,
                    title: '新增部门',
                    width: 400,
                    height: 500,
                    name : 'addTopDept'
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
            addChildDetp(node, data) {
                this.dialog = {
                    ...this.dialog,
                    title: '新增子部门',
                    width: 400,
                    height: 500,
                    name : 'addChildDept'
                }
                this.component = {
                    ...this.component,
                    ref: 'addChildDept',
                    data : {
                        ...data,
                        flag : 0            //新增
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
                    height: 600,
                    name : 'editDept'
                }
                this.component = {
                    ...this.component,
                    ref: 'editDept',
                    data : {
                        ...data,
                        ...this.handleDeptName(data),
                        flag : 1            //编辑
                    },
                }
                let {name} = this.dialog
                this.$nextTick(()=>{
                    this.$modal.show(name)
                })
            },
            closeDialog() {
                let {name} = this.dialog
                this.$modal.hide(name)
                this.getAllDepts()
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
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
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
            deptCodeMapName(datas) {
                let {flag} = customParams
                if (flag) {
                    for (let i = 0; i < datas.length; i++) {
                        let {children, id, departName} = datas[i]
                        if (children && children.length) {
                            if (customParams.parentId === id) {
                                customParams = {
                                    ...customParams,
                                    flag: false,
                                    departName
                                }
                                return departName
                            }
                            this.deptCodeMapName(children)
                        }
                    }

                }
                return customParams.departName
            },

            handleDeptName(data){
                let {parentId} = data
                customParams = {
                    ...customParams,
                    parentId,
                    flag: true,
                }

                let departName = parentId ? this.deptCodeMapName(this.depts) : ''
                console.log(departName)

                return {parentIdName: departName}
            },
            handleBaseInfo(data){
                this.tabs = {
                    ...this.tabs,
                    basicInfo : {
                        ...data,
                        ...this.handleDeptName(data)
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
                //this.handleDeptName(data)
                this.handleBaseInfo(data)
                this.handleUserInfo(data)
            },
            deleteBatch() {
                let {checkedKeys} = customParams
                sweetAlert.confirm('删除', '确认要删除吗', this.confirmDeleteBatch, checkedKeys.join(','))
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.sys_dept_delete_batch, {ids})
                if (success) {
                    sweetAlert.success(message)
                    this.getAllDepts()
                } else {
                    sweetAlert.error(message)
                }
            },
        },
        mounted() {
            this.getAllDepts()
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