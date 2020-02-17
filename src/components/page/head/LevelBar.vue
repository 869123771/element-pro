<template>
    <div class="level-bar">
        <i class="iconfont icon-wy-shrink level-bar-shrink" :class="{'level-bar-rotate' : barShrink}" @click="shrink"></i>
    </div>
</template>
<script>
    import {mapMutations} from 'vuex'

    export default {
        name: 'Levelbar',
        data() {
            return {
                barShrink: false
            }
        },
        methods: {
            ...mapMutations({
                shrinkMenu : 'SHRINK_MENU'
            }),
            shrink() {
                this.barShrink = !this.barShrink
                this.shrinkMenu()
            }
        },
    }
</script>
<style scoped lang="less">
    .level-bar {
        line-height: 56px;
        padding: 0 8px;
        display: inline-block;
        width: auto;
        &-shrink {
            font-size: 24px;
            cursor: pointer;
            display: inline-block;
            transition: all 0.6s ease 0s;
            transform: rotate(0deg);
        }
        &-rotate {
            transform: rotate(90deg);
        }
    }
</style>
