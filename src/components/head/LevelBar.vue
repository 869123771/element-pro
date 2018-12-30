<template>
    <div class = "levelbar">
        <div class = "d-flex align-items-center">
            <i class = "iconfont icon-shrink levelbar-shrink" :class="{barShrink}" @click = "shrink"></i>
            <bread-crumb></bread-crumb>
            <nav-tag></nav-tag>
        </div>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
import BreadCrumb from './BreadCrumb'
import NavTag from './NavTag'
    export default {
        name : 'Levelbar',
        components : {
            BreadCrumb,NavTag
        },
        data(){
            return {
                barShrink : false
            }
        },
        methods : {
            ...mapMutations([
                'shrinkMenu'
            ]),
            shrink(){
                this.barShrink = !this.barShrink
                this.shrinkMenu()
            }
        },
    }
</script>
<style scoped lang = "less">
    .levelbar{
        background-color: #f5f7fa;
        border-bottom: solid 1px #e6e6e6;
        &-shrink{
            height: 56px;
            width: 56px;
            text-align: center;
            line-height: 56px;
            font-size: 24px;
            cursor:pointer;
            display: inline-block;
            transition: all 0.6s ease 0s;
        }
        &-shrink:hover{
            /*background-color: #ecf5ff;*/
        }
        .barShrink{
            transform: rotate(90deg);
        }
    }
</style>
<style scoped>
    >>> .breadcrumb{
        margin-bottom: 0px;
        background-color: inherit;
    }
</style>
