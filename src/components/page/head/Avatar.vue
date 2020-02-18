<template>
    <div class = "avatar flex items-center h-full">
        <el-dropdown>
            <div class = "flex items-center">
                <div class = "flex px-1">
                    <el-avatar :size = "32":src = "getAvatarView(userInfo.avatar)"></el-avatar>
                </div>
                <div class = "flex items-center">
                    <span class = "px-1">{{userInfo.realname}}</span>
                </div>
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
    .avatar{
        padding: 0 8px;
        width: auto;
    }
</style>
