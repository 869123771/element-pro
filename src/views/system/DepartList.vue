<template>
    <div class="dept">
        <el-row>
            <el-col :span="12" class="pr-2">
                <el-card>
                    <div>
                        <el-button plain icon="el-icon-plus" type = "primary" @click="addTopDept">添加一级部门</el-button>
                        <el-button plain icon="iconfont icon-upload">导入</el-button>
                        <el-button plain icon="iconfont icon-download">导出</el-button>
                    </div>
                    <div class="my-3">
                        <el-input v-model="tree.filterDept"></el-input>
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
                    ></el-tree>
                </el-card>
            </el-col>
            <el-col :span="12" class="pl-2">
                <el-card>
                    <avue-form :option="form.option" v-model="form.model">
                        <template slot="tree" slot-scope="{value}">

                        </template>
                    </avue-form>
                </el-card>
            </el-col>
        </el-row>
        <drag-dialog :drag-dialog="dialog">
            <add></add>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import Add from './deptList/Add'
    import {phoneCheck} from '@/utils/modules/validate'

    let customParams = {
        flag: true,
    }

    export default {
        name: "DepartList",
        components : {
            DragDialog,
            Add
        },
        data() {
            return {
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
                                readonly : true,
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
                                maxlength: 200,
                                span: 24
                            },
                        ]
                    },
                    model: {}
                },
                dialog: {
                    width: '30',
                    height : '600',
                    name: 'addTopDept',
                    title: '新增',
                    showFooter : true,
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
            addTopDept(){
                debugger;
                this.$modal.show('addTopDept')
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
                return {departName : customParams.departName}
            },
            async nodeClick(obj, node, tree) {
                debugger;
                let {model} = this.form
                let {parentId} = obj
                customParams = {
                    ...customParams,
                    parentId,
                    flag : true,
                }

                let departName = parentId ? await this.deptCodeMapName(this.depts) : ''
                console.log(departName)

                this.form = {
                    ...this.form,
                    model: {
                        ...model,
                        ...obj,
                        parentId: departName
                    }
                }
            }
        },
        mounted() {
            this.getAllDepts()
        }
    }
</script>

<style scoped>

</style>