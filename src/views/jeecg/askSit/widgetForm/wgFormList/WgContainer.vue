<template>
    <el-card class = "mb-3">
        <div slot = "header" class = "flex justify-between">
            <slot name = "header"></slot>
            <div class = "control-icon">
                <el-tooltip content = "长按拖动项目" placement="top" effect="light">
                    <span class = "icon fa fa-fw fa-lg fa-arrows cursor-pointer pr-2"></span>
                </el-tooltip>
                <el-tooltip content = "逻辑设置" placement="top" effect="light">
                    <span class = "icon fa fa-fw fa-lg fa-usb cursor-pointer pr-8"></span>
                </el-tooltip>
                <el-tooltip content = "复制" placement="top" effect="light">
                    <span class = "icon fa fa-fw fa-lg fa-copy cursor-pointer pr-2"></span>
                </el-tooltip>
                <el-tooltip content = "删除" placement="top" effect="light">
                    <span class = "icon iconfont fa-lg icon-wy-delete2 cursor-pointer" @click = "$emit('handleWidgetDelete')"></span>
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

<style scoped lang = "less">
    @import "../../widgetForm";
    .fa-lg{
        font-size: 1.33333333em !important;
    }
    .el-card, .el-message{
        border-radius: 0px;
    }
</style>