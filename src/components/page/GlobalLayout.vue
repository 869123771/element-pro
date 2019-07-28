<template>
    <el-container class="layout">
        <el-aside :width="menuProps.collapse ? '64px' : '200px'" class="layout-aside">
            <side-menu></side-menu>
        </el-aside>
        <el-container>
            <el-header class = "layout-header border-b bg-white" :style = "{marginLeft : menuProps.collapse ? '64px' : '200px'}">
                <global-header></global-header>
            </el-header>
            <el-main class = "layout-main" :style = "{marginLeft : menuProps.collapse ? '64px' : '200px'}">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>
<script>
    import {mapState} from 'vuex'
    import SideMenu from "@/components/menu/SideMenu";
    import GlobalHeader from "./GlobalHeader"
    export default {
        name: 'GlobalLayout',
        components: {
            SideMenu,GlobalHeader
        },
        computed : {
            ...mapState({
                menuProps : ({app}) => app.menuProps
            })
        },
        data() {
            return {}
        }
    }
</script>
<style scoped lang="less">
    .layout {
        &-aside {
            background-color: rgb(238, 241, 246);
            position: fixed;
            overflow: hidden;
            height: 100vh;
        }
        &-header{
            line-height : 60px;
            padding : 0 1rem;
        }
        &-main{
            padding: 0px;
            overflow: hidden;
        }
    }
</style>
