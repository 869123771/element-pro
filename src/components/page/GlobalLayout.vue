<template>
    <el-container
            class="layout"
            :class = "layoutType"
    >
        <el-aside :width="menuProps.collapse ? '64px' : '240px'"
                  class="layout-aside"
                  :class="`layout-aside-${menuProps.theme} layout-aside-${menuProps.fixMenu ? 'fix' : 'stick'}`">
            <side-menu></side-menu>
        </el-aside>
        <el-container
                :class = "headProps.fixHeader?'layout-container-head-fix':''"
        >
            <el-header class="layout-header border-b bg-white"
                       :class="`layout-header-${headProps.theme} ${layoutHeadType}`"
                       :style="{marginLeft}"
            >
                <global-header></global-header>
            </el-header>
            <el-main class="layout-main"
                     :style="{marginLeft}">
                <router-view v-if="isRouterAlive"></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>
<script>
    import {mapState, mapMutations} from 'vuex'
    import SideMenu from "@/components/menu/SideMenu";
    import GlobalHeader from "./GlobalHeader"
    import {localRead} from '@/utils/modules/tools'

    export default {
        name: 'GlobalLayout',
        components: {
            SideMenu, GlobalHeader,
        },
        provide() {
            return {
                reload: this.reload
            }
        },
        computed: {
            ...mapState({
                menuProps: ({app}) => app.menuProps,
                headProps: ({app}) => app.headProps,
                controlShow: ({app}) => app.controlShow
            }),
            layoutType(){
                let layoutType
                let {fixHeader} = this.headProps
                let {fixMenu} = this.menuProps
                let {navTag} = this.controlShow
                if(fixHeader){
                    if(fixMenu){
                        layoutType = 'layout-head-menu-fix';
                    }else{
                        layoutType = 'layout-head-fix';
                    }
                }else{
                    layoutType = 'layout-menu-fix';
                }
                return layoutType
            },
            layoutHeadType(){
                let layoutHeadType
                let {fixHeader} = this.headProps
                let {navTag} = this.controlShow
                if(fixHeader){
                    if(navTag){
                        layoutHeadType = 'layout-header-nav-fix'
                    }else{
                        layoutHeadType = 'layout-header-fix'
                    }
                }else{
                    layoutHeadType = 'layout-header-stick'
                }
                return layoutHeadType
            },
            marginLeft(){
                let marginLeft
                let {collapse,fixMenu} = this.menuProps
                if(fixMenu){
                    if(collapse){
                        marginLeft = '64px'
                    }else{
                        marginLeft = '240px'
                    }
                }else{
                    marginLeft = '0px'
                }
                return marginLeft
            }
        },
        data() {
            return {
                isRouterAlive: true
            }
        },
        watch: {
            '$route': {
                handler(to, from) {
                    this.handleNav(to.matched)
                },
                immediate: true
            }
        },
        methods: {
            ...mapMutations({
                setLang: 'SET_LANG',
                setActiveName: 'ACTIVE_NAME',
                setOpenNames: 'OPEN_NAMES',
                setActiveNavTag: 'ACTIVE_NAV_TAG',
                setActiveBreadCream: 'ACTIVE_BREAD_CREAM',
            }),
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => {
                    this.isRouterAlive = true;
                })
            },
            handleNav(matched) {
                if (matched.length) {
                    const {path, parent, name, meta: {title, icon}} = matched[matched.length - 1]
                    const result = this.findOpenNames(parent)
                    const activeName = path
                    const openNames = result.map(item => item.path)
                    result.unshift({path, name, title, icon})
                    this.setActiveName(activeName)
                    this.setOpenNames(openNames)
                    this.setActiveNavTag({path, name, title, icon})
                    this.setActiveBreadCream(result.reverse())

                }
            },
            findOpenNames(obj, resultList = []) {
                if (obj && obj.constructor === Object) {
                    let {path, name, meta: {title, icon}, parent} = obj
                    resultList.push({path, name, title, icon})
                    this.findOpenNames(parent, resultList)
                }
                return resultList.filter(item => Boolean(item.path))
            }
        },
        mounted() {
            // 设置初始语言
            this.setLang(localRead('lang') || this.$i18n.locale)
        }
    }
</script>
<style scoped lang="less">
    .layout-head-fix{
        height: 100%;
        .layout-aside-stick{
            margin-top: 106px;
        }
    }
    .layout {
        &-aside {
            &-fix{
                position: fixed;
                bottom: 0;
                top: 0;
                left: 0;
                overflow: auto;
                min-height: 100vh;
            }

            /deep/ &-dark {
                background-color: #001529;

                .el-menu {
                    background-color: #001529;
                    color: #b3b3b3;
                    border: none;

                    .el-submenu__title,
                    .el-menu-item {
                        color: #b3b3b3;
                    }

                    .el-submenu {
                        .el-menu {
                            background-color: #000810;
                        }
                        &__title {
                            &:hover {
                                i, span {
                                    color: #fff !important;
                                }
                            }

                            background: none;
                        }

                    }

                    .el-menu-item {
                        &:hover {
                            color: #fff !important;
                            background: none;
                        }
                    }

                    .el-menu-item.is-active {
                        background-color: #3788ee;
                        color: #fff;
                    }
                }
            }

            &-white {
                background-color: #fff;
            }
        }
        &-container-head-fix{
            .layout-main{
                margin-top : 95px;
            }
        }
        &-header {
            padding: 0px;

            /deep/ &-dark {
                background-color: #001529;

                .level-bar, .collect, .refresh, .message, .avatar, .control-btn {
                    &:hover {
                        background-color: hsla(0, 0%, 100%, .05);
                    }

                    color: #fff;
                }

                .language {
                    /deep/ .el-menu--horizontal > .el-submenu .el-submenu__title {
                        background-color: #001529;

                        &:hover {
                            background-color: #001529;
                        }

                        color: #fff;
                    }
                }
            }

            /deep/ &-white {
                .level-bar, .collect, .refresh, .message, .avatar, .control-btn {
                    &:hover {
                        background-color: #f0f2f5;
                    }

                    color: black;
                }

                .language {
                    /deep/ .el-menu--horizontal > .el-submenu .el-submenu__title {
                        &:hover {
                            background-color: #f0f2f5;
                        }

                        color: black;
                    }
                }
            }

            /deep/ &-blue {
                background: linear-gradient(90deg, #1d42ab, #2173dc, #1e93ff);

                .level-bar, .collect, .refresh, .message, .avatar, .control-btn {
                    &:hover {
                        background-color: hsla(0, 0%, 100%, .05);
                    }

                    color: #fff;
                }

                .language {
                    /deep/ .el-menu--horizontal > .el-submenu .el-submenu__title {
                        background-color: #218fea;

                        &:hover {
                            background-color: #358ed8;
                        }

                        color: #fff;

                        i {
                            color: #fff;
                        }
                    }
                }
            }
            &-nav-fix,&-fix{
                position: fixed;
                top : 0;
                left: 0;
                right: 0;
                z-index: 10;
            }
            &-nav-fix{
                height: 95px !important;
            }
            &-stick{
                height: 90px !important;
            }
            &-fix{
                height: 65px !important;
            }
        }

        &-main {
            padding: 0px;
        }
    }
</style>
