<template>
    <div class = "h-full flex items-center justify-between">
        <div class = "floal-left flex items-center self-stretch">
            <div class="pr-3">
                <template v-if="controlShow.shrinkBar">
                    <level-bar></level-bar>
                </template>
            </div>

            <div>
                <bread-crumb></bread-crumb>
                <nav-tag></nav-tag>
            </div>
        </div>

        <div class="float-right flex items-center self-stretch">
            <template v-if="controlShow.themeColor">
                <color-picker></color-picker>
            </template>
            <div class = "px-2 flex items-center">
                <language @on-lang-change="setLang" :lang="lang"></language>
            </div>
             <avatar></avatar>
             <i class = "el-icon-more rotate-90 cursor-pointer text-lg px-2" @click="$refs.controls.open()"></i>
        </div>
        <controls ref = "controls"></controls>
    </div>
</template>
<script>
    import {mapState,mapMutations} from 'vuex'
    import LevelBar from './head/LevelBar'
    import BreadCrumb from './head/BreadCrumb'
    import NavTag from './head/NavTag'
    import Avatar from "./head/Avatar";
    import Language from './head/Language'
    import ColorPicker from "./head/ColorPicker";
    import Controls from './head/Controls'

    export default {
        name: 'GlobalHeader',
        components: {
            Avatar,
            LevelBar, BreadCrumb, NavTag, Language,
            ColorPicker,
            Controls
        },
        computed: {
            ...mapState({
                menuProps: ({app}) => app.menuProps,
                lang: ({app}) => app.lang,
                controlShow : ({app}) => app.controlShow
            }),
        },
        data() {
            return {

            }
        },
        methods: {
            ...mapMutations({
                setLang : 'SET_LANG'
            })
        }
    }
</script>
