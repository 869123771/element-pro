<template>
    <div>
        <el-dropdown>
            <div class = "avatar flex items-center">
                <div class = "px-1">
                    <avue-avatar :src = "getAvatarView(userInfo.avatar)"></avue-avatar>
                </div>
                <div>{{userInfo.username}}</div>
            </div>
            <el-dropdown-menu>
                <el-dropdown-item @click.native = "logout">
                    <i class = "iconfont icon-wy-log-out"></i>登出
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

    </div>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex'
    import {constant} from '@/utils'

    export default {
        name: "Avatar",
        computed : {
            ...mapGetters(['userInfo'])
        },
        methods : {
            ...mapActions({
                logout : 'LOGIN_OUT'
            }),
            getAvatarView(avatar) {
                let {config:{baseUrl:{imgDomainURL}}} = constant
                return `${imgDomainURL}/${avatar}`
            },
        }
    }
</script>

<style scoped>

</style>
