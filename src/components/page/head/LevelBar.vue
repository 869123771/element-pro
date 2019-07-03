<template>
    <div class="levelbar">
        <i class="iconfont icon-wy-shrink levelbar-shrink" :class="{barShrink}" @click="shrink"></i>
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
    .levelbar {
        &-shrink {
            font-size: 24px;
            cursor: pointer;
            display: inline-block;
            transition: all 0.6s ease 0s;
        }
        &-shrink:hover {
            /*background-color: #ecf5ff;*/
        }
        &-user {
            position: absolute;
            right: 0;
            padding: 1rem;
        }
        .barShrink {
            transform: rotate(90deg);
        }
    }
</style>
