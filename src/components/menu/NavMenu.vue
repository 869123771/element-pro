<template>
    <div>
        <template v-for="navMenu in navMenus">
            <Submenu v-if="navMenu.children && navMenu.children.length" :index="navMenu.path">
                <template slot="title">
                    <i class="anticon pr-1" :class="'icon-' + navMenu.meta.icon"></i>
                    <span slot="title" class="menu-item-title">{{navMenu.meta.title}}</span>
                </template>
                <nav-menu :navMenus="navMenu.children"></nav-menu>
            </Submenu>
            <MenuItem v-else :index="navMenu.path" v-show = "!navMenu.hidden">
                <i class="anticon pr-1" :class="'icon-' + navMenu.meta.icon"></i>
                <span slot="title" class="menu-item-title">{{navMenu.meta.title}}</span>
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
