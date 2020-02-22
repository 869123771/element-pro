<template>
    <div class="level-bar">
        <i class="iconfont icon-wy-shrink level-bar-shrink" :class="{'level-bar-rotate' : menuProps.collapse}" @click="shrink(menuProps.collapse)"></i>
    </div>
</template>
<script>
    import {mapState,mapMutations} from 'vuex'

    export default {
        name: 'Levelbar',
        data() {
            return {

            }
        },
        computed : {
            ...mapState({
                menuProps : ({app}) => app.menuProps
            })
        },
        methods: {
            ...mapMutations({
                shrinkMenu : 'SHRINK_MENU'
            }),
            shrink(collapse) {
                this.shrinkMenu(!collapse)
            }
        },
    }
</script>
<style scoped lang="less">
    .level-bar {
        height : inherit;
        line-height: 56px;
        padding: 0 10px;
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
