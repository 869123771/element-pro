<template>
    <el-container
            class="layout"
            :class="layoutType"
    >
        <el-aside :width="menuProps.collapse ? '64px' : '240px'"
                  class="layout-aside"
                  :class="`layout-aside-${menuProps.theme}`">
            <side-menu></side-menu>
        </el-aside>

        <el-container
                class="layout-container"
                :class = "tabsFixType"
                :style="{marginLeft}"
        >
            <el-header class="layout-container-header border-b bg-white"
                       :class="`layout-container-header-${headProps.theme}`"
            >
                <global-header @open = "$refs.controls.open()"></global-header>
            </el-header>
            <el-main class="layout-container-main">
                <div
                        v-if="controlShow.navTag"
                        class = "layout-container-main-tabs"
                        :class = "tabsFixType ? `layout-container-main-${tabsFixType}` : ''"
                >
                    <nav-panel></nav-panel>
                </div>
               <div class = "layout-container-main-views">
                   <bar-wave v-show = "pageLoading"></bar-wave>
                   <route-view v-if="isRouterAlive"></route-view>
               </div>
            </el-main>
        </el-container>
        <controls ref="controls"></controls>
    </el-container>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'
    import SideMenu from "@/components/menu/SideMenu";
    import GlobalHeader from "./GlobalHeader"
    import navPanel from './nav/NavPanel'
    import Controls from './head/Controls'
    import {localRead} from '@/utils/modules/tools'
    import RouteView from "@/components/layouts/RouteView"
    import BarWave from "@/components/loading/BarWave";
    export default {
        name: 'GlobalLayout',
        components: {
            SideMenu,
            GlobalHeader,
            navPanel,
            Controls,
            RouteView,
            BarWave
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
                controlShow: ({app}) => app.controlShow,
                pageLoading : ({app}) => app.pageLoading
            }),
            layoutType() {
                let layoutType = ''
                let {fixHeader,fixTabs} = this.headProps
                let {fixMenu,collapse} = this.menuProps
                let {navTag} = this.controlShow
                if(collapse){
                    layoutType += ' layout-collapse '
                }
                if (fixHeader) {
                    if (fixMenu) {
                        layoutType += ' layout-header-menu-fix ';
                    } else {
                        layoutType += ' layout-header-fix ';
                    }
                } else {
                    if(fixMenu){
                        layoutType += ' layout-menu-fix ';
                    }
                }
                return layoutType
            },
            tabsFixType(){
                let tabsFixType = ''
                let {fixHeader,fixTabs} = this.headProps
                if(fixTabs){
                    tabsFixType = 'tabs-sticky'
                }
                if(fixTabs && fixHeader){
                    tabsFixType = 'tabs-fix'
                }
                return  tabsFixType
            },
            marginLeft() {
                let marginLeft
                let {collapse, fixMenu} = this.menuProps
                if (collapse) {
                    marginLeft = '64px'
                } else {
                    marginLeft = '240px'
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
                setShrinkMenu: 'SHRINK_MENU',
                setBreadCrumb: 'SET_BREADCRUMB',
                setReload: 'SET_RELOAD'
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
            window.onresize = () => {
                if (document.documentElement.clientWidth < 800) {
                    this.setShrinkMenu(true)
                    this.setBreadCrumb(false)
                    this.setReload(false)
                }
            }
            // 设置初始语言
            this.setLang(localRead('lang') || this.$i18n.locale)
        }
    }
