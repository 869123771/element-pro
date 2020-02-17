<template>
    <slide-out
            :visible.sync="drawer.show"
            :dock="drawer.placement"
            :title="drawer.title"
            :size="drawer.width"
            allow-resize
    >
        <el-divider>主题风格设置</el-divider>
        <el-row>
            <div class="flex">
                <template v-for="({content,src,current,type},index) in theme.navTheme">
                    <div class="px-3 flex flex-col items-center" @click="navThemeChange(index,type)">
                        <el-tooltip :content="content" placement="top">
                            <img :src="src" class="cursor-pointer"/>
                        </el-tooltip>
                        <span class="block h-2 w-2 rounded" :class="current?'bg-green-500':''"></span>
                    </div>
                </template>
            </div>
        </el-row>
        <el-row class="mt-3">
            <div class="flex">
                <template v-for="({content,src,current,type},index) in theme.headerTheme">
                    <div class="px-3 flex flex-col items-center" @click="headThemeChange(index,type)">
                        <el-tooltip :content="content" placement="top">
                            <img :src="src" class="cursor-pointer"/>
                        </el-tooltip>
                        <span class="block h-2 w-2 rounded" :class="current?'bg-green-500':''"></span>
                    </div>
                </template>
            </div>
        </el-row>
        <el-divider>导航设置</el-divider>
        <el-row class="px-3">
            <div class="flex justify-between">
                <div>显示主题色</div>
                <div>
                    <el-switch v-model="controlShow.themeColor" @change="setThemeColor" size="mini"></el-switch>
                </div>
            </div>
        </el-row>
        <el-row class="px-3 mt-4">
            <div class="flex justify-between">
                <div>国定侧栏</div>
                <div>
                    <el-switch v-model="menuProps.fixMenu" @change="setFixMenu" size="mini"></el-switch>
                </div>
            </div>
        </el-row>
        <el-row class="px-3 mt-4">
            <div class="flex justify-between">
                <div>国定顶栏</div>
                <div>
                    <el-switch v-model="headProps.fixHeader" @change="setFixHeader" size="mini"></el-switch>
                </div>
            </div>
        </el-row>
        <el-row class="px-3 mt-4">
            <div class="flex justify-between">
                <div>侧边栏开启手风琴模式</div>
                <div>
                    <el-switch v-model="menuProps.uniqueOpened" @change="setOpenUnique"></el-switch>
                </div>
            </div>
        </el-row>
        <el-row class="px-3 mt-4">
            <div class="flex justify-between">
                <div>显示折叠侧边栏按钮</div>
                <div>
                    <el-switch v-model="controlShow.shrinkBar" @change="setShrinkBar"></el-switch>
                </div>
            </div>
        </el-row>
        <el-row class="px-3 mt-4">
            <div class="flex justify-between">
                <div>显示重载页面按钮</div>
                <div>
                    <el-switch v-model="controlShow.reload" @change="setReload"></el-switch>
                </div>
            </div>
        </el-row>
        <el-row class="px-3 mt-4">
            <div class="flex justify-between">
                <div>
                    <span>显示全局面包屑导航 </span>
                    <span class = "el-icon-warning-outline"></span>
                </div>
                <div>
                    <el-switch v-model="controlShow.breadcrumb" @change="setBreadcrumb"></el-switch>
                </div>
            </div>
        </el-row>
        <el-divider>其它设置</el-divider>
        <el-row class="px-3 mt-4">
            <div class="flex justify-between">
                <div>开启多页签</div>
                <div>
                    <el-switch v-model="controlShow.navTag" @change="setNavTag"></el-switch>
                </div>
            </div>
        </el-row>
        <el-row class="px-3 mt-4">
            <div class="flex justify-between">
                <div>
                    <span>多页签显示图标 </span>
                   <el-tooltip content="需开启多页签" placement="top">
                       <span class = "el-icon-warning-outline"></span>
                   </el-tooltip>
                </div>
                <div>
                    <el-switch v-model="controlShow.navTagShowIcon" @change="setNavTagShowIcon" :disabled="controlShow.navTag?false:true"></el-switch>
                </div>
            </div>
        </el-row>
    </slide-out>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import DragDrawer from '@/components/dragDrawer'
    import PopoverConfirm from '@/components/popoverConfirm'
    import {localSave, localRead} from '@/utils/modules/tools'

    export default {
        name: "Controls",
        components: {
            DragDrawer,
            PopoverConfirm,
        },
        data() {
            return {
                drawer: {
                    show: false,
                    direction: 'right',
                    title: '',
                    width: '300px'
                },
                theme: {
                    navDark: require('@/assets/nav-theme-dark.svg'),
                    navLight: require('@/assets/nav-theme-light.svg'),
                    headerLight: require('@/assets/header-theme-light.svg'),
                    headerDark: require('@/assets/header-theme-dark.svg'),
                    headerPrimary: require('@/assets/header-theme-primary.svg'),
                    navTheme: [
                        {
                            content: '暗色侧边栏', src: require('@/assets/nav-theme-dark.svg'),
                            current: localRead('menuTheme') === 'dark' || false,
                            type: 'dark'
                        },
                        {
                            content: '亮色侧边栏', src: require('@/assets/nav-theme-light.svg'),
                            current: localRead('menuTheme') === 'white' || false,
                            type: 'white'
                        }
                    ],
                    headerTheme: [
                        {
                            content: '亮色顶栏', src: require('@/assets/header-theme-light.svg'),
                            current: localRead('headerTheme') === 'white' || false,
                            type: 'white'
                        },
                        {
                            content: '暗色顶栏', src: require('@/assets/header-theme-dark.svg'),
                            current: localRead('headerTheme') === 'dark' || false,
                            type: 'dark'
                        },
                        {
                            content: '主色顶栏', src: require('@/assets/header-theme-primary.svg'),
                            current: localRead('headerTheme') === 'blue' || false,
                            type: 'blue'
                        }
                    ]
                },
                form: {
                    theme: 'gray'
                },
                select: {
                    menuTheme: [
                        {value: 'white', label: '白色', color: 'rgba(0, 0, 0, 0.1)'},
                        {value: 'gray', label: '灰色', color: '#545c64'},
                    ]
                }
            }
        },
        computed: {
            ...mapState({
                controlShow: ({app}) => app.controlShow,
                menuProps: ({app}) => app.menuProps,
                headProps : ({app}) => app.headProps,
            })
        },
        methods: {
            ...mapMutations({
                setThemeColor: 'SET_THEME_COLOR_SHOW',
                setFixMenu : 'SET_FIX_MENU',
                setFixHeader : 'SET_FIX_HEADER',
                setShrinkBar: 'SET_SHRINK_BAR',
                setBreadcrumb: 'SET_BREADCRUMB',
                setNavTag: 'SET_NAV_TAG',
                setNavTagShowIcon : 'SET_NAV_TAG_SHOW_ICON',
                setMenuTheme: 'SET_MENU_THEME',
                setHeaderTheme: 'SET_HEADER_THEME',
                setOpenUnique : 'OPEN_UNIQUE',
                setReload : 'SET_RELOAD'
            }),
            navThemeChange(index, menuTheme) {
                let {navTheme} = this.theme
                navTheme.forEach((v, i) => {
                    if (i === index) {
                        v.current = true
                    } else {
                        v.current = false
                    }
                })
                this.setMenuTheme(menuTheme)
            },
            headThemeChange(index, theme) {
                let {headerTheme} = this.theme
                headerTheme.forEach((v, i) => {
                    if (i === index) {
                        v.current = true
                    } else {
                        v.current = false
                    }
                })
                this.setHeaderTheme(theme)
            },
            open() {
                this.drawer = {
                    ...this.drawer,
                    title: '控制',
                    show: true
                }
            },
            popoverConfirm() {
                this.drawer = {
                    ...this.drawer,
                    show: false
                }
                this.popover = {
                    ...this.popover,
                    drawerCancel: false
                }
            },
        }
    }
</script>

<style scoped>
    /deep/ .vue-slideout-content{
        color : rgb(0,0,0)
    }
</style>