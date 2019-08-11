<template>
    <div class = "dept-search">
        <el-form label-width="80px">
            <el-form-item label = "上级部门">
                <el-tree
                        ref = "tree"
                        show-checkbox
                        default-expand-all
                        check-strictly
                        node-key = "id"
                        :data="deptAssign.data"
                        :props="deptAssign.defaultProps"
                        :default-checked-keys = "deptAssign.defaultCheckedkeys"
                ></el-tree>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {isEmpty} from '30-seconds-of-code'
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
                deptAssign : {
                    data : [],
                    defaultProps : {
                        children: 'children',
                        label: 'departName'
                    },
                    defaultCheckedkeys : []
                },
            }
        },
        watch : {
            depts : {
                handler(props){
                    if(!isEmpty(props)){
                        debugger;
                        this.deptAssign = {
                            ...this.deptAssign,
                            data : props,
                            defaultCheckedkeys : this.deptCheckedIds
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
        /deep/ .el-tree-node__content>.el-checkbox{
            margin-right: 8px;
        }
    }
</style>