<template>
    <div class="sideMenu">
        <el-scrollbar>
        <el-menu
                class = "h-screen"
                unique-opened
                :router="true"
                :collapse="menuProps.collapse"
                :collapse-transition = "false"
                :default-active = "menuProps.activeName"
                :default-openeds = "menuProps.openNames"
        >
            <!-- :default-openeds = "menu.openNames"  -->
            <!--<el-menu-item class="sideMenu-title text-center" v-if="!menuProps.collapse" index = "">
                <span>LiveData</span>
            </el-menu-item>
            <Tooltip content="LiveData" placement="right" v-else>
                <MenuItem class="sideMenu-title-icon" index = "">
                    <i class="iconfont icon-livedata"></i>
                </MenuItem>
            </Tooltip>-->
            <nav-menu :nav-menus="permissionList"></nav-menu>
        </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import NavMenu from "./NavMenu";
    import {mapGetters, mapState} from 'vuex'

    export default {
        name: "SideMenu",
        components: {
            NavMenu
        },
        data() {
            return {};
        },
        computed: {
            ...mapState({
                menuProps : ({app}) => app.menuProps
            }),
            ...mapGetters([
                'permissionList',
            ])
        },
        watch: {}
    };
</script>
<style scoped lang="less">
    .sideMenu {
        &-title {
            line-height: 3.5rem;
            font-size: 24px;
            background: #fff;
            border-bottom: solid 1px #e6e6e6;
            height: 56px;
            cursor: pointer;
            &-icon {
                height: 56px;
                width: 64px;
                list-style: none;
                line-height: 56px;
                cursor: pointer;
                padding: 0 20px
            }
        }
        border-right: solid 1px #e6e6e6;
    }
</style>
<style scoped>
    .el-menu {
        border: none;
    }

    .el-menu--collapse >>> .menu-item-title {
        display: none;
    }

    >>> .el-submenu .el-menu-item {
        min-width: auto !important;
    }

    >>> .el-menu-item:focus,
    >>> .el-menu-item:hover,
    >>> .el-submenu__title:hover,
    >>> .el-submenu__title:focus {
        background-color: #f7f7f7;
    }

</style>
