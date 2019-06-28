<template>
    <div class="dept">
        <el-row>
            <el-col :span="12" class="pr-2">
                <el-card>
                    <div>
                        <el-button plain icon="el-icon-plus" type="primary" @click="addTopDept">添加一级部门</el-button>
                        <el-button plain icon="iconfont icon-upload">导入</el-button>
                        <el-button plain icon="iconfont icon-download">导出</el-button>
                        <el-button plain icon="el-icon-close" v-show="show.delete" @click="deleteBatch">批量删除</el-button>
                    </div>
                    <div class="my-3">
                        <el-input size = "medium" v-model="tree.filterDept"></el-input>
                    </div>
                    <el-tree
                            ref="tree"
                            show-checkbox
                            default-expand-all
                            check-strictly
                            node-key="id"
                            highlight-current
                            :data="tree.data"
                            :props="tree.defaultProps"
                            @node-click="nodeClick"
                            @check="treeCheck"
                    ></el-tree>
                </el-card>
            </el-col>
            <el-col :span="12" class="pl-2">
                <el-card>
                    <avue-form ref="dept" :option="form.option" v-model="form.model" @submit="submit">
                        <template slot="tree" slot-scope="{value}">

                        </template>
                    </avue-form>
                </el-card>
            </el-col>
        </el-row>
        <drag-dialog :drag-dialog="dialog" @confirm = "confirmAdd">
            <add ref = "add"></add>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import Add from './deptList/Add'
    import {phoneCheck} from '@/utils/modules/validate'

    let customParams = {
        flag: true,
    }

    export default {
        name: "DepartList",
        components: {
            DragDialog,
            Add
        },
        data() {
            return {
                show: {
                    delete: false
                },
                tree: {
                    filterDept: '',
                    data: [],
                    defaultProps: {
                        children: 'children',
                        label: 'departName'
                    },
                },
                form: {
                    option: {
                        labelWidth: 100,
                        submitText : '修改并保存',
                        column: [
                            {
                                label: '机构名称',
                                prop: 'departName',
                                span: 24
                            },
                            {
                                label: '上级部门',
                                prop: 'parentId',
                                //type: 'select',
                                readonly: true,
                                span: 24
                            },
                            {
                                label: '机构编码',
                                prop: 'orgCode',
                                disabled: true,
                                span: 24
                            },
                            {
                                label: '排序',
                                prop: 'departOrder',
                                type: 'number',
                                span: 24
                            },
                            {
                                label: '手机号',
                                prop: 'mobile',
                                span: 24,
                                rules: [
                                    {validator: phoneCheck, trigger: 'change'}
                                ]
                            },
                            {
                                label: '地址',
                                prop: 'address',
                                span: 24
                            },
                            {
                                label: '备注',
                                prop: 'memo',
                                type: 'textarea',
                                maxLength: 200,
                                span: 24
                            },
                        ]
                    },
                    model: {}
                },
                dialog: {
                    width: '30',
                    height: '600',
                    name: 'addTopDept',
                    title: '新增',
                    showFooter: true,
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
            addTopDept() {
                this.$modal.show('addTopDept')
            },
            confirmAdd(){
                let addRef = this.$refs.add
                addRef.$refs.form.validate(valid=>{
                    if(valid){
                        this.dialog = {
                            ...this.dialog,
                            loading : true
                        }
                        addRef.saveData()
                    }
                })
                this.dialog = {
                    ...this.dialog,
                    loading : false
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
                return {departName: customParams.departName}
            },
            submit() {
                this.$refs.dept.validate(validate => {
                    if (validate) {
                        this.saveData()
                    }
                })
            },
            async saveData() {
                let {model} = this.form
                let params = {
                    ...model,
                    parentId: customParams.parentId
                }
                let {success, message, result} = await http.put(apiList.sys_dept_edit, params)
                if (success) {

                } else {
                    sweetAlert.error(message)
                }
            },
            treeCheck(treeItem, treeData) {
                debugger;
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
            nodeClick(obj, node, tree) {
                debugger;
                let {model} = this.form
                let {parentId} = obj
                customParams = {
                    ...customParams,
                    parentId,
                    flag: true,
                }

                let departName = parentId ? this.deptCodeMapName(this.depts) : ''
                console.log(departName)

                this.form = {
                    ...this.form,
                    model: {
                        ...model,
                        ...obj,
                        parentId: departName
                    }
                }
            },
            deleteBatch() {
                let {checkedKeys} = customParams
                sweetAlert.confirm('删除', '确认要删除吗', this.confirmDeleteBatch, checkedKeys.join(','))
            },
            async confirmDeleteBatch(ids) {
                let {success, message} = await http.delete(apiList.sys_dept_delete_batch, ids)
                if (success) {
                    sweetAlert.successWithTimer(message)
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

<style scoped>

</style>