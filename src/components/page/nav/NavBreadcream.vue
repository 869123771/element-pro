<template>
    <div class = "bread-crumb">
        <el-breadcrumb separator="/">
            <template v-for="item in navBreadcrumbList">
                <el-breadcrumb-item>
                    <span :class="'pr-1 anticon icon-' + item.icon"></span>
                    <span>{{item.title}}</span>
                </el-breadcrumb-item>
            </template>
        </el-breadcrumb>
    </div>
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
    .bread-crumb {
        padding : 0 8px;
    }
</style>