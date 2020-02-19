<template>
    <div class="side-menu">
        <el-scrollbar>
            <el-menu
                    :class="`menu-${menuProps.theme}`"
                    :router="true"
                    :unique-opened="menuProps.uniqueOpened"
                    :collapse="menuProps.collapse"
                    :collapse-transition="true"
                    :default-active="menuProps.activeName"
                    :default-openeds="menuProps.openNames"

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
    /deep/ .el-menu {
        font-size: 14px;
        border-right : 0px;
         .el-submenu {
            .el-submenu__title {
                .anticon {
                    font-size: 20px;
                }

                > menu-item-title {
                    font-size: 15px;
                }
            }
        }

        /deep/ .el-menu-item {
            .anticon {
                font-size: 20px;
            }

            .menu-item-title {
                font-size: 14px;
            }
        }
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
