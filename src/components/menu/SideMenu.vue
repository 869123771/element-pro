<template>
  <div class="sideMenu h-100">
    <Row>
      <div class="sideMenu-title px-20" v-if = "!menuProps.collapse">
        <i class = "iconfont icon-livedata"></i><span>LiveData</span>
        </div>
      <div class = "sideMenu-title-icon px-20" v-else>
        <i class = "iconfont icon-livedata"></i>
      </div>
    </Row>
    <Menu 
      unique-opened
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
    &-icon{
      height:56px;
      width: 64px;
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
    >>> .el-menu--collapse span{
        display: none;
    }
</style>