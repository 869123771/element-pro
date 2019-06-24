<template>
    <div class="dept">
        <el-row>
            <el-col span="12">
                <el-card>
                    <div class = "my-3">
                        <el-input v-model = "tree.filterDept"></el-input>
                    </div>
                    <el-tree
                            ref="tree"
                            show-checkbox
                            default-expand-all
                            check-strictly
                            node-key="id"
                            :data="tree.data"
                            :props="tree.defaultProps"
                    ></el-tree>
                </el-card>
            </el-col>
        </el-row>
        <avue-form :option="form.option" v-model="form.model">
            <template slot="tree" slot-scope="{value}">

            </template>
        </avue-form>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, constant} from '@/utils'

    export default {
        name: "DepartList",
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
                        menuBtn: false,
                        labelWidth: 100,
                        column: [
                            {
                                label: '',
                                prop: 'treeFilter',
                                formslot: true,
                                span: 12
                            },
                            {
                                label: '',
                                prop: 'tree',
                                formslot: true,
                                span: 12
                            },
                        ]
                    },
                    model: {}
                }
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
            })
        },
        mounted() {
            this.getAllDepts()
        }
    }
</script>

<style scoped>

</style>