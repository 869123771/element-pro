<template>
    <div class="dept">
        <avue-form :option="form.option" v-model="form.model">
            <el-row>
                <el-col span = "12">
                    <template slot="treeFilter" slot-scope="{value}">
                        <el-input v-model = "form.model.treeFilter"></el-input>
                    </template>
                    <template slot="tree" slot-scope="{value}">
                        <el-tree
                                ref="tree"
                                show-checkbox
                                default-expand-all
                                check-strictly
                                node-key="id"
                                :data="value.data"
                                :props="value.defaultProps"
                        ></el-tree>
                    </template>
                </el-col>
            </el-row>
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
                    model: {
                        tree: {
                            filterDept: '',
                            data: [],
                            defaultProps: {
                                children: 'children',
                                label: 'departName'
                            },
                        }
                    }
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
                    debugger;
                    let {model, model: {tree}} = this.form
                    this.form = {
                        ...this.form,
                        model: {
                            ...model,
                            tree: {
                                ...tree,
                                data: props,
                                defaultCheckedkeys: []
                            }
                        }
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