<template>
    <div class = "navMenu">
        <template v-for = "navMenu in navMenus">
            <Submenu v-if = "navMenu.children.length" :index = "navMenu.path">
                <template slot = "title">
                    <i class = "iconfont pr-1" :class = "navMenu.icon"></i>
                    <span slot = "title">{{navMenu.title}}</span>
                </template>
                <nav-menu :navMenus = "navMenu.children"></nav-menu>
            </Submenu>
            <MenuItem v-else :index = "navMenu.path">
                <i class = "iconfont pr-1" :class = "navMenu.icon"></i>
                <span>{{navMenu.title}}</span>
            </MenuItem>
        </template>
    </div>
</template>

<script>
    import {Submenu,MenuItem,Tooltip} from 'element-ui'
    export default {
        name : 'NavMenu',
        components : {
            Submenu,MenuItem,Tooltip
        },
        props : {
            navMenus : {
                type : Array
            }
        }
    }
</script>
<style scoped>

</style>