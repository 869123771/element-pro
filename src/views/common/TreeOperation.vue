<script>
    export default {
        name: "TreeOperation",
        props : {
            treeOperation : {
                type : Object
            }
        },
        data(){
          return {
              tree : {
                  operation : [
                      {label : '父子关联',event : this.connect},
                      {label : '取消关联',event : this.cancelConnect},
                      {label : '全部勾选',event : this.selectAll},
                      {label : '全部取消',event : this.selectNone},
                      {label : '展开所有',event : this.expandAll},
                      {label : '合并所有',event : this.shrinkAll},
                  ]
              }

          }
        },
        render(h,context){
            debugger;
            let {operation} = this.tree
            return (
                <el-dropdown placement="top">
                    <el-button plain>
                        树操作<i class="el-icon-arrow-up el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        {
                            operation.map(({label,event})=>{
                                return <el-dropdown-item nativeOnClick = {()=>event()}>{label}</el-dropdown-item>
                            })
                        }
                    </el-dropdown-menu>
                </el-dropdown>
            )
        },
        methods : {
            connect(){
                this.$emit('connect')
            },
            cancelConnect(){
                this.$emit('cancelConnect')
            },
            selectAll(){
                this.$emit('selectAll')
            },
            selectNone(){
                this.$emit('selectNone')
            },
            expandAll(){
                this.$emit('expandAll')
            },
            shrinkAll(){
                this.$emit('shrinkAll')
            }
        }
    }
</script>

<style scoped>

</style>