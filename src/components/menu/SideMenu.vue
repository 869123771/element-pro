<template>
  <div class="sideMenu h-100">
    <Row>
      <div class="text-center sideMenu-title">LiveData</div>
    </Row>
    <Menu :default-active="menu.activeName" :router = "true" :collapse = "menu.collapse">
      <!-- :default-openeds = "menu.openNames"  -->
      <nav-menu :nav-menus="menu.navMenus"></nav-menu>
    </Menu>
  </div>
</template>

<script>
import { Menu } from "element-ui";
import NavMenu from "./NavMenu";
export default {
  name: "SideMenu",
  components: {
    Menu,
    NavMenu
  },
  data() {
    return {
      menu: this.menuProps
    };
  },
  props: {
    menuProps: {
      type: Object
    }
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
  }
}
</style>
<style scoped>
    .el-menu{
        height:100%;
    }
</style>