</script>
<style scoped lang="less">
    .layout-collapse.layout-header-menu-fix{
        .layout-container{
            margin-left : 64px !important;
            &-header{
                left: 64px;
            }
            &-main{
                margin-left : 0px;
                &-tabs-fix{
                    left: 64px;
                }
            }
        }
    }
    .layout-collapse.layout-header-fix{
        .layout-container{
            &-header{
                left: 0px;
            }
        }
    }
    .layout-collapse.layout-menu-fix{
        .layout-container{
            margin-left: 64px !important;
        }
    }
    .layout {
        &-aside {
            box-shadow: 0px 1px 4px rgba(0, 21, 41, 0.08);
            /deep/ &-dark {
                background-color: #001529;
                box-shadow: 2px 0 6px rgba(0, 21, 41, .35);

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
                            i,span{
                                font-size: 14px;
                                transition: all ease-in-out .3s;
                            }
                            &:hover {
                                background-color: rgba(43,61,95,0.125);
                                box-shadow: inset -4.5rem 0 6.75rem -7rem #000;
                                i, span {
                                    color: #fff;
                                    font-size: 16px;
                                    transition: font-size ease-in-out .3s;
                                }
                                &::after{
                                    width: .55rem;
                                }
                            }
                            &::after{
                                transition: width .3s;
                                position: absolute;
                                top: 0;
                                left: 0;
                                content: '';
                                display: block;
                                background-color: #fff;
                                height: 100%;
                                width: .002%;
                            }
                        }
                    }

                    .el-menu-item {
                        i,span{
                            font-size: 14px;
                            transition: all ease-in-out .3s;
                        }
                        &:hover {
                            background-color: rgba(43,61,95,0.125);
                            box-shadow: inset -4.5rem 0 6.75rem -7rem #000;
                            i, span {
                                color: #fff !important;
                                font-size: 16px;
                            }
                            &::after{
                                width: .55rem;
                            }
                        }
                        &::after{
                            transition: width .3s;
                            position: absolute;
                            top: 0;
                            left: 0;
                            content: '';
                            display: block;
                            background-color: #fff;
                            height: 100%;
                            width: .002%;
                        }
                    }

                    .el-menu-item.is-active {
                        background-color: #3788ee;
                        color: #fff;
                        &:hover{
                            &::after{
                                background-color: #3788ee;
                            }
                        }
                    }
                }
            }

            &-white {
                background-color: #fff;
            }
        }
        &-container {
            min-height: 100vh;
            transition: all .2s ease-in-out;
            margin-left: 0px !important;
            &-header {
                height: inherit !important;
                padding: 0px;
                box-shadow: 0 1px 4px rgba(0,21,41,.08);
                transition: all .2s ease-in-out;
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
            }
            &-main {
                padding: 0px;
                background-color: #f0f2f5;
                overflow: visible;
                &-tabs{
                    padding-top: 0.75rem;
                }
            }
        }
        &-header{
            &-menu-fix {
                .layout-aside{
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom : 0;
                    z-index: 10;
                }
                .layout-container{
                    margin-left : 240px !important;
                    margin-top: 56px;
                    &-header{
                        position: fixed;
                        top: 0;
                        left: 240px;
                        right: 0;
                        z-index: 10;
                    }
                    &-main{
                        &-tabs{
                            /*height: 38px;
                            line-height: 50px;*/
                        }
                        &-tabs>&-views{
                            margin-top: 38px;
                        }
                        &-tabs-fix{
                            height: 48px;
                            line-height: 48px;
                            background-color: #f5f7f9;
                            position: fixed;
                            top: 56px;
                            left: 240px;
                            right: 0;
                            z-index: 10;
                            padding-top: 0;
                        }
                    }
                }
                .layout-container.tabs-fix{
                    .layout-container{
                        &-main{
                            &-views{
                                margin-top : calc(48px);
                            }
                        }
                    }
                }
            }
            &-fix {
                .layout-aside{
                    overflow: auto;
                    min-height: 100vh;
                    margin-top : 72px;
                }
                .layout-container{
                    margin-left: 0px !important;
                    &-header{
                        position: fixed;
                        z-index: 10;
                        right: 0;
                        left: 0;
                    }
                    &-main{
                        margin-top: 72px;
                    }
                }
            }
        }
        &-menu{
            &-fix{
                .layout-aside{
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom : 0;
                    z-index: 10;
                }
                .layout-container{
                    margin-left: 240px !important;
                    &-main{
                        /*margin-top: 30px;*/

                    }
                }
            }
        }
    }
    .layout,layout-menu-fix{
        .tabs-sticky{
            .layout-container-main-tabs-sticky{
                position: sticky;
                top: 0px;
                background-color: #f5f7f9;
                z-index: 1;
                padding: 0.5rem 0;
            }
        }
    }
</style>
