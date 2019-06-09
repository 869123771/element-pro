<template>
    <div class = "breadcrumb">
        <el-breadcrumb>
            <template v-for = "(item,index) in breadcrumbList">
                <el-breadcrumb-item v-if = "item.link === false || index === breadcrumbList.length -1">
                    <i class = "iconfont breadcrum-icon" :class = "item.icon"></i>
                    <span>{{item.title}}</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item :to="item.path" v-else>
                    <i class = "iconfont breadcrum-icon" :class = "item.icon"></i>
                    <span>{{item.title}}</span>
                </el-breadcrumb-item>
            </template>
        </el-breadcrumb>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "BreadCrumb",
        /*computed : {
            ...mapGetters([
                'breadcrumbList'
            ])
        }*/
        data(){
            return {
                breadcrumbList : []
            }
        }
    }
</script>

<style scoped lang = "less">
    .breadcrum{
        &-icon{
            padding-right: 2px;
        }
    }
</style>
