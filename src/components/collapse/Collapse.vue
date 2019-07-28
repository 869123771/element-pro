<template>
    <el-collapse v-model="collapse.activeNames" class="collapse">
        <el-collapse-item :name="collapse.name">
            <template slot="title">
                <slot name="collapse-title"></slot>
            </template>
            <slot name="collapse-content"></slot>
        </el-collapse-item>
    </el-collapse>
</template>

<script>
    export default {
        name: "Collapse",
        props: {
            collapseProps: {
                type: Object
            }
        },
        watch: {
            collapseProps: {
                handler(props) {
                    if (!this.validatenull(props)) {
                        let {activeNames} = this.collapse
                        let {title, name} = props
                        if (name) {
                            activeNames = [
                                ...activeNames,
                                name
                            ]
                        }
                        this.collapse = {
                            ...this.collapse,
                            activeNames,
                            title,
                            name
                        }
                    }
                },
                immediate: true
            },
        },
        data() {
            return {
                collapse: {
                    activeNames: [],
                    title: '',
                    name: ''
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .collapse {
        border : none;
        /deep/ .el-collapse-item {
            &__header {
                font-size: 14px;
                color: #1c2438;
                font-weight: 700;
                white-space: nowrap;
                padding-left: 0.5rem;
            }
            &__header.is-active{
                border-bottom-color : inherit;
            }
        }
    }
</style>