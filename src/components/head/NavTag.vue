<template>
    <div class = "navTag">
        <template v-for = "item in navTagList">
            <Tag
                    type="dot"
                    :closable = "item.closable"
                    :color="item.current ? 'primary': 'default'"
                    @click.native = "routeTo(item.path)">
                {{item.title}}
            </Tag>
        </template>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "NavTag",
        computed : {
            ...mapGetters([
                'navTagList'
            ])
        },
        methods : {
            routeTo(path){
                this.$router.push(path)
            }
        }
    }
</script>

<style scoped>

</style>
