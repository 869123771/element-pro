<template>
    <div class = "avatar flex items-center">
        <div class = "px-1">
            <avue-avatar :src = "getAvatarView(userInfo.avatar)"></avue-avatar>
        </div>
        <div>{{userInfo.username}}</div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {constant} from '@/utils'

    export default {
        name: "Avatar",
        computed : {
            ...mapGetters(['userInfo'])
        },
        methods : {
            getAvatarView(avatar) {
                let {config:{baseUrl:{imgDomainURL}}} = constant
                return `${imgDomainURL}/${avatar}`
            },
        }
    }
</script>

<style scoped>

</style>
