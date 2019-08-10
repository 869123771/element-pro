<template>
    <div>
        <slot name = "show"></slot>
        <div v-show = "show.collapse">
            <slot name = "hide"></slot>
        </div>
        <div class = "inline-block pl-4">
            <el-button type="primary" icon="el-icon-search" @click="$emit('search')">查询</el-button>
            <el-button plain icon="el-icon-refresh-left" @click="$emit('reset')">重置</el-button>
            <span class="cursor-pointer inline-block text-blue-500 pl-2" @click="arrowClick">
                <span v-if="!show.collapse">
                    <span>展开</span>
                    <i class="el-icon-arrow-down pl-1"></i>
                </span>
                <span v-else>
                    <span>收起</span>
                    <i class="el-icon-arrow-up pl-1"></i>
                </span>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Query",
        data() {
            return {
                show: {
                    collapse: false
                }
            }
        },
        props: {
            queryPad: {
                default: '40px'
            }
        },
        methods: {
            arrowClick() {
                let {collapse} = this.show
                this.show = {
                    ...this.show,
                    collapse: !collapse
                }
            },
        }
    }
</script>

<style scoped>

</style>