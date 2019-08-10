<template>
    <el-form>
       <template v-for = "item in detail.options">
           <el-form-item :label = "item.label">{{detail.data[item.prop]}}</el-form-item>
       </template>
    </el-form>
</template>

<script>
    export default {
        name: "Detail",
        props : {
            detail : {
                type : Object
            }
        },
        data(){
            return {

            }
        }
    }
</script>

<style scoped>

</style>