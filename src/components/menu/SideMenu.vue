<template>
    <div class="side-menu">
        <el-scrollbar>
            <el-menu
                    :class="`menu-${menuProps.theme}`"
                    :unique-opened="menuProps.uniqueOpened"
                    :collapse="menuProps.collapse"
                    :collapse-transition="true"
                    :default-active="menuProps.activeName"
                    :default-openeds="menuProps.openNames"
                    @open = "open"
                    @select = "select"
            >
                <nav-menu :nav-menus="permissionList"></nav-menu>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import NavMenu from "./NavMenu";
    import {mapGetters, mapState,mapMutations} from 'vuex'
    import {isEmpty} from '30-seconds-of-code'

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
        watch: {},
        methods : {
            ...mapMutations({
                openNames : 'OPEN_NAMES',
            }),
            open(path,indexPath){
                this.openNames(indexPath)
            },
            findItem(data,path){
                for(const item of data){
                    let {children,meta} = item
                    if(children && children.length){
                        let result = this.findItem(children,path)                   //这里一定要return 不然是undefined
                        if(result !== undefined){
                            return result;
                        }
                    }else{
                        if(path === item.path){
                            return item;
                        }
                    }
                }
            },
            select(path,indexPath){
                let result = this.findItem(this.permissionList,path)
                let {meta:{internalOrExternal} = {}} = result || {}
                if(internalOrExternal){                                     //外部打开
                    this.$router.push(indexPath.join('/'))
                }else{
                    this.$router.push(path)
                }
            }
        }
    };
</script>
<style scoped lang="less">
    .el-menu{
        border-right : none;
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

</style>
