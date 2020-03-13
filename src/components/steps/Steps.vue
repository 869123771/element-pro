<!-- 步骤条 -->
<template>
  <div class="steps">
    <div class="steps-item" v-for="(item, index) in items" :key="index">
      <p :class="['steps-item-line', activeIndex === index + 1 ? 'active' : '']"></p>
      <p :class="['steps-item-num', activeIndex === index + 1 ? 'active' : '']" v-html = "item.html"></p>
      <p :class="['steps-item-text', activeIndex === index + 1 ? 'activeText' : '']">{{item.text}}</p>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  .steps {
    width: 100%;
    display: flex;
    height: 80px;
    &-item {
      width: 100%;
      height: 34px;
      padding-top: 15px;
      position: relative;
      // 分段线
      &-line {
        width: 100%;
        height: 4px;
        background: #ccc;
      }
      // 数字
      &-num {
        width: 34px;
        height: 34px;
        background: #ccc;
        border-radius: 50%;
        line-height: 34px;
        color: #fff;
        text-align: center;
        position: absolute;
        top: 0;
        left: calc(50% - 17px);
      }
      // 文字
      &-text {
        text-align: center;
        margin-top: 24px;
      }
      // 当前状态
      .active {
        background: #409EFF;
      }
      .activeText {
        color: #409EFF;
      }
    }
  }
</style>

<script>

export default {
  props: {
    // 步骤总数
    items: {
      type: Array,
      required: true
    },
    // 当前步骤
    activeIndex: {
      type: Number,
      default: 0,
      required: true
    }
  },

  data () {
    return {
    }
  }
}
</script>
