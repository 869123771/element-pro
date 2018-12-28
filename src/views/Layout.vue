<template>
  <div class="layout h-100">
      <div class="layout-sidebar" :style = "layout.sidebarWidth">
        <side-menu
          ref="sideMenu"
          
        >
        </side-menu>
      </div>
      <div class="layout-main" :style = "layout.mainWidth">
        <Row class="">
            <level-bar></level-bar>
        </Row>
        <Row class="px-3">
          <router-view></router-view>
        </Row>
      </div>
  </div>
</template>
<script>
import SideMenu from "@/components/menu/SideMenu";
import LevelBar from "@/components/head/LevelBar"
import {mapGetters,mapState} from 'vuex'
export default {
  name: "layout",
  data() {
    return {
        
    };
  },
   components: {
    SideMenu,LevelBar
  },
  computed: {
      ...mapGetters([
        'layout'
      ])
  },
  watch : {
    
  },
  methods: {
    
  },
  created() {},
  mounted() {
    debugger;
  }
};
</script>
<style scoped lang = "less">
.layout{
  &-sidebar{
    /* width: 12%; */
    float: left;
    transition : width 0.28 ease-out;
    position : fixed;
    height:100%;
  }
  &-main{
    /* margin-left: 12%;
    width: 88%; */
  }
}
.headBg {
  background-color: #fff;
}
</style>
