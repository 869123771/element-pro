<template>
    <div class="sideMenu">
        <el-scrollbar>
            <el-menu
                    class="h-screen"
                    :router="true"
                    :unique-opened = "menuProps.uniqueOpened"
                    :collapse="menuProps.collapse"
                    :collapse-transition="false"
                    :default-active="menuProps.activeName"
                    :default-openeds="menuProps.openNames"
                    :background-color="menuProps.theme[menuProps.theme.default].backgroundColor"
                    :text-color="menuProps.theme[menuProps.theme.default].textColor"
                    :active-text-color="menuProps.theme[menuProps.theme.default].activeTextColor"
            >
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
                menuProps: ({app}) => app.menuProps
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
<style scoped lang="less">
    .el-menu {
        border: none;
    }

    /deep/ .el-menu--collapse {
        .menu-item-title {
            display: none;
        }
        .el-menu-item .el-submenu__icon-arrow,
        .el-submenu .el-submenu__title .el-submenu__icon-arrow {
            display: none;
        }
    }

    /deep/ .el-submenu .el-menu-item {
        min-width: auto !important;
    }

</style>
