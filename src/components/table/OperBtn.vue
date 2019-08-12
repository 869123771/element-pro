<script>
    import {mapState} from 'vuex'

    export default {
        name: "OperBtn",
        props: {
            btnInfo: {
                type: Array
            }
        },
        computed: {
            ...mapState({
                permissions: ({user}) => user.permissions
            })
        },
        render(h) {
            let btnInfo = this.btnInfo
            let props = {
                style: {
                    cursor: 'pointer',
                    paddingLeft: '0.25rem',
                    paddingRight: '0.25rem',
                }
            }
            return (
                <div>
                    {
                        btnInfo.map(({type, dropDownItems, popover, popText, content, className, permission, event},index) => {
                            debugger;
                            return (
                                type === 'dropDown' ?
                                    <el-dropdown placement="bottom">
                                        <span class = "text-blue-500 text-base">
                                          <i class={className}></i>
                                       </span>
                                        <el-dropdown-menu slot="dropdown">
                                            {
                                                dropDownItems.map((item, index) => {
                                                    return (
                                                        item.popover ?
                                                            <el-popover placement="top"
                                                                        width="160"
                                                                        ref={index}
                                                            >
                                                                <div class="pb-3 flex">
                                                                <span class="px-1 text-orange-500 font-mono">
                                                                    <i class="el-icon-warning"></i>
                                                                </span>
                                                                    <slot name="popover-title">确定删除吗</slot>
                                                                </div>
                                                                <div class="text-right">
                                                                    <el-button size="mini" type="text"
                                                                               onClick={()=>this.cancel(index)}>取消
                                                                    </el-button>
                                                                    <el-button type="primary" size="mini"
                                                                               onClick={()=>{item.event()}}>确定
                                                                    </el-button>
                                                                </div>
                                                                <el-dropdown-item
                                                                    slot="reference">{item.content}</el-dropdown-item>
                                                            </el-popover> :
                                                            <el-dropdown-item nativeOnclick = {()=> item.event()}>{item.content}</el-dropdown-item>
                                                    )
                                                })
                                            }
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                    :
                                    popover ?
                                        <el-popover placement="top"
                                                    width="160"
                                                    ref={index}
                                        >
                                            <div class="pb-3 flex">
                                                                <span class="px-1 text-orange-500 font-mono">
                                                                    <i class="el-icon-warning"></i>
                                                                </span>
                                                <slot name="popover-title">确定删除吗</slot>
                                            </div>
                                            <div class="text-right">
                                                <el-button size="mini" type="text"
                                                           onClick={()=>this.cancel(index)}>取消
                                                </el-button>
                                                <el-button type="primary" size="mini"
                                                           onClick={()=>{item.event()}}>确定
                                                </el-button>
                                            </div>
                                            <span class = "text-blue-500 text-base">
                                                <i {...props} class ={className} onClick={() => event()}></i>
                                            </span>
                                        </el-popover>
                                    :
                                    <el-tooltip placement="top" content={content}>
                                        <span class ="text-blue-500 text-base">
                                            <i {...props} class = {className} onClick={() => event()}></i>
                                        </span>
                                    </el-tooltip>
                            )
                        })
                    }
                </div>
            )
        },
        methods : {
            cancel(index){
                this.$refs[index].doClose();
            }
        }
    }
</script>

<style scoped>

</style>
