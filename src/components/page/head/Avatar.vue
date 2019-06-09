<template>
    <div class = "avatar flex items-center">
        <div><img :src = "userInfo.avatar"></div>
        <div>{{userInfo.username}}</div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "Avatar",
        computed : {
            ...mapGetters(['userInfo'])
        }
    }
</script>

<style scoped>

</style>
