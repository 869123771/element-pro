<template>
    <div class="navMenu">
        <template v-for="navMenu in navMenus">
            <Submenu v-if="navMenu.children.length" :index="navMenu.path">
                <template slot="title">
                    <i class="iconfont pr-1" :class="navMenu.icon"></i>
                    <span slot="title" class="menu-item-title">{{navMenu.title}}</span>
                </template>
                <nav-menu :navMenus="navMenu.children"></nav-menu>
            </Submenu>
            <Tooltip v-else-if="menuProps.collapse" :content="navMenu.title" placement="right">
                <MenuItem :index="navMenu.path">
                    <i class="iconfont pr-1" :class="navMenu.icon"></i>
                    <span class="menu-item-title">{{navMenu.title}}</span>
                </MenuItem>
            </Tooltip>
            <MenuItem v-else :index="navMenu.path">
                <i class="iconfont pr-1" :class="navMenu.icon"></i>
                <span class="menu-item-title">{{navMenu.title}}</span>
            </MenuItem>
        </template>
    </div>
</template>

<script>
    import {Submenu, MenuItem, Tooltip} from 'element-ui'
    import {mapGetters, mapState} from 'vuex'

    export default {
        name: 'NavMenu',
        components: {
            Submenu, MenuItem, Tooltip
        },
        props: {
            navMenus: {
                type: Array
            }
        },
        computed: {
            ...mapGetters([
                'menuProps'
            ])
        },
    }
</script>
<style scoped>

</style>
