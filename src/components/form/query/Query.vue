<template>
    <div class="form-query">
        <slot name="show"></slot>
        <div v-show="show.collapse">
            <slot name="hide"></slot>
        </div>
        <div>
            <el-form-item class="inline-block">
                <el-button type="primary" icon="el-icon-search" @click="$emit('search')" v-waves>
                    {{$t('common_query')}}
                </el-button>
                <el-button plain icon="el-icon-refresh-left" @click="$emit('reset')" v-waves>{{$t('common_reset')}}
                </el-button>
            </el-form-item>
            <span class="cursor-pointer inline-block text-blue-500 pl-2" @click="arrowClick" v-show="showArrow">
                <span v-if="!show.collapse">
                    <span>{{$t('common_expand')}}</span>
                    <i class="el-icon-arrow-down pl-1"></i>
                </span>
                <span v-else>
                    <span>{{$t('common_fold')}}</span>
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
            showArrow: {
                type: Boolean,
                default: true
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

<style scoped lang="less">
    .form-query {
        /deep/ .el-form-item {
            margin-bottom: 14px;
        }
    }
</style>