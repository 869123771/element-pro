<template>
    <el-color-picker size="small"
                     class="theme-picker"
                     popper-class="theme-picker-dropdown"
                     v-model="theme"></el-color-picker>
</template>

<script>
    import theme from "@/utils/mixins/theme";

    export default {
        name: "ColorPicker",
        mixins: [theme],
        data () {
            return {
                chalk: ""
            };
        }
    };
</script>

<style>
    .theme-picker .el-color-picker__trigger {
        vertical-align: middle;
    }

    .theme-picker-dropdown .el-color-dropdown__link-btn {
        display: none;
    }
</style>
