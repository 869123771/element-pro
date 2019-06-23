<template>
    <div class = "dept-search">
        <avue-form :option = "form.option" v-model = "form.model">
            <template slot="deptAssign" slot-scope = "{value}">
                <el-tree
                        ref = "tree"
                        show-checkbox
                        default-expand-all
                        check-strictly
                        node-key = "id"
                        :data="value.data"
                        :props="value.defaultProps"
                        :default-checked-keys = "value.defaultCheckedkeys"
                ></el-tree>
            </template>
        </avue-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "DeptSearch",
        props : {
            deptCheckedIds : {
                type : Array
            }
        },
        computed : {
            ...mapState({
                depts: ({system}) => system.depts,
            })
        },
        data(){
            return {
               form : {
                   model : {
                       deptAssign : {
                           data : [],
                           defaultProps : {
                               children: 'children',
                               label: 'departName'
                           },
                           defaultCheckedkeys : []
                       }
                   },
                   option : {
                       menuBtn : false,
                       column : [
                           {
                               label: '上级部门',
                               prop: 'deptAssign',
                               type : 'tree',
                               formslot: true,
                               span: 24,
                           },
                       ]
                   }
               }
            }
        },
        watch : {
            depts : {
                handler(props){
                    debugger;
                    let {model,model:{deptAssign}} = this.form
                    this.form = {
                        ...this.form,
                        model : {
                            ...model,
                            deptAssign : {
                                ...deptAssign,
                                data : props,
                                defaultCheckedkeys : this.deptCheckedIds
                            }
                        }
                    }
                },
                immediate : true
            }
        }
    }
</script>

<style scoped lang = "less">
    .dept-search{
        /deep/ .el-form-item__content{
            margin-top:0.25rem;
        }
    }
</style>