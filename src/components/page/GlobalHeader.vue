<template>
    <div class="head">
        <div class="h-full flex items-center justify-between head-top">
            <div class="flex items-center self-stretch">
                <div class="pr-3">
                    <template v-if="controlShow.shrinkBar">
                        <level-bar></level-bar>
                    </template>
                </div>
                <div>
                   <template v-if = "collect">
                       <el-tooltip content = "取消收藏" placement="top">
                           <i class = "fa fa-fw fa-star cursor-pointer pr-2" @click = "handleCollect"></i>
                       </el-tooltip>
                   </template>
                    <template v-else>
                        <el-tooltip content = "收藏" placement="top">
                            <i class = "fa fa-fw fa-star-o cursor-pointer pr-2" @click = "handleCollect"></i>
                        </el-tooltip>
                    </template>
                    <template v-if = "controlShow.reload">
                       <el-tooltip content = "刷新" placement="top">
                           <i class = "el-icon-refresh-right cursor-pointer pr-2" @click="refresh"></i>
                       </el-tooltip>
                    </template>
                </div>
                <div>
                    <template v-if="controlShow.breadcrumb">
                        <bread-crumb></bread-crumb>
                    </template>
                </div>
            </div>

            <div class="float-right flex items-center self-stretch">
                <template v-if="controlShow.themeColor">
                    <color-picker></color-picker>
                </template>
                <div class = "pr-2">
                    <message></message>
                </div>
                <div class="px-2 flex items-center">
                    <language @on-lang-change="setLang" :lang="lang"></language>
                </div>
                <avatar></avatar>
                <i class="el-icon-more rotate-90 cursor-pointer text-lg px-2" @click="$refs.controls.open()"></i>
            </div>
        </div>
        <div class = "head-bottom">
            <nav-panel v-if="controlShow.navTag"></nav-panel>
        </div>
        <controls ref="controls"></controls>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'
    import LevelBar from './head/LevelBar'
    import BreadCrumb from './head/BreadCrumb'
    import Avatar from "./head/Avatar";
    import Language from './head/Language'
    import Message from './head/Message'
    import ColorPicker from "./head/ColorPicker"
    import Controls from './head/Controls'
    import navPanel from './nav/NavPanel'

    export default {
        name: 'GlobalHeader',
        inject: ['reload'],
        components: {
            Avatar,
            LevelBar, BreadCrumb, Language,Message,
            ColorPicker,
            navPanel,
            Controls
        },
        computed: {
            ...mapState({
                menuProps: ({app}) => app.menuProps,
                lang: ({app}) => app.lang,
                controlShow: ({app}) => app.controlShow,
                collect : ({app}) => app.collect
            }),
        },
        data() {
            return {}
        },
        methods: {
            ...mapMutations({
                setLang: 'SET_LANG',
                setCollect : 'SET_COLLECT'
            }),
            handleCollect(){
                this.setCollect(!this.collect)
            },
            refresh(){
                this.reload()
            }
        }
    }
</script>
<style scoped lang="less">
    .head {
        &-top {
            border-bottom: 1px solid #e2e8f0;
            padding: 0 1rem;
        }
        &-bottom{
            background: #f0f2f5;
        }
    }
</style>