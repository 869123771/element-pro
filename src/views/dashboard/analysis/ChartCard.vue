<template>
    <el-card shadow="naver" class = "border-0 p-1">
        <slot name = "card-head"></slot>
        <slot name = "card-content"></slot>
        <slot name = "card-footer"></slot>
    </el-card>
</template>

<script>
    export default {
        name: "CardChart"
    }
</script>

<style scoped>

</style>