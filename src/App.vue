<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
    import "@/assets/anticon/iconfont.css";
    import "@/assets/iconfont/iconfont.css";
    import "font-awesome/less/font-awesome.less";
    import "animate.css/animate.min.css"
    import '@/assets/less/index.less'

    export default {
        name: "App",
    };
</script>
<style lang="less">
    #app{
        background : #f0f2f5;
    }
</style>
