<template>
    <div class = "levelbar">
        <div class = "d-flex align-items-center">
            <i class = "iconfont icon-shrink levelbar-shrink" :class="{barShrink}" @click = "shrink"></i>
            <bread-crumb></bread-crumb>
            <nav-tag></nav-tag>
            <Dropdown class = "levelbar-user">
                <a href="javascript:void(0)">
                    13631594090
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem>退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>
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
        background-color: #f7f7f7;
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
        &-user{
            position: absolute;
            right: 0;
            padding: 1rem;
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
