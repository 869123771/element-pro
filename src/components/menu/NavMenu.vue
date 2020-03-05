<template>
    <div>
        <template v-for="navMenu in navMenus">
            <el-submenu
                    v-if="navMenu.children && navMenu.children.length" :index="navMenu.path">
                <template slot="title">
                    <i class="anticon pr-2" :class="'icon-' + navMenu.meta.icon"></i>
                    <span slot="title" class="menu-item-title">{{navMenu.meta.title}}</span>
                </template>
                <nav-menu :navMenus="navMenu.children"></nav-menu>
            </el-submenu>
            <el-menu-item v-else :index="navMenu.path" v-show = "!navMenu.hidden">
                <i class="anticon pr-2" :class="'icon-' + navMenu.meta.icon"></i>
                <span slot="title" class="menu-item-title">{{navMenu.meta.title}}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script>
    import {mapGetters, mapState} from 'vuex'

    export default {
        name: 'NavMenu',
        props: {
            navMenus: {
                type: Array
            }
        },
        computed: {
            ...mapState({
                menuProps : ({app}) => app.menuProps
            })
        },
        methods : {

        }
    }
</script>
<style scoped>

</style>
