<template>
    <div>
        <div class = "pr-3 inline-block">
            <level-bar></level-bar>
        </div>

        <div class = "inline-block">
            <bread-crumb></bread-crumb>
            <nav-tag></nav-tag>
        </div>
            <div class = "inline-block float-right">
                <avatar></avatar>
            </div>

    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import LevelBar from  './head/LevelBar'
    import BreadCrumb from './head/BreadCrumb'
    import NavTag from './head/NavTag'
    import Avatar from "./head/Avatar";
    export default {
        name : 'GlobalHeader',
        components : {
            Avatar,
            LevelBar,BreadCrumb,NavTag
        },
        computed : {
            ...mapState({
                menuProps : ({app}) => app.menuProps
            })
        },
        data(){
            return {

            }
        }
    }
</script>
