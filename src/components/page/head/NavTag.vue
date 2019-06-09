<template>
    <div class = "navTag">
        <template v-for = "item in navTagList">
            <Tag
                    type="dot"
                    size = "small"
                    :closable = "item.closable"
                    :color="item.current ? 'primary': 'default'"
                    @click.native = "routeTo(item.path)"
                    @on-close = "removeNavTag(item)"
            >
                {{item.title}}
            </Tag>
        </template>
    </div>
</template>

<script>
    import {mapGetters,mapMutations} from 'vuex'
    export default {
        name: "NavTag",
        computed : {
            /*...mapGetters([
                'navTagList'
            ])*/
        },
        data(){
            return {
                navTagList : []
            }
        },
        methods : {
            ...mapMutations(['removeNavTag']),
            routeTo(path){
                this.$router.push(path)
            }
        }
    }
</script>

<style scoped>

</style>
