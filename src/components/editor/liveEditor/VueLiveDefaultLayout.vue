<template functional>
  <div class="vue-live-container" style="display:flex; ">
    <Split style="height: auto">
      <SplitArea :size="60">
        <slot name="editor"></slot>
      </SplitArea>
      <SplitArea :size="40" class = "p-3 bg-gray-100">
        <slot name="preview"></slot>
      </SplitArea>
    </Split>
  </div>
</template>
<script>
  import Vue from 'vue'
  import VueSplit from 'vue-split-panel'
  Vue.use(VueSplit)
  export default {

  }
</script>
<style scoped lang = "less">
  .vue-live-container{

  }
</style>
