<template>
    <el-card class = "mb-3">
        <div slot = "header" class = "flex justify-between">
            <slot name = "header"></slot>
            <div class = "">
                <el-tooltip content = "长按拖动项目" placement="top">
                    <span class = "fa fa-fw fa-lg fa-arrows cursor-pointer pr-1"></span>
                </el-tooltip>
                <el-tooltip content = "逻辑设置" placement="top">
                    <span class = "fa fa-fw fa-lg fa-gear cursor-pointer pr-1"></span>
                </el-tooltip>
                <el-tooltip content = "复制" placement="top">
                    <span class = "fa fa-fw fa-lg fa-copy cursor-pointer pr-1"></span>
                </el-tooltip>
                <el-tooltip content = "删除" placement="top">
                    <span class = "iconfont fa-lg icon-wy-delete2 cursor-pointer" @click = "$emit('handleWidgetDelete')"></span>
                </el-tooltip>
            </div>
        </div>
        <slot name = "body"></slot>
    </el-card>
</template>

<script>
    export default {
        name: "WgContainer"
    }
</script>

<style scoped>
    .fa-lg{
        font-size: 1.33333333em !important;
    }
    .el-card, .el-message{
        border-radius: 0px;
    }
</style>