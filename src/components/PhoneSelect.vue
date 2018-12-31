<template>
  <div class="phoneSelect">
    <Row>
      <Select size="large" value="+86">
        <Option
          :value="item.number"
          :label="item.number"
          v-for="(item,index) in optionList"
          :key="index"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>{{item.country}}</div>
            <div class="ml-5">{{item.number}}</div>
          </div>
        </Option>
      </Select>
      <FormItem prop="phoneNumber">
        <Input v-model="phoneSelectProps.phoneNumber" size="large" placeholder="手机号">
          <Icon type="md-phone-portrait" slot="prefix"/>
        </Input>
      </FormItem>
    </Row>
  </div>
</template>

<script>
export default {
  name: "phoneSelect",
  props: {
    phoneSelectProps: {
      type: Object
    }
  },
  data() {
    return {
      optionList: [
        { country: "中国大陆", number: "+86" },
        { country: "美国", number: "+1" },
        { country: "香港", number: "+852" },
        { country: "日本", number: "+81" },
        { country: "台湾", number: "+886" },
        { country: "英国", number: "+44" },
        { country: "韩国", number: "+82" },
        { country: "俄罗斯", number: "+7" },
        { country: "意大利", number: "+39" },
        { country: "新加坡", number: "+65" },
        { country: "菲律宾", number: "+63" },
        { country: "马来西亚", number: "+60" },
        { country: "新西兰", number: "+64" },
        { country: "西班牙", number: "+34" },
        { country: "津巴布韦", number: "+263" },
        { country: "埃及", number: "+20" },
        { country: "巴基斯坦", number: "+92" },
        { country: "孟加拉国", number: "+880" }
      ]
    };
  },
  computed: {}
};
</script>

<style lang="less">
.phoneSelect {
  .ivu-select {
    position: absolute;
    z-index: 1000;
    width: 80px;
    left: 32px;
  }
  .ivu-select-selection {
    border: none !important;
    background-color: transparent;
  }
  .ivu-input {
    padding-left: 112px;
  }
  .ivu-select-visible .ivu-select-selection {
    box-shadow: none;
  }
  .ivu-select .ivu-select-dropdown {
    width: max-content;
    left: -32px !important;
  }
}
</style>
