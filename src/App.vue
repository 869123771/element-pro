<template>
    <div id="app">
        <el-scrollbar class="h-full">
            <router-view/>
        </el-scrollbar>
    </div>
</template>
<script>
    import "@/assets/iconfont/iconfont.css";
    //import "font-awesome/less/font-awesome.less";
    import "tailwindcss/tailwind.css";
    import '@/assets/less/index.less'

    export default {
        name: "App",
    };
</script>
<style lang="less">

</style>
