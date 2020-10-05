<template functional>
  <div class="vue-live-container" style="display:flex; ">
    <Split style="height: auto">
      <SplitArea :size="50">
        <slot name="editor"></slot>
      </SplitArea>
      <SplitArea :size="50" class = "p-3 bg-gray-100">
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
      height : 400px;
      /deep/.prism-editor-wrapper{
        background: #2d2d2d;
        color: #ccc;
        /*you must provide font-family font-size line-height. Example*/
        font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
        font-size: 14px;
        line-height: 1.5;
        padding: 5px;
      }
  }
</style>
