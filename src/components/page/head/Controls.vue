<template>
    <slide-out
            :visible.sync="drawer.show"
            :dock="drawer.placement"
            :title="drawer.title"
            :size="drawer.width"
            :close-on-mask-click="false"
            allow-resize
    >

        <el-form label-width = "100px">
            <el-form-item label = "显示主题色">
                <el-switch v-model="controlShow.themeColor" @change="setThemeColor"></el-switch>
            </el-form-item>
            <el-form-item label = "显示收缩条">
                <el-switch v-model="controlShow.shrinkBar" @change="setShrinkBar"></el-switch>
            </el-form-item>
            <el-form-item label = "显示面包屑">
                <el-switch v-model="controlShow.breadcrumb" @change="setBreadcrumb"></el-switch>
            </el-form-item>
            <el-form-item label = "显示导航条">
                <el-switch v-model="controlShow.navTag" @change="setNavTag"></el-switch>
            </el-form-item>
        </el-form>
       <!-- <div slot="footer">{{text.footer}}</div>-->
    </slide-out>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
    import DragDrawer from '@/components/dragDrawer'
    import PopoverConfirm from '@/components/popoverConfirm'

    export default {
        name: "Controls",
        components: {
            DragDrawer,
            PopoverConfirm,
        },
        data(){
            return {
                drawer: {
                    show: false,
                    direction: 'right',
                    title : '',
                    width : '400px'
                },
            }
        },
        computed : {
            ...mapState({
                controlShow : ({app}) => app.controlShow,
            })
        },
        methods : {
            ...mapMutations({
                setThemeColor : 'SET_THEME_COLOR_SHOW',
                setShrinkBar : 'SET_SHRINK_BAR',
                setBreadcrumb : 'SET_BREADCRUMB',
                setNavTag : 'SET_NAV_TAG',
            }),
            open(){
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

</style>