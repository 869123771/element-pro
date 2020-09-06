<template>
    <div>
        <el-form :model = "form" label-width = "100px">
            <el-form-item label = "所拥有的权限">
                <el-tree
                        v-if = "menuSearch.show"
                        ref="tree"
                        show-checkbox
                        node-key="key"
                        :expand-on-click-node="false"
                        :default-expanded-keys="menuSearch.defaultExpandKes"
                        :check-strictly="menuSearch.checkStrict"
                        :data="menuSearch.data"
                        :props="{children: 'children',label: 'slotTitle'}"
                        :default-checked-keys="menuSearch.defaultCheckedKeys"
                >
                <span slot-scope="{ node, data}" @click="dataRule(node,data)">
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
                dataRuleProps : {

                },
                drawer: {
                    show: false,
                    placement: 'right',
                    title: '数据规则/按钮权限配置',
                    width: '350px',
                    direction : 'right',
                },
            }
        },
        watch: {

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
                    ...this.menuSearch,
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
        },
    }
</script>

<style scoped>

</style>
