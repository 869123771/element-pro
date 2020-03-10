<template>
    <transition name="router-fade" mode="out-in">
        <keep-alive v-if="keepAlive">
            <router-view/>
        </keep-alive>
        <router-view v-else/>
    </transition>
</template>

<script>

    export default {
        name: "RouteView",
        computed: {
            keepAlive() {
                return this.$route.meta.keepAlive
            }
        },
    }
</script>
