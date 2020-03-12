<template>
    <iframe :id="id" :src="url" frameborder="0" width="100%" height="800px" scrolling="auto"></iframe>
</template>

<script>
    import RouteView from './RouteView'
    import {mapState,mapMutations} from "vuex";

    export default {
        name: "IframePageView",
        data() {
            return {
                url: "",
                id: ""
            }
        },
        computed : {
            ...mapState({
                currentNav : ({app}) => app.currentNav
            })
        },
        watch: {
            $route(to, from) {
                this.goUrl();
            }
        },
        methods: {
            ...mapMutations({
                removeCurrent: 'REMOVE_NAV_TAG'
            }),
            goUrl() {
                let {path, meta: {url,internalOrExternal}} = this.$route
                this.id = path
                //url = "http://www.baidu.com"
                if (url !== null && url !== undefined) {
                    this.url = url;
                    /*update_begin author:wuxianquan date:20190908 for:判断打开方式，新窗口打开时this.$route.meta.internalOrExternal==true */
                    if (internalOrExternal !== undefined && internalOrExternal === true) {
                        new Promise((resolve) => {
                            this.removeCurrent(path);
                            resolve()
                        }).then(()=>{
                            this.$router.push(this.currentNav)
                        })
                        window.open(this.url);
                    }
                }
            }
        },
        created() {
            this.goUrl()
        },
        updated() {
            this.goUrl()
        },
    }
</script>

<style>
</style>