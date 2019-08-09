<template>
    <el-container class="layout">
        <el-aside :width="menuProps.collapse ? '64px' : '240px'" class="layout-aside">
            <side-menu></side-menu>
        </el-aside>
        <el-container>
            <el-header class = "layout-header border-b bg-white" :style = "{marginLeft : menuProps.collapse ? '64px' : '240px'}">
                <global-header></global-header>
            </el-header>
            <el-main class = "layout-main" :style = "{marginLeft : menuProps.collapse ? '64px' : '240px'}">
                <nav-panel></nav-panel>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>
<script>
    import {mapState,mapMutations} from 'vuex'
    import SideMenu from "@/components/menu/SideMenu";
    import GlobalHeader from "./GlobalHeader"
    import navPanel from './nav/NavPanel'

    export default {
        name: 'GlobalLayout',
        components: {
            SideMenu,GlobalHeader,navPanel
        },
        computed : {
            ...mapState({
                menuProps : ({app}) => app.menuProps
            })
        },
        data() {
            return {}
        },
        methods : {
            ...mapMutations({
                setLang : 'SET_LANG'
            })
        },
        mounted(){
            // 设置初始语言
            this.setLang(this.$i18n.locale)
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
            line-height : 50px;
            height : 50px !important;
            padding : 0 1rem;
        }
        &-main{
            padding: 0px;
            overflow: hidden;
        }
    }
</style>
