<template>
    <div class="user-layout">
        <div class="user-layout-container">
            <route-view></route-view>
        </div>
    </div>
</template>

<script>
    import RouteView from "@/components/layouts/RouteView"

    export default {
        name: "UserLayout",
        components: {RouteView},

        data() {
            return {}
        },
        mounted() {

        },
    }
</script>

<style lang="scss" scoped>
    .user-layout{
        height : 100%;
        text-align: center;
        &-container {
            width: 100%;
            min-height: 100%;
            height : 100%;
            background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
            background-size: 100%;
            position: relative;
        }
    }
</style>
