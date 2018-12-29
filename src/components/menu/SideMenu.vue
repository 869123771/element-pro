<template>
  <div class="sideMenu h-100">
    <Row>
      <div class="sideMenu-title px-20" v-show = "!menuProps.collapse">
        <i class = "iconfont icon-livedata"></i><span>LiveData</span>
        </div>
      <div class = "sideMenu-title-icon px-20" v-show = "menuProps.collapse">
        <i class = "iconfont icon-livedata"></i>
      </div>
    </Row>
    <Menu 
      unique-opened
      :collapse-transition = "false"
      :default-active="menuProps.activeName" 
      :router = "true" 
      :collapse = "menuProps.collapse"
      >
      <!-- :default-openeds = "menu.openNames"  -->
      <nav-menu :nav-menus="menuProps.navMenus"></nav-menu>
    </Menu>
  </div>
</template>

<script>
import { Menu } from "element-ui";
import NavMenu from "./NavMenu";
import {mapGetters,mapState} from 'vuex'
export default {
  name: "SideMenu",
  components: {
    Menu,
    NavMenu
  },
  data() {
    return {
      
    };
  },
  computed:{
    ...mapGetters([
          'menuProps'
      ])
  },
  watch: {
    
  }
};
</script>
<style scoped lang = "less">
.sideMenu {
  &-title {
    line-height: 3.5rem;
    font-size: 24px;
    background: #ccc;
    height:56px;
    border-right: solid 1px #e6e6e6;
    cursor: pointer;
    &-icon{
      height:56px;
      width: 64px;
      border-right: solid 1px #e6e6e6;
      list-style: none;
      line-height: 56px;
      cursor: pointer;
    }
  }
  .px-20{
    padding: 0 20px
  }
}
</style>
<style scoped>
    .el-menu{
        height:100%;
    }
    .el-menu--collapse >>> span{
        display: none;
    }
</style>