<template>
  <div id="layout">
    <!-- <Row>
      <Col :xs="{span : 4}" :sm="{span : 4}" class="left">
        <side-menu
          accordion
          ref="sideMenu"
          :active-name="$route.name"
          :collapsed="menu.collapsed"
          @on-select="turnToPage"
          :menu-list="menuList"
        >
        </side-menu>
      </Col>
      <Col :xs="{span : 20}" :sm="{span:20}" class="right">
        <Row class="py-2 px-3 headBg">
          <Head></Head>
        </Row>
        <Row class="px-3">
          <router-view></router-view>
        </Row>
      </Col>
    </Row> -->
  </div>
</template>
<script>
/* import slideMenu from "@/components/side-menu";
import Head from "./common/head"; */
import {mapGetters} from 'vuex'
export default {
  name: "layout",
  data() {
    return {
      menu: {
        collapsed: false
      }
    };
  },
 /*  components: {
    slideMenu,
    Head
  },
  computed: {
      ...mapGetters([
          'menuList'
      ])
  }, */
  methods: {
   
  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
.left {
  width: 15%;
}
.right {
  width: 85%;
}
.headBg {
  background-color: #fff;
}
</style>
