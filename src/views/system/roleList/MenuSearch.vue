<template>
    <avue-form :option = "form.option" v-model = "form.model">
        <template slot="menuAssign" slot-scope = "{value}">
            <el-tree
                    ref = "tree"
                    show-checkbox
                    default-expand-all
                    check-strictly
                    node-key = "key"
                    :data="value.data"
                    :props="value.defaultProps"
                    :default-checked-keys = "value.defaultCheckedkeys"
            ></el-tree>
        </template>
    </avue-form>
</template>

<script>
    import {http,constant,apiList,sweetAlert} from '@/utils'
    import {mapState} from 'vuex'
    export default {
        name: "MenuSearch",
        props : {
            menuCheckedIds : {
                type : Array
            }
        },
        data(){
            return {
                form : {
                    model : {
                        menuAssign : {
                            data : [],
                            defaultProps : {
                                children: 'children',
                                label: 'slotTitle'
                            },
                            defaultCheckedkeys : []
                        }
                    },
                    option : {
                        menuBtn : false,
                        labelWidth : 100,
                        column : [
                            {
                                label: '所拥有的权限',
                                prop: 'menuAssign',
                                type : 'tree',
                                formslot: true,
                                span: 24,
                            },
                        ]
                    }
                },
                ids : []
            }
        },
        watch : {
            data : {
                handler(props){
                    debugger;

                },
                immediate : true
            }
        },
        methods : {
            async queryTreeRole(){
                let {success,result} = await http.get(apiList.sys_role_query_tree_list)
                if(success){
                    let {ids,treeList} = result
                    let {model,model:{menuAssign}} = this.form
                    this.form = {
                        ...this.form,
                        model : {
                            ...model,
                            menuAssign : {
                                ...menuAssign,
                                data : treeList,
                                defaultCheckedkeys : this.menuCheckedIds
                            }
                        }
                    }
                    this.ids = ids
                }
            }
        },
        mounted(){
            this.queryTreeRole()
        }
    }
</script>

<style scoped>

</style>