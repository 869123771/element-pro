<template>
    <div class = "flex justify-between items-center">
        <level-bar></level-bar>
        <bread-crumb></bread-crumb>
        <nav-tag></nav-tag>
        <avatar></avatar>
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
