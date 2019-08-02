<template>
    <el-tabs v-model="tabs" type="card" closable @tab-click = "clickTab" @tab-remove="removeTab">
        <el-tab-pane
                v-for="item in navTagList"
                :key="item.name"
                :label="item.title"
                :name="item.path"
        >
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
    export default {
        name: "NavPanel",
        data(){
            return {
                tabs : ''
            }
        },
        computed : {
            ...mapState({
                navTagList : ({app}) => app.navTagList,
                currentNav : ({app}) => app.currentNav
            })
        },
        watch : {
            currentNav : {
                handler(path){
                    this.tabs = path
                    this.$router.push(path)
                },
                immediate : true
            }
        },
        methods : {
            ...mapMutations({
                removeCurrent : 'REMOVE_NAV_TAG'
            }),
            clickTab(tab){
               this.$router.push(tab.name)
            },
            removeTab(path){
               this.removeCurrent(path)
            }
        }
    }
</script>

<style scoped>

</style>