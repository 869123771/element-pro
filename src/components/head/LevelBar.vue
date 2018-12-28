<template>
    <div class = "levelbar">
        <i class = "iconfont icon-shrink levelbar-shrink" :class="{barShrink}" @click = "shrink"></i>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
    export default {
        name : 'Levelbar',
        data(){
            return {
                barShrink : false
            }
        },
        methods : {
            ...mapMutations([
                'shrinkMenu'
            ]),
            shrink(){
                this.barShrink = !this.barShrink
                this.shrinkMenu()
            }
        },
    }
</script>
<style scoped lang = "less">
    .levelbar{
        line-height: 3.5rem;
        height:56px;
        &-shrink{
            font-size: 26px;
            padding: 0 1.25rem;
            cursor:pointer;
            display: inline-block;
            transition: all 0.6s ease 0s;
        }
        .barShrink{
            transform: rotate(90deg);
        }
    }
</style>