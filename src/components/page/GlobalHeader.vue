<template>
    <div class = "h-full flex items-center justify-between">
        <div class = "floal-left flex items-center self-stretch">
            <div class="pr-3">
                <level-bar></level-bar>
            </div>

            <div>
                <bread-crumb></bread-crumb>
                <nav-tag></nav-tag>
            </div>
        </div>

        <div class="float-right flex items-center self-stretch">
            <color-picker></color-picker>
            <div class = "px-2 flex items-center">
                <language @on-lang-change="setLang" :lang="lang"></language>
            </div>
             <avatar></avatar>
        </div>

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

    export default {
        name: 'GlobalHeader',
        components: {
            Avatar,
            LevelBar, BreadCrumb, NavTag, Language,
            ColorPicker
        },
        computed: {
            ...mapState({
                menuProps: ({app}) => app.menuProps,
                lang: ({app}) => app.lang
            }),
        },
        data() {
            return {}
        },
        methods: {
            ...mapMutations({
                setLang : 'SET_LANG'
            })
        }
    }
</script>
