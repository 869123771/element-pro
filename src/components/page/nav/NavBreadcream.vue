<template>
    <el-breadcrumb separator="/">
        <template v-for="item in navBreadcrumbList">
            <el-breadcrumb-item>
                <span :class="'pr-1 anticon icon-' + item.icon"></span>
                <span>{{item.title}}</span>
            </el-breadcrumb-item>
        </template>
    </el-breadcrumb>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "NavBreadcream",
        data() {
            return {}
        },
        computed: {
            ...mapState({
                navBreadcrumbList: ({app}) => app.navBreadcrumbList
            })
        },
    }
</script>

<style scoped lang="less">
    /deep/ .el-breadcrumb__inner,
    /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner,
    /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
    /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
    /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
        color : inherit;
    }
</style>