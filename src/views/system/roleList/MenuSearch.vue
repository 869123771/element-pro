<template>
    <div>
        <avue-form :option="form.option" v-model="form.model">
            <template slot="menuAssign" slot-scope="{value}">
                <el-tree
                        ref="tree"
                        show-checkbox
                        node-key="key"
                        :expand-on-click-node="false"
                        :default-expanded-keys="value.defaultExpandKes"
                        :check-strictly="value.checkStrict"
                        :data="value.data"
                        :props="value.defaultProps"
                        :default-checked-keys="value.defaultCheckedkeys"
                >
                <span class="mt-1" slot-scope="{ node, data}" @click="dataRule(node,data)">
                    <span>{{ node.label }}</span>
                    <span v-if="data.ruleFlag" class="fa fa-fw fa-align-left text-red-600 pl-1"></span>
                </span>
                </el-tree>
            </template>
        </avue-form>
        <drag-drawer v-model="drawer.show"
                     :draggable="drawer.draggable"
                     :title="drawer.title"
                     :width.sync="drawer.width"
                     :placement="drawer.placement"
                     :closeOnClickModal="drawer.closeOnClickModal"
                     @close="close"
        >
            <data-rule :data-rule-props="dataRuleProps" @closeDataRuleDialog="close"></data-rule>
        </drag-drawer>
    </div>
</template>

<script>
    import {http, constant, apiList, sweetAlert} from '@/utils'
    import {mapState} from 'vuex'
    import DragDrawer from '@/components/dragDrawer'
    import DataRule from './DataRule'

    export default {
        name: "MenuSearch",
        props: {
            menuSearch: {
                type: Object
            }
        },
        components: {
            DragDrawer,
            DataRule
        },
        inject: {},
        data() {
            return {
                form: {
                    model: {
                        menuAssign: {
                            data: [],
                            defaultProps: {
                                children: 'children',
                                label: 'slotTitle'
                            },
                            defaultCheckedkeys: [],
                            defaultExpandKes: [],
                            checkStrict: true,
                            ids: []
                        }
                    },
                    option: {
                        menuBtn: false,
                        labelWidth: 100,
                        column: [
                            {
                                label: '所拥有的权限',
                                prop: 'menuAssign',
                                type: 'tree',
                                formslot: true,
                                span: 24,
                            },
                        ]
                    }
                },
                drawer: {
                    show: false,
                    placement: 'right',
                    title: '数据规则/按钮权限配置',
                    width: 350,
                    closeOnClickModal: true,
                    draggable: false,
                },
                dataRuleProps: {}
            }
        },
        watch: {
            menuSearch: {
                handler(props) {
                    debugger;
                    if (!this.validatenull(props)) {
                        let {model, model: {menuAssign}} = this.form
                        let {roleId, ...res} = props
                        this.form = {
                            ...this.form,
                            model: {
                                ...model,
                                menuAssign: {
                                    ...menuAssign,
                                    ...res
                                }
                            }
                        }
                        this.dataRuleProps = {
                            ...this.dataRuleProps,
                            roleId
                        }
                    }
                },
                immediate: true
            }
        },
        methods: {
            dataRule(node, data) {
                debugger;
                let {key: dataRuleId} = data
                this.drawer = {
                    ...this.drawer,
                    show: true
                }
                this.dataRuleProps = {
                    ...this.dataRuleProps,
                    dataRuleId
                }
                this.$emit('changeDialogWidth')
            },
            close() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
                this.$emit('changeDialogWidth', 1)
            },
            async queryTreeRole() {
                let {success, result} = await http.get(apiList.sys_role_query_tree_list)
                if (success) {
                    let {ids, treeList} = result
                    let {model, model: {menuAssign}} = this.form
                    this.form = {
                        ...this.form,
                        model: {
                            ...model,
                            menuAssign: {
                                ...menuAssign,
                                data: treeList,
                                ids,
                                defaultExpandKes: ids
                            }
                        }
                    }
                }
            }
        },
        created() {
            this.queryTreeRole()
        }
    }
</script>

<style scoped>

</style>