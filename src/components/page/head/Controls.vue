<template>
    <!--<drag-drawer v-model="drawer.show"
                 :draggable="drawer.draggable"
                 :title="drawer.title"
                 :width.sync="drawer.width"
                 :direction="drawer.direction"
                 :scrollable="true"
    >

        <el-form label-width = "100px">
            <el-form-item label = "显示主题色">
                <el-switch v-model="controlShow.themeColor" @change="setThemeColor"></el-switch>
            </el-form-item>
            <el-form-item label = "显示收缩条">
                <el-switch v-model="controlShow.shrinkBar" @change="setShrinkBar"></el-switch>
            </el-form-item>
        </el-form>
        <div class="dialog-footer p-2 w-full" v-show="drawer.showFooter">
            <div class="flex justify-end">
                <popover-confirm @confirm="popoverConfirm" class="mx-2">
                    <div slot="popover-title">确定要关闭吗</div>
                    <div slot="popover-content">
                        <el-button plain>取消</el-button>
                    </div>
                </popover-confirm>
                <el-button type="primary" @click="popoverConfirm">提交</el-button>
            </div>
        </div>
    </drag-drawer>-->
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