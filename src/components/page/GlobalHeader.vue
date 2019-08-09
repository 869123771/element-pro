<template>
    <div>
        <div class="pr-3 inline-block">
            <level-bar></level-bar>
        </div>

        <div class="inline-block">
            <bread-crumb></bread-crumb>
            <nav-tag></nav-tag>
        </div>

        <div class="inline-block float-right">
            <div class="flex">
                <div class = "px-2">
                    <language @on-lang-change="setLang" :lang="lang"></language>
                </div>
                <avatar></avatar>
            </div>
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

    export default {
        name: 'GlobalHeader',
        components: {
            Avatar,
            LevelBar, BreadCrumb, NavTag, Language
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
