<template>
    <div>
        <el-form :model = "form" label-width = "100px">
            <el-form-item label = "所拥有的权限">
                <el-tree
                        v-if = "menuAssign.show"
                        ref="tree"
                        show-checkbox
                        node-key="key"
                        :expand-on-click-node="false"
                        :default-expanded-keys="menuAssign.defaultExpandKes"
                        :check-strictly="menuAssign.checkStrict"
                        :data="menuAssign.data"
                        :props="menuAssign.defaultProps"
                        :default-checked-keys="menuAssign.defaultCheckedkeys"
                >
                <span class="mt-1" slot-scope="{ node, data}" @click="dataRule(node,data)">
                    <span>{{ node.label }}</span>
                    <span v-if="data.ruleFlag" class="fa fa-fw fa-align-left text-red-600 pl-1"></span>
                </span>
                </el-tree>
            </el-form-item>
        </el-form>
        <slide-out :visible.sync="drawer.show"
                   :dock ="drawer.direction"
                   :title="drawer.title"
                   :size="drawer.width"
                   @closed="close"
        >
            <data-rule :data-rule-props="dataRuleProps" @closeDataRuleDialog="close"></data-rule>
        </slide-out>
        <!--<drag-drawer v-model="drawer.show"
                     :draggable="drawer.draggable"
                     :title="drawer.title"
                     :width.sync="drawer.width"
                     :direction="drawer.direction"
                     :closeOnClickModal="drawer.closeOnClickModal"
                     @close="close"
        >
            <data-rule :data-rule-props="dataRuleProps" @closeDataRuleDialog="close"></data-rule>
        </drag-drawer>-->
    </div>
</template>

<script>
    import {http, constant, apiList, sweetAlert} from '@/utils'
    import {mapState} from 'vuex'
    import DragDrawer from '@/components/dragDrawer'
    import DataRule from './DataRule'
    import {isEmpty} from '30-seconds-of-code'

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
        data() {
            return {
                form: {},
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
                },
                drawer: {
                    show: false,
                    placement: 'right',
                    title: '数据规则/按钮权限配置',
                    width: '350px',
                    direction : 'right',
                },
                dataRuleProps: {}
            }
        },
        watch: {
            menuSearch: {
                handler(props) {
                    debugger;
                    if (!isEmpty(props)) {
                        let {roleId, ...res} = props
                        this.menuAssign = {
                            ...this.menuAssign,
                            ...res
                        }
                        this.dataRuleProps = {
                            ...this.dataRuleProps,
                            roleId
                        }
                        //this.queryTreeRole()
                    }
                },
                immediate: true
            }
        },
        methods: {
            dataRule(node, data) {
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
                    this.menuAssign = {
                        ...this.menuAssign,
                        data: treeList,
                        ids,
                        defaultExpandKes: ids
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