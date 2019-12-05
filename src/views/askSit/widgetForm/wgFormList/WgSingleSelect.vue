<template>
   <wg-container v-on="$listeners">
      <template v-slot:header>
         <div>请选择一个选项</div>
      </template>
      <template v-slot:body>
         <el-radio-group v-model = "item.value">
            <template v-for = "{value,label} in item.list">
               <div class = "my-2">
                  <el-radio :label = "value">{{label}}</el-radio>
               </div>
            </template>
         </el-radio-group>
         <div class = "flex mt-3">
            <div class = "add-item">
               <span class = "el-icon-plus pr-2"></span>
               <span>添加单个选项</span>
            </div>
            <div class = "add-item">
               <span class = "el-icon-plus pr-2"></span>
               <span>批量添加选项</span>
            </div>
         </div>
      </template>
   </wg-container>
</template>

<script>
   import WgContainer from './WgContainer'

    export default {
        name: "WgPhone",
        props: {
            item: {
                type: Object,
                required: true
            }
        },
        components : {
            WgContainer
        }
    }
</script>

<style scoped lang = "less">
   .add-item{
      color : #0d84e6;
      cursor: pointer;
      padding: 4px 12px;
   }
   .add-item:hover{
      background-color: #f4f4f4;
      border-radius: 2px;
   }
</style>