<template>
    <div class = "breadcrumb">
        <Breadcrumb>
            <template v-for = "(item,index) in breadcrumbList">
                <BreadcrumbItem v-if = "item.link === false || index === breadcrumbList.length -1">
                    <i class = "iconfont" :class = "item.icon"></i>
                    <span>{{item.title}}</span>
                </BreadcrumbItem>
                <BreadcrumbItem :to="item.path" v-else>
                    <i class = "iconfont" :class = "item.icon"></i>
                    <span>{{item.title}}</span>
                </BreadcrumbItem>
            </template>
        </Breadcrumb>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "BreadCrumb",
        computed : {
            ...mapGetters([
                'breadcrumbList'
            ])
        }
    }
</script>

<style scoped>

</style>
