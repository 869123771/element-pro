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
                    <template v-if = "controlShow.reload">
                        <i class = "el-icon-refresh-right cursor-pointer pr-2" @click="refresh"></i>
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
    import ColorPicker from "./head/ColorPicker";
    import Controls from './head/Controls'
    import navPanel from './nav/NavPanel'

    export default {
        name: 'GlobalHeader',
        inject: ['reload'],
        components: {
            Avatar,
            LevelBar, BreadCrumb, Language,
            ColorPicker,
            navPanel,
            Controls
        },
        computed: {
            ...mapState({
                menuProps: ({app}) => app.menuProps,
                lang: ({app}) => app.lang,
                controlShow: ({app}) => app.controlShow
            }),
        },
        data() {
            return {}
        },
        methods: {
            ...mapMutations({
                setLang: 'SET_LANG'
            }),
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