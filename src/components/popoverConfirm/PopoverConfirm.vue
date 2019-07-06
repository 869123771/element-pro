<template>
    <el-popover placement="top"
                width="160"
                v-model = "show"
    >
        <div class="pb-3 flex">
            <span class = "px-1 text-orange-500 font-mono">
                <i class = "el-icon-warning"></i>
            </span>
            <slot name = "popover-title">确定删除吗</slot>
        </div>
        <div class="text-right">
            <el-button size="mini" type="text" @click="cancel">取消
            </el-button>
            <el-button type="primary" size="mini"
                       @click="confirm">确定
            </el-button>
        </div>

        <div slot="reference">
            <slot name = "popover-content"></slot>
        </div>

    </el-popover>
</template>

<script>
    export default {
        name: "PopoverConfirm",
        props : {
            popoverShow : {
                type : Boolean,
                default : false
            }
        },
        data(){
            return {
                show : this.popoverShow
            }
        },
        methods : {
            confirm(){
                this.show = false
                this.$emit('confirm')
            },
            cancel(){
                this.show = false
            }
        },
    }
</script>

<style scoped>

</style